import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResendOTPRequest {
  email: string;
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email }: ResendOTPRequest = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Find the invitation
    const { data: invitation, error: inviteError } = await supabase
      .from("invitations")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .eq("status", "pending")
      .single();

    if (inviteError || !invitation) {
      return new Response(JSON.stringify({ error: "No pending invitation found for this email" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Generate new OTP
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Update invitation with new OTP
    const { error: updateError } = await supabase
      .from("invitations")
      .update({
        otp_code: otpCode,
        otp_expires_at: otpExpiresAt.toISOString(),
      })
      .eq("id", invitation.id);

    if (updateError) {
      console.error("Error updating OTP:", updateError);
      return new Response(JSON.stringify({ error: "Failed to generate new OTP" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Send new OTP email
    const appUrl = Deno.env.get("APP_URL") || "https://id-preview--2d9478ec-a6e1-4290-aa0b-97b28a07b83a.lovable.app";
    
    const emailResponse = await resend.emails.send({
      from: "SOC Dashboard <onboarding@resend.dev>",
      to: [email],
      subject: "Your new OTP code - SOC Dashboard",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f1419; color: #e7e9ea; }
            .container { max-width: 500px; margin: 40px auto; padding: 40px; background: #1a1f2e; border-radius: 12px; }
            .header { text-align: center; margin-bottom: 30px; }
            .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #3b82f6; text-align: center; padding: 20px; background: #0f1419; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 New OTP Code</h1>
            </div>
            <p>Here is your new OTP code for SOC Dashboard:</p>
            <div class="otp-code">${otpCode}</div>
            <p>This code will expire in <strong>30 minutes</strong>.</p>
            <div class="footer">
              <p>If you didn't request this code, please ignore this email.</p>
              <p>© 2025 SOC Dashboard - Security Operations Center</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("New OTP email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "New OTP sent successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in resend-otp function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
