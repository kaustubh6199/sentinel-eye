import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DetectedObject {
  label: string;
  confidence: number;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

interface ThreatAssessment {
  cameraId: string;
  timestamp: string;
  modelVersion: string;
  processingTimeMs: number;
  sceneDescription: string;
  detectedObjects: DetectedObject[];
  riskLevel: "low" | "medium" | "high" | "critical";
  riskScore: number;
  riskReasoning: string;
  anomalies: string[];
  behaviorAnalysis: string;
  recommendations: string[];
}

const systemPrompt = `You are an advanced Vision Language Model (VLM) security analyst for a Security Operations Center (SOC). Your role is to analyze camera feed images and provide comprehensive threat assessments.

When analyzing an image, you must provide:
1. A detailed scene description
2. All detected objects with confidence scores (0-100)
3. Risk assessment with level (low/medium/high/critical) and score (0-100)
4. Any anomalies or suspicious activities
5. Behavioral analysis of people/vehicles in the scene
6. Security recommendations

Focus on security-relevant observations:
- Unauthorized access attempts
- Suspicious behavior patterns
- Crowd density and movement
- Unattended objects
- Perimeter breaches
- Vehicle anomalies
- Environmental hazards

Be precise, professional, and err on the side of caution for security matters.`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { cameraId, imageBase64, imageUrl } = await req.json();

    if (!cameraId) {
      return new Response(
        JSON.stringify({ error: "cameraId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!imageBase64 && !imageUrl) {
      return new Response(
        JSON.stringify({ error: "Either imageBase64 or imageUrl is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the image content for the API
    const imageContent = imageBase64
      ? { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      : { type: "image_url", image_url: { url: imageUrl } };

    const userMessage = `Analyze this security camera feed from camera ${cameraId}. Provide a comprehensive threat assessment.`;

    console.log(`Processing VLM analysis for camera: ${cameraId}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userMessage },
              imageContent,
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_threat_assessment",
              description: "Submit a structured threat assessment for the analyzed camera feed",
              parameters: {
                type: "object",
                properties: {
                  sceneDescription: {
                    type: "string",
                    description: "Detailed description of the scene"
                  },
                  detectedObjects: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        label: { type: "string", description: "Object label/type" },
                        confidence: { type: "number", description: "Confidence score 0-100" },
                        boundingBox: {
                          type: "object",
                          properties: {
                            x: { type: "number" },
                            y: { type: "number" },
                            width: { type: "number" },
                            height: { type: "number" }
                          }
                        }
                      },
                      required: ["label", "confidence"]
                    },
                    description: "List of detected objects"
                  },
                  riskLevel: {
                    type: "string",
                    enum: ["low", "medium", "high", "critical"],
                    description: "Overall risk level"
                  },
                  riskScore: {
                    type: "number",
                    description: "Risk score from 0-100"
                  },
                  riskReasoning: {
                    type: "string",
                    description: "Explanation for the risk assessment"
                  },
                  anomalies: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of detected anomalies or suspicious activities"
                  },
                  behaviorAnalysis: {
                    type: "string",
                    description: "Analysis of behavioral patterns observed"
                  },
                  recommendations: {
                    type: "array",
                    items: { type: "string" },
                    description: "Security recommendations based on analysis"
                  }
                },
                required: ["sceneDescription", "detectedObjects", "riskLevel", "riskScore", "riskReasoning", "anomalies", "behaviorAnalysis", "recommendations"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "submit_threat_assessment" } }
      }),
    });

    // Handle rate limiting and payment errors
    if (response.status === 429) {
      console.error("Rate limit exceeded");
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (response.status === 402) {
      console.error("Payment required");
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("VLM response received:", JSON.stringify(data).slice(0, 500));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "submit_threat_assessment") {
      console.error("Invalid tool call response");
      return new Response(
        JSON.stringify({ error: "Invalid AI response format" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const analysisResult = JSON.parse(toolCall.function.arguments);
    const processingTimeMs = Date.now() - startTime;

    // Build the complete threat assessment
    const threatAssessment: ThreatAssessment = {
      cameraId,
      timestamp: new Date().toISOString(),
      modelVersion: "gemini-2.5-pro",
      processingTimeMs,
      sceneDescription: analysisResult.sceneDescription,
      detectedObjects: analysisResult.detectedObjects,
      riskLevel: analysisResult.riskLevel,
      riskScore: analysisResult.riskScore,
      riskReasoning: analysisResult.riskReasoning,
      anomalies: analysisResult.anomalies,
      behaviorAnalysis: analysisResult.behaviorAnalysis,
      recommendations: analysisResult.recommendations,
    };

    console.log(`VLM analysis complete for ${cameraId}: Risk ${threatAssessment.riskLevel} (${threatAssessment.riskScore}), processed in ${processingTimeMs}ms`);

    return new Response(JSON.stringify(threatAssessment), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("VLM analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
