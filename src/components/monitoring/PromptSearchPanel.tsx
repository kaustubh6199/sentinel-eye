import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  X, 
  Send, 
  Crosshair, 
  AlertTriangle,
  CheckCircle2,
  Target,
  Loader2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ObjectOfInterest, ObjectSearchResult } from "@/types/vlm";
import { Separator } from "@/components/ui/separator";

interface PromptSearchPanelProps {
  onAnalyze: (prompt: string, objectsOfInterest: string[]) => void;
  isAnalyzing: boolean;
  searchResults?: ObjectSearchResult[];
  className?: string;
}

const defaultObjectsOfInterest: ObjectOfInterest[] = [
  { id: "1", label: "Weapon / Firearm", priority: "critical", active: false, description: "Guns, knives, or any weapon-like objects" },
  { id: "2", label: "Unattended Bag", priority: "high", active: false, description: "Bags, backpacks, or packages left unattended" },
  { id: "3", label: "Face Mask / Disguise", priority: "medium", active: false, description: "Individuals with face coverings or disguises" },
  { id: "4", label: "Unauthorized Vehicle", priority: "high", active: false, description: "Vehicles in restricted zones" },
  { id: "5", label: "Crowd Formation", priority: "medium", active: false, description: "Unusual crowd gathering or formation" },
  { id: "6", label: "Perimeter Breach", priority: "critical", active: false, description: "Individuals crossing restricted boundaries" },
  { id: "7", label: "Fire / Smoke", priority: "critical", active: false, description: "Signs of fire, smoke, or hazardous conditions" },
  { id: "8", label: "Uniform / Badge", priority: "low", active: false, description: "Personnel wearing uniforms or ID badges" },
];

export function PromptSearchPanel({ onAnalyze, isAnalyzing, searchResults, className }: PromptSearchPanelProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  const [objects, setObjects] = useState<ObjectOfInterest[]>(defaultObjectsOfInterest);
  const [newObjectLabel, setNewObjectLabel] = useState("");
  const [newObjectPriority, setNewObjectPriority] = useState<"low" | "medium" | "high" | "critical">("medium");

  const activeObjects = objects.filter(o => o.active);

  const toggleObject = (id: string) => {
    setObjects(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o));
  };

  const addCustomObject = () => {
    if (!newObjectLabel.trim()) return;
    const newObj: ObjectOfInterest = {
      id: `custom-${Date.now()}`,
      label: newObjectLabel.trim(),
      priority: newObjectPriority,
      active: true,
    };
    setObjects(prev => [...prev, newObj]);
    setNewObjectLabel("");
  };

  const removeObject = (id: string) => {
    setObjects(prev => prev.filter(o => o.id !== id));
  };

  const handleAnalyze = () => {
    const objectLabels = activeObjects.map(o => o.label);
    onAnalyze(customPrompt, objectLabels);
  };

  const priorityColors = {
    low: "bg-muted text-muted-foreground border-border",
    medium: "bg-status-warning/10 text-status-warning border-status-warning/30",
    high: "bg-status-critical/10 text-status-critical border-status-critical/30",
    critical: "bg-status-critical/20 text-status-critical border-status-critical/50",
  };

  return (
    <div className={cn("bg-card border border-border rounded-lg overflow-hidden", className)}>
      {/* Header */}
      <div className="px-4 py-3 bg-secondary/30 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
          <Search className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Prompt-Based Object Search</h3>
          <p className="text-2xs text-muted-foreground">Query the AI model with custom prompts & objects of interest</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Custom Prompt */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Custom Analysis Prompt
          </div>
          <Textarea
            placeholder="e.g., 'Check if any person is loitering near the ATM for more than 2 minutes' or 'Identify all vehicles with license plates visible'..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="bg-background text-sm min-h-[80px] resize-none"
          />
        </div>

        <Separator />

        {/* Objects of Interest */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
              <Crosshair className="w-3.5 h-3.5 text-primary" />
              Objects of Interest
            </div>
            <Badge variant="outline" className="text-2xs">
              {activeObjects.length} active
            </Badge>
          </div>

          {/* Predefined Objects Grid */}
          <div className="flex flex-wrap gap-2">
            {objects.map((obj) => (
              <button
                key={obj.id}
                onClick={() => toggleObject(obj.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs transition-all",
                  obj.active
                    ? priorityColors[obj.priority]
                    : "bg-secondary/20 text-muted-foreground border-border hover:bg-secondary/40"
                )}
              >
                {obj.active ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <Target className="w-3 h-3" />
                )}
                {obj.label}
                {obj.id.startsWith("custom-") && (
                  <X
                    className="w-3 h-3 ml-1 hover:text-foreground"
                    onClick={(e) => { e.stopPropagation(); removeObject(obj.id); }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Add Custom Object */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add custom object..."
              value={newObjectLabel}
              onChange={(e) => setNewObjectLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomObject()}
              className="bg-background text-xs h-8 flex-1"
            />
            <Select value={newObjectPriority} onValueChange={(v) => setNewObjectPriority(v as any)}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              onClick={addCustomObject}
              disabled={!newObjectLabel.trim()}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (!customPrompt.trim() && activeObjects.length === 0)}
          className="w-full gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing Scene...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Run AI Analysis
            </>
          )}
        </Button>

        {/* Search Results */}
        {searchResults && searchResults.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Target className="w-3.5 h-3.5 text-primary" />
                Object Search Results
              </div>
              <div className="space-y-2">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-md border",
                      result.found
                        ? "bg-status-critical/5 border-status-critical/20"
                        : "bg-status-healthy/5 border-status-healthy/20"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {result.found ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-status-critical" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-status-healthy" />
                        )}
                        <span className="text-xs font-medium text-foreground">{result.objectLabel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-2xs",
                            result.found
                              ? "text-status-critical border-status-critical/30"
                              : "text-status-healthy border-status-healthy/30"
                          )}
                        >
                          {result.found ? "FOUND" : "NOT FOUND"}
                        </Badge>
                        <span className="text-2xs font-mono text-muted-foreground">{result.confidence}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{result.details}</p>
                    {result.location && (
                      <p className="text-2xs text-muted-foreground mt-1">📍 {result.location}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
