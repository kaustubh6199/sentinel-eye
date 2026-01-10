import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Download,
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock report data
const eventsByType = [
  { type: "Intrusion", count: 45 },
  { type: "Loitering", count: 128 },
  { type: "Crowding", count: 67 },
  { type: "Motion", count: 234 },
  { type: "Vehicle", count: 89 },
  { type: "Other", count: 34 },
];

const decisionBreakdown = [
  { name: "Confirmed", value: 312, color: "hsl(var(--decision-approved))" },
  { name: "False Positive", value: 178, color: "hsl(var(--decision-dismissed))" },
  { name: "Escalated", value: 45, color: "hsl(var(--status-critical))" },
  { name: "Pending", value: 62, color: "hsl(var(--decision-pending))" },
];

const recentReports = [
  {
    id: "RPT-2024-0110",
    name: "Daily Incident Summary",
    date: "2024-01-10",
    type: "Automated",
    status: "Ready",
  },
  {
    id: "RPT-2024-0109",
    name: "Weekly Analytics Report",
    date: "2024-01-09",
    type: "Scheduled",
    status: "Ready",
  },
  {
    id: "RPT-2024-0108",
    name: "Monthly Compliance Report",
    date: "2024-01-08",
    type: "Compliance",
    status: "Ready",
  },
  {
    id: "RPT-2024-0105",
    name: "Camera Performance Audit",
    date: "2024-01-05",
    type: "Technical",
    status: "Ready",
  },
];

export default function Reports() {
  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Reports & Exports
            </h2>
            <p className="text-sm text-muted-foreground">
              Analytics, summaries, and compliance documentation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="today">
              <SelectTrigger className="w-40 bg-background">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2">
              <FileText className="w-4 h-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xs text-muted-foreground">Total Events</p>
                    <p className="text-2xl font-bold text-foreground">597</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-status-healthy" />
                  <span className="text-2xs text-status-healthy">+12% from yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xs text-muted-foreground">Confirmed Events</p>
                    <p className="text-2xl font-bold text-foreground">312</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-decision-approved/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-decision-approved" />
                  </div>
                </div>
                <p className="text-2xs text-muted-foreground mt-2">52.3% confirmation rate</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xs text-muted-foreground">False Positives</p>
                    <p className="text-2xl font-bold text-foreground">178</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-decision-dismissed/10 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-decision-dismissed" />
                  </div>
                </div>
                <p className="text-2xs text-muted-foreground mt-2">29.8% dismissal rate</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xs text-muted-foreground">Avg Response Time</p>
                    <p className="text-2xl font-bold text-foreground">4.2m</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-status-info/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-status-info" />
                  </div>
                </div>
                <p className="text-2xs text-status-healthy mt-2">Within SLA target</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Events by Type */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Events by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={eventsByType} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        stroke="hsl(var(--border))"
                      />
                      <YAxis
                        dataKey="type"
                        type="category"
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        stroke="hsl(var(--border))"
                        width={70}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(var(--primary))"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Decision Breakdown */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-decision-approved" />
                  Decision Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={decisionBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {decisionBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {decisionBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-2xs text-muted-foreground">
                        {item.name}: {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Recent Reports
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {report.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-2xs text-muted-foreground">
                            {report.id}
                          </span>
                          <span className="text-2xs text-muted-foreground">•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-2xs text-muted-foreground">
                              {report.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                        {report.type}
                      </span>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        Download
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
