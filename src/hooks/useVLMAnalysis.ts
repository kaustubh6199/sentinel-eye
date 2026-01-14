import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ThreatAssessment, VLMAnalysisRequest } from "@/types/vlm";
import { toast } from "sonner";

export function useVLMAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState<ThreatAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeCamera = useCallback(async (request: VLMAnalysisRequest): Promise<ThreatAssessment | null> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke("vlm-analysis", {
        body: request,
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (data.error) {
        // Handle specific error cases
        if (data.error.includes("Rate limit")) {
          toast.error("Rate limit exceeded. Please wait before analyzing again.");
        } else if (data.error.includes("credits")) {
          toast.error("AI credits exhausted. Please add funds to continue.");
        } else {
          toast.error(data.error);
        }
        throw new Error(data.error);
      }

      const assessment = data as ThreatAssessment;
      setLatestAnalysis(assessment);

      // Show toast based on risk level
      if (assessment.riskLevel === "critical") {
        toast.error(`Critical threat detected on ${assessment.cameraId}!`, {
          description: assessment.riskReasoning,
          duration: 10000,
        });
      } else if (assessment.riskLevel === "high") {
        toast.warning(`High risk detected on ${assessment.cameraId}`, {
          description: assessment.riskReasoning,
          duration: 7000,
        });
      }

      return assessment;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analysis failed";
      setError(message);
      console.error("VLM analysis error:", err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setLatestAnalysis(null);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    latestAnalysis,
    error,
    analyzeCamera,
    clearAnalysis,
  };
}
