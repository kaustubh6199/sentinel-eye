import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import LiveMonitoring from "@/pages/LiveMonitoring";
import EventsIncidents from "@/pages/EventsIncidents";
import EventDetail from "@/pages/EventDetail";
import PredictiveAlerts from "@/pages/PredictiveAlerts";
import CameraMap from "@/pages/CameraMap";
import AuditLogs from "@/pages/AuditLogs";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<LiveMonitoring />} />
            <Route path="/events" element={<EventsIncidents />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/predictive" element={<PredictiveAlerts />} />
            <Route path="/map" element={<CameraMap />} />
            <Route path="/audit" element={<AuditLogs />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
