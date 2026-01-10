import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/monitoring/RiskBadge";
import {
  Brain,
  TrendingUp,
  Clock,
  AlertTriangle,
  Info,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Mock chart data
const crowdDensityData = [
  { time: "08:00", density: 12, baseline: 15 },
  { time: "09:00", density: 28, baseline: 25 },
  { time: "10:00", density: 45, baseline: 40 },
  { time: "11:00", density: 52, baseline: 50 },
  { time: "12:00", density: 78, baseline: 65 },
  { time: "13:00", density: 85, baseline: 70 },
  { time: "14:00", density: 72, baseline: 60 },
  { time: "14:30", density: 68, baseline: 55 },
];

const riskScoreData = [
  { time: "08:00", score: 15 },
  { time: "09:00", score: 22 },
  { time: "10:00", score: 35 },
  { time: "11:00", score: 42 },
  { time: "12:00", score: 58 },
  { time: "13:00", score: 72 },
  { time: "14:00", score: 65 },
  { time: "14:30", score: 78 },
];

// Mock predictive alerts
const predictiveAlerts = [
  {
    id: 1,
    prediction: "Crowd surge likely in Zone A within 15 minutes",
    confidence: 87,
    riskLevel: "high" as const,
    timeframe: "15 min",
    basis: "Based on current ingress rate and historical patterns for this time window",
  },
  {
    id: 2,
    prediction: "Anomalous activity probability rising in Perimeter East",
    confidence: 72,
    riskLevel: "moderate" as const,
    timeframe: "30 min",
    basis: "Movement patterns deviating from 7-day baseline by 2.3 standard deviations",
  },
  {
    id: 3,
    prediction: "Potential congestion at Loading Dock during shift change",
    confidence: 91,
    riskLevel: "moderate" as const,
    timeframe: "45 min",
    basis: "Recurring pattern identified from 30-day historical data",
  },
  {
    id: 4,
    prediction: "Low visibility conditions expected - reduced detection accuracy",
    confidence: 68,
    riskLevel: "low" as const,
    timeframe: "2 hrs",
    basis: "Weather data integration and lighting schedule analysis",
  },
];

export default function PredictiveAlerts() {
  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Predictive Intelligence
            </h2>
            <p className="text-sm text-muted-foreground">
              AI-powered forecasting and trend analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Last updated: 14:32:15 IST
            </span>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Disclaimer Banner */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-decision-ai/10 border border-decision-ai/20">
            <Info className="w-5 h-5 text-decision-ai flex-shrink-0" />
            <p className="text-sm text-foreground">
              <span className="font-semibold">Important:</span> Predictions are
              probabilistic forecasts based on historical patterns and current data.
              All predictions require human validation before any action is taken.
            </p>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Crowd Density Trend */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Crowd Density Trend
                  </CardTitle>
                  <span className="text-2xs text-muted-foreground">Zone A</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={crowdDensityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        stroke="hsl(var(--border))"
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        stroke="hsl(var(--border))"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="baseline"
                        stroke="hsl(var(--muted-foreground))"
                        fill="hsl(var(--muted))"
                        strokeDasharray="5 5"
                        name="Baseline"
                      />
                      <Area
                        type="monotone"
                        dataKey="density"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary) / 0.2)"
                        name="Current"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-primary" />
                    <span className="text-2xs text-muted-foreground">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-muted-foreground border-dashed" />
                    <span className="text-2xs text-muted-foreground">30-day Baseline</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Score Over Time */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-status-warning" />
                    Aggregate Risk Score
                  </CardTitle>
                  <span className="text-2xs text-muted-foreground">All Zones</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={riskScoreData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        stroke="hsl(var(--border))"
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        stroke="hsl(var(--border))"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--status-warning))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--status-warning))", strokeWidth: 0 }}
                        name="Risk Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between mt-2 text-2xs">
                  <span className="text-muted-foreground">
                    Current: <span className="text-status-warning font-semibold">78</span>
                  </span>
                  <span className="text-muted-foreground">
                    Threshold: <span className="text-status-critical font-semibold">85</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Predictive Alerts List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Brain className="w-4 h-4 text-decision-ai" />
                  Active Predictions
                </CardTitle>
                <span className="text-2xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                  {predictiveAlerts.length} Alerts
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {predictiveAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <RiskBadge level={alert.riskLevel} />
                          <div className="flex items-center gap-1.5 text-2xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {alert.timeframe}
                          </div>
                          <span className="text-2xs text-muted-foreground">
                            {alert.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          {alert.prediction}
                        </p>
                        <p className="text-2xs text-muted-foreground">
                          {alert.basis}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
