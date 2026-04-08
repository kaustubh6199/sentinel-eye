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

interface ObjectSearchResult {
  objectLabel: string;
  found: boolean;
  confidence: number;
  location?: string;
  details: string;
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
  objectSearchResults?: ObjectSearchResult[];
}

const baseSystemPrompt = `You are an advanced Vision Language Model (VLM) security analyst for a Security Operations Center (SOC). Your role is to analyze camera feed images and provide comprehensive threat assessments.

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { cameraId, imageBase64, imageUrl, customPrompt, objectsOfInterest } = await req.json();

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

    // Build enhanced system prompt
    let systemPrompt = baseSystemPrompt;

    if (objectsOfInterest && objectsOfInterest.length > 0) {
      systemPrompt += `\n\nIMPORTANT - OBJECTS OF INTEREST SEARCH:
You must specifically look for and report on these objects/items of interest in the scene:
${objectsOfInterest.map((obj: string, i: number) => `${i + 1}. ${obj}`).join("\n")}

For each object of interest, determine:
- Whether it is found in the scene (true/false)
- Confidence level (0-100)
- Approximate location in the frame
- Detailed description of the finding`;
    }

    if (customPrompt) {
      systemPrompt += `\n\nADDITIONAL ANALYSIS INSTRUCTIONS FROM OPERATOR:
${customPrompt}`;
    }

    const imageContent = imageBase64
      ? { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      : { type: "image_url", image_url: { url: imageUrl } };

    let userMessage = `Analyze this security camera feed from camera ${cameraId}. Provide a comprehensive threat assessment.`;

    if (customPrompt) {
      userMessage += `\n\nOperator query: ${customPrompt}`;
    }

    if (objectsOfInterest && objectsOfInterest.length > 0) {
      userMessage += `\n\nSpecifically search for these objects of interest: ${objectsOfInterest.join(", ")}`;
    }

    console.log(`Processing VLM analysis for camera: ${cameraId}, custom prompt: ${!!customPrompt}, objects of interest: ${objectsOfInterest?.length || 0}`);

    // Build tool parameters - add objectSearchResults if objects of interest provided
    const toolProperties: Record<string, any> = {
      sceneDescription: { type: "string", description: "Detailed description of the scene" },
      detectedObjects: {
        type: "array",
        items: {
          type: "object",
          properties: {
            label: { type: "string" },
            confidence: { type: "number" },
            boundingBox: {
              type: "object",
              properties: { x: { type: "number" }, y: { type: "number" }, width: { type: "number" }, height: { type: "number" } }
            }
          },
          required: ["label", "confidence"]
        },
        description: "List of all detected objects in the scene"
      },
      riskLevel: { type: "string", enum: ["low", "medium", "high", "critical"] },
      riskScore: { type: "number", description: "Risk score 0-100" },
      riskReasoning: { type: "string" },
      anomalies: { type: "array", items: { type: "string" } },
      behaviorAnalysis: { type: "string" },
      recommendations: { type: "array", items: { type: "string" } },
    };

    const requiredFields = ["sceneDescription", "detectedObjects", "riskLevel", "riskScore", "riskReasoning", "anomalies", "behaviorAnalysis", "recommendations"];

    if (objectsOfInterest && objectsOfInterest.length > 0) {
      toolProperties.objectSearchResults = {
        type: "array",
        items: {
          type: "object",
          properties: {
            objectLabel: { type: "string", description: "The object being searched for" },
            found: { type: "boolean", description: "Whether the object was found" },
            confidence: { type: "number", description: "Confidence 0-100" },
            location: { type: "string", description: "Where in the frame the object was found" },
            details: { type: "string", description: "Detailed description of the finding" },
            boundingBox: {
              type: "object",
              properties: { x: { type: "number" }, y: { type: "number" }, width: { type: "number" }, height: { type: "number" } }
            }
          },
          required: ["objectLabel", "found", "confidence", "details"]
        },
        description: "Results for each object of interest searched"
      };
      requiredFields.push("objectSearchResults");
    }

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
          { role: "user", content: [{ type: "text", text: userMessage }, imageContent] },
        ],
        tools: [{
          type: "function",
          function: {
            name: "submit_threat_assessment",
            description: "Submit a structured threat assessment for the analyzed camera feed",
            parameters: {
              type: "object",
              properties: toolProperties,
              required: requiredFields,
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "submit_threat_assessment" } }
      }),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (response.status === 402) {
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
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "submit_threat_assessment") {
      return new Response(
        JSON.stringify({ error: "Invalid AI response format" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const analysisResult = JSON.parse(toolCall.function.arguments);
    const processingTimeMs = Date.now() - startTime;

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
      objectSearchResults: analysisResult.objectSearchResults,
    };

    console.log(`VLM analysis complete for ${cameraId}: Risk ${threatAssessment.riskLevel} (${threatAssessment.riskScore}), objects found: ${threatAssessment.objectSearchResults?.filter(r => r.found).length || 0}, processed in ${processingTimeMs}ms`);

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
