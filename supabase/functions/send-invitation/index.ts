import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  role: "operator" | "viewer";
  inviterName?: string;
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

    // Get the authenticated user from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Check if user is admin
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Only admins can send invitations" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { email, role, inviterName }: InvitationRequest = await req.json();

    if (!email || !role) {
      return new Response(JSON.stringify({ error: "Email and role are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Check if email already has a pending invitation or is already a user
    const { data: existingInvitation } = await supabase
      .from("invitations")
      .select("*")
      .eq("email", email)
      .single();

    if (existingInvitation && existingInvitation.status === "accepted") {
      return new Response(JSON.stringify({ error: "This email has already been registered" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Upsert invitation
    const { data: invitation, error: inviteError } = await supabase
      .from("invitations")
      .upsert({
        email,
        role,
        otp_code: otpCode,
        otp_expires_at: otpExpiresAt.toISOString(),
        invited_by: user.id,
        status: "pending",
      }, { onConflict: "email" })
      .select()
      .single();

    if (inviteError) {
      console.error("Error creating invitation:", inviteError);
      return new Response(JSON.stringify({ error: "Failed to create invitation" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Send invitation email with OTP
    const appUrl = Deno.env.get("APP_URL") || "https://id-preview--2d9478ec-a6e1-4290-aa0b-97b28a07b83a.lovable.app";
    
    const emailResponse = await resend.emails.send({
      from: "SOC Dashboard <onboarding@resend.dev>",
      to: [email],
      subject: "You've been invited to SOC Dashboard",
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
            .link { color: #3b82f6; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 SOC Dashboard Invitation</h1>
            </div>
            <p>Hello,</p>
            <p>${inviterName ? `${inviterName} has` : "You have been"} invited you to join the SOC Dashboard as a <strong>${role}</strong>.</p>
            <p>Use the following OTP code to complete your registration:</p>
            <div class="otp-code">${otpCode}</div>
            <p>This code will expire in <strong>30 minutes</strong>.</p>
            <p>To complete your registration, visit: <a href="${appUrl}/auth" class="link">${appUrl}/auth</a></p>
            <div class="footer">
              <p>If you didn't request this invitation, please ignore this email.</p>
              <p>© 2025 SOC Dashboard - Security Operations Center</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Invitation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Invitation sent successfully",
      invitation_id: invitation.id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-invitation function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
