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

export interface ObjectOfInterest {
  id: string;
  label: string;
  description?: string;
  priority: "low" | "medium" | "high" | "critical";
  active: boolean;
}

export interface ObjectSearchResult {
  objectLabel: string;
  found: boolean;
  confidence: number;
  location?: string;
  details: string;
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
  objectSearchResults?: ObjectSearchResult[];
}

export interface VLMAnalysisRequest {
  cameraId: string;
  imageBase64?: string;
  imageUrl?: string;
  customPrompt?: string;
  objectsOfInterest?: string[];
}
