
-- Create zones table
CREATE TABLE public.zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  x_position DOUBLE PRECISION NOT NULL DEFAULT 10,
  y_position DOUBLE PRECISION NOT NULL DEFAULT 10,
  width DOUBLE PRECISION NOT NULL DEFAULT 20,
  height DOUBLE PRECISION NOT NULL DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cameras table
CREATE TABLE public.cameras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rtsp_url TEXT NOT NULL,
  zone_id UUID REFERENCES public.zones(id) ON DELETE SET NULL,
  x_position DOUBLE PRECISION NOT NULL DEFAULT 50,
  y_position DOUBLE PRECISION NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'online',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cameras ENABLE ROW LEVEL SECURITY;

-- Zones policies
CREATE POLICY "Authenticated users can view zones" ON public.zones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage zones" ON public.zones FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Cameras policies
CREATE POLICY "Authenticated users can view cameras" ON public.cameras FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage cameras" ON public.cameras FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON public.zones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cameras_updated_at BEFORE UPDATE ON public.cameras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
