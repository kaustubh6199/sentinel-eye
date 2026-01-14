export interface DetectedObject {
  label: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ThreatAssessment {
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

export interface VLMAnalysisRequest {
  cameraId: string;
  imageBase64?: string;
  imageUrl?: string;
}
