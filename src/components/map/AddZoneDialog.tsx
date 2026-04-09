import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddZoneDialogProps {
  onZoneAdded: () => void;
}

const ZONE_COLORS = [
  { label: "Blue", value: "#3b82f6" },
  { label: "Green", value: "#22c55e" },
  { label: "Red", value: "#ef4444" },
  { label: "Yellow", value: "#eab308" },
  { label: "Purple", value: "#a855f7" },
  { label: "Cyan", value: "#06b6d4" },
];

export function AddZoneDialog({ onZoneAdded }: AddZoneDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [xPos, setXPos] = useState("10");
  const [yPos, setYPos] = useState("10");
  const [width, setWidth] = useState("20");
  const [height, setHeight] = useState("20");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Zone name is required");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("zones").insert({
      name,
      color,
      x_position: parseFloat(xPos) || 10,
      y_position: parseFloat(yPos) || 10,
      width: parseFloat(width) || 20,
      height: parseFloat(height) || 20,
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to add zone: " + error.message);
      return;
    }
    toast.success("Zone added successfully");
    setName("");
    setColor("#3b82f6");
    setXPos("10");
    setYPos("10");
    setWidth("20");
    setHeight("20");
    setOpen(false);
    onZoneAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Plus className="w-4 h-4" />
          Add Zone
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Zone</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="zone-name">Zone Name</Label>
            <Input id="zone-name" placeholder="e.g. Zone A" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {ZONE_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${color === c.value ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>X Position (%)</Label>
              <Input type="number" min="0" max="100" value={xPos} onChange={(e) => setXPos(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Y Position (%)</Label>
              <Input type="number" min="0" max="100" value={yPos} onChange={(e) => setYPos(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Width (%)</Label>
              <Input type="number" min="5" max="100" value={width} onChange={(e) => setWidth(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Height (%)</Label>
              <Input type="number" min="5" max="100" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Zone"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
