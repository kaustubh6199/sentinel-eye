import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

interface AddCameraDialogProps {
  zones: Tables<"zones">[];
  onCameraAdded: () => void;
}

export function AddCameraDialog({ zones, onCameraAdded }: AddCameraDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [rtspUrl, setRtspUrl] = useState("");
  const [zoneId, setZoneId] = useState<string>("none");
  const [xPos, setXPos] = useState("50");
  const [yPos, setYPos] = useState("50");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rtspUrl) {
      toast.error("Name and RTSP URL are required");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("cameras").insert({
      name,
      rtsp_url: rtspUrl,
      zone_id: zoneId === "none" ? null : zoneId,
      x_position: parseFloat(xPos) || 50,
      y_position: parseFloat(yPos) || 50,
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to add camera: " + error.message);
      return;
    }
    toast.success("Camera added successfully");
    setName("");
    setRtspUrl("");
    setZoneId("none");
    setXPos("50");
    setYPos("50");
    setOpen(false);
    onCameraAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" />
          Add Camera
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Camera</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cam-name">Camera Name</Label>
            <Input id="cam-name" placeholder="e.g. Front Entrance" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rtsp-url">RTSP URL</Label>
            <Input id="rtsp-url" placeholder="rtsp://192.168.1.100:554/stream" value={rtspUrl} onChange={(e) => setRtspUrl(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Zone</Label>
            <Select value={zoneId} onValueChange={setZoneId}>
              <SelectTrigger><SelectValue placeholder="Select zone" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Zone</SelectItem>
                {zones.map((z) => (
                  <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="x-pos">X Position (%)</Label>
              <Input id="x-pos" type="number" min="0" max="100" value={xPos} onChange={(e) => setXPos(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="y-pos">Y Position (%)</Label>
              <Input id="y-pos" type="number" min="0" max="100" value={yPos} onChange={(e) => setYPos(e.target.value)} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Camera"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
