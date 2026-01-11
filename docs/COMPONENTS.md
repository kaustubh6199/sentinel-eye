# Component Library Reference

This document provides comprehensive documentation for all custom components in the SOC Dashboard.

## Table of Contents

- [Layout Components](#layout-components)
- [Monitoring Components](#monitoring-components)
- [UI Components](#ui-components)
- [Design Tokens](#design-tokens)

---

## Layout Components

### DashboardLayout

The main wrapper component that provides the overall dashboard structure.

```tsx
import { DashboardLayout } from "@/components/layout/DashboardLayout";

<DashboardLayout>
  <YourPageContent />
</DashboardLayout>
```

**Structure:**
- Global header (top)
- Navigation sidebar (left)
- Main content area (center)

---

### GlobalHeader

Displays system information and user context at the top of the dashboard.

```tsx
import { GlobalHeader } from "@/components/layout/GlobalHeader";

<GlobalHeader />
```

**Features:**
- System branding
- Real-time clock (IST timezone)
- User role display
- System health indicator (green/amber/red)
- Notification badge

---

### NavigationSidebar

Collapsible navigation menu with role-based access control.

```tsx
import { NavigationSidebar } from "@/components/layout/NavigationSidebar";

<NavigationSidebar />
```

**Navigation Items:**
| Route | Label | Icon |
|-------|-------|------|
| `/` | Live Monitoring | MonitorPlay |
| `/vlm` | VLM Analysis | Scan |
| `/events` | Events & Incidents | FileText |
| `/predictive` | Predictive Alerts | TrendingUp |
| `/map` | Camera Map | Map |
| `/audit` | Audit Logs | ScrollText |
| `/reports` | Reports | PieChart |
| `/settings` | Settings | Settings |

---

## Monitoring Components

### CameraTile

Displays a single camera feed thumbnail with status information.

```tsx
import { CameraTile } from "@/components/monitoring/CameraTile";

interface CameraTileProps {
  cameraId: string;           // Unique camera identifier
  location: string;           // Physical location description
  zone: string;               // Zone designation (e.g., "Zone A")
  status: "online" | "offline" | "alert";
  lastEvent?: {
    type: string;             // Event type (e.g., "Intrusion Detected")
    timestamp: string;        // Human-readable timestamp
    confidence: number;       // 0-100 confidence percentage
  };
  onClick?: () => void;       // Click handler for detail view
}

<CameraTile
  cameraId="CAM-001"
  location="Main Entrance Gate A"
  zone="Zone A"
  status="online"
  lastEvent={{
    type: "Intrusion Detected",
    timestamp: "14:32:15",
    confidence: 92
  }}
  onClick={() => openCameraDetail("CAM-001")}
/>
```

**Visual States:**
| Status | Border | Indicator | Effect |
|--------|--------|-----------|--------|
| online | default | green dot | none |
| offline | default | gray dot | none |
| alert | red glow | pulsing red | critical highlight |

---

### StatusBadge

Displays the review status of an event.

```tsx
import { StatusBadge } from "@/components/monitoring/StatusBadge";

interface StatusBadgeProps {
  status: "pending" | "approved" | "dismissed" | "escalated";
}

<StatusBadge status="pending" />
```

**Status Colors:**
| Status | Color | Label |
|--------|-------|-------|
| pending | `--decision-pending` (yellow) | Pending Review |
| approved | `--decision-approved` (green) | Confirmed |
| dismissed | `--decision-dismissed` (gray) | False Positive |
| escalated | `--status-critical` (red) | Escalated |

---

### RiskBadge

Displays risk level with numerical score.

```tsx
import { RiskBadge } from "@/components/monitoring/RiskBadge";

interface RiskBadgeProps {
  level: "low" | "moderate" | "high" | "critical";
  score: number;  // 0-100
}

<RiskBadge level="high" score={87} />
```

**Risk Levels:**
| Level | Color Token | Score Range |
|-------|-------------|-------------|
| low | `--risk-low` | 0-30 |
| moderate | `--risk-moderate` | 31-60 |
| high | `--risk-high` | 61-85 |
| critical | `--risk-critical` | 86-100 |

---

### ConfidenceMeter

Displays AI confidence as a visual progress bar with percentage.

```tsx
import { ConfidenceMeter } from "@/components/monitoring/ConfidenceMeter";

interface ConfidenceMeterProps {
  value: number;              // 0-100 percentage
  size?: "sm" | "md" | "lg";  // Size variant (default: "sm")
}

<ConfidenceMeter value={92} size="md" />
```

**Confidence Thresholds:**
| Range | Color | Interpretation |
|-------|-------|----------------|
| 85-100 | `--confidence-high` (green) | High confidence |
| 60-84 | `--confidence-medium` (yellow) | Medium confidence |
| 0-59 | `--confidence-low` (red) | Low confidence |

---

### VLMAnalysis

Comprehensive Vision-Language Model output display.

```tsx
import { VLMAnalysis } from "@/components/monitoring/VLMAnalysis";

interface DetectedObject {
  label: string;
  confidence: number;
  boundingBox?: { x: number; y: number; width: number; height: number };
  icon?: React.ReactNode;
}

interface VLMAnalysisProps {
  cameraId: string;
  timestamp: string;
  sceneDescription: string;       // Natural language scene description
  detectedObjects: DetectedObject[];
  riskAssessment: {
    level: "low" | "medium" | "high" | "critical";
    score: number;
    reasoning: string;            // AI explanation for risk level
  };
  anomalies: string[];            // List of detected anomalies
  behaviorAnalysis?: string;      // Optional behavior interpretation
  processingTime?: number;        // Inference time in milliseconds
  modelVersion?: string;          // VLM model version string
  className?: string;
}

<VLMAnalysis
  cameraId="CAM-001"
  timestamp="14:32:15 IST"
  sceneDescription="Indoor corridor with two individuals present..."
  detectedObjects={[
    { label: "Person A (Stationary)", confidence: 96 },
    { label: "Security Door", confidence: 94 }
  ]}
  riskAssessment={{
    level: "medium",
    score: 58,
    reasoning: "Elevated risk due to prolonged stationary behavior..."
  }}
  anomalies={["Unusual dwell time near access control point"]}
  behaviorAnalysis="Person A has remained within 2m radius..."
  processingTime={145}
  modelVersion="VLM-SOC-v2.1"
/>
```

**Sections Displayed:**
1. Header with model version and processing stats
2. Scene Understanding (AI description)
3. Detected Objects grid with confidence
4. Risk Assessment with progress bar
5. Anomalies list (if any)
6. Behavior Analysis (optional)
7. AI disclaimer notice

---

### VLMPanel

Wrapper component for VLM analysis with controls and history.

```tsx
import { VLMPanel } from "@/components/monitoring/VLMPanel";

interface VLMPanelProps {
  cameraId?: string;
  className?: string;
}

<VLMPanel cameraId="CAM-001" />
```

**Features:**
- Re-analyze button with loading state
- Model status indicators (frame rate, latency, GPU utilization)
- Collapsible analysis history
- Settings access button

---

## UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components with custom theming. All base components are located in `src/components/ui/`.

### Available shadcn/ui Components

| Component | Import Path |
|-----------|-------------|
| Button | `@/components/ui/button` |
| Input | `@/components/ui/input` |
| Textarea | `@/components/ui/textarea` |
| Select | `@/components/ui/select` |
| Badge | `@/components/ui/badge` |
| Card | `@/components/ui/card` |
| Table | `@/components/ui/table` |
| Tabs | `@/components/ui/tabs` |
| Dialog | `@/components/ui/dialog` |
| Dropdown Menu | `@/components/ui/dropdown-menu` |
| Tooltip | `@/components/ui/tooltip` |
| Progress | `@/components/ui/progress` |
| Separator | `@/components/ui/separator` |
| Collapsible | `@/components/ui/collapsible` |
| Scroll Area | `@/components/ui/scroll-area` |
| Skeleton | `@/components/ui/skeleton` |

---

## Design Tokens

All colors are defined as HSL values in CSS custom properties. Use Tailwind utility classes that reference these tokens.

### Core Colors

```css
/* Background & Foreground */
--background: 222 47% 8%;      /* Dark blue-gray */
--foreground: 210 20% 92%;     /* Light gray text */
--card: 222 47% 11%;           /* Slightly lighter card bg */
--muted: 222 30% 15%;          /* Muted backgrounds */
--muted-foreground: 215 15% 55%; /* Secondary text */
```

### Semantic Status Colors

```css
/* System Status */
--status-healthy: 142 76% 36%;   /* Green - online/success */
--status-warning: 38 92% 50%;    /* Yellow - caution */
--status-critical: 0 84% 60%;    /* Red - critical/error */
--status-info: 210 100% 52%;     /* Blue - informational */
```

### Confidence & Risk Tokens

```css
/* AI Confidence Levels */
--confidence-high: 142 76% 36%;   /* Green */
--confidence-medium: 38 92% 50%;  /* Yellow */
--confidence-low: 0 84% 60%;      /* Red */

/* Risk Score Levels */
--risk-low: 142 76% 36%;          /* Green */
--risk-moderate: 38 92% 50%;      /* Yellow */
--risk-high: 25 95% 53%;          /* Orange */
--risk-critical: 0 84% 60%;       /* Red */
```

### Decision State Colors

```css
/* Human Decision States */
--ai-suggestion: 270 60% 55%;     /* Purple - AI output */
--human-approved: 142 76% 36%;    /* Green - confirmed */
--human-dismissed: 0 0% 50%;      /* Gray - false positive */
--pending-review: 38 92% 50%;     /* Yellow - awaiting action */
```

### Using Tokens in Components

```tsx
// ✅ Correct - Use semantic Tailwind classes
<div className="bg-card text-foreground border-border">
  <span className="text-status-critical">Alert!</span>
  <Badge className="bg-decision-pending/20 text-decision-pending">
    Pending
  </Badge>
</div>

// ❌ Incorrect - Never use hardcoded colors
<div className="bg-[#1a1f2e] text-[#e2e8f0]">
  <span className="text-red-500">Alert!</span>
</div>
```

### Custom Utility Classes

```css
/* Glassmorphism overlay */
.glass {
  @apply bg-card/80 backdrop-blur-sm;
}

/* Glow effects */
.glow-primary { box-shadow: 0 0 20px hsl(var(--primary) / 0.15); }
.glow-warning { box-shadow: 0 0 20px hsl(var(--status-warning) / 0.2); }
.glow-critical { box-shadow: 0 0 20px hsl(var(--status-critical) / 0.2); }

/* Camera tile hover effect */
.camera-tile:hover {
  @apply ring-2 ring-primary/50;
}
```

### Typography Scale

```css
/* Extra-small text for metadata */
.text-2xs {
  font-size: 0.625rem;    /* 10px */
  line-height: 0.875rem;  /* 14px */
}
```

---

## Component Best Practices

### 1. Always Use Design Tokens

```tsx
// ✅ Good
<div className="bg-secondary text-foreground">

// ❌ Bad
<div className="bg-slate-800 text-white">
```

### 2. Compose with Existing Components

```tsx
// ✅ Use shadcn/ui as base
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

<Button 
  variant="outline"
  className={cn("gap-2", isActive && "bg-primary")}
>
```

### 3. Handle Loading States

```tsx
import { Skeleton } from "@/components/ui/skeleton";

{isLoading ? (
  <Skeleton className="h-[200px] w-full" />
) : (
  <VLMAnalysis {...data} />
)}
```

### 4. Accessibility

- All interactive elements are keyboard accessible
- Use semantic HTML elements
- Provide ARIA labels where needed
- Maintain color contrast ratios

---

*Component library maintained by the development team. For questions, consult the codebase or reach out to engineering.*
