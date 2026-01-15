import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import LiveMonitoring from "@/pages/LiveMonitoring";
import VLMMonitoring from "@/pages/VLMMonitoring";
import EventsIncidents from "@/pages/EventsIncidents";
import EventDetail from "@/pages/EventDetail";
import PredictiveAlerts from "@/pages/PredictiveAlerts";
import CameraMap from "@/pages/CameraMap";
import AuditLogs from "@/pages/AuditLogs";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Documentation from "@/pages/Documentation";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/*"
            element={
              <AuthGuard>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<LiveMonitoring />} />
                    <Route path="/vlm" element={<VLMMonitoring />} />
                    <Route path="/events" element={<EventsIncidents />} />
                    <Route path="/events/:id" element={<EventDetail />} />
                    <Route path="/predictive" element={<PredictiveAlerts />} />
                    <Route path="/map" element={<CameraMap />} />
                    <Route path="/audit" element={<AuditLogs />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/docs" element={<Documentation />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </DashboardLayout>
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
