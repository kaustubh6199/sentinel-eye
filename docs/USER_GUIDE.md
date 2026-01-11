# SOC Dashboard - User Guide

This guide is intended for Security Operators, Supervisors, and Administrators using the AI Video Intelligence Platform.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Live Monitoring](#live-monitoring)
4. [VLM Analysis](#vlm-analysis)
5. [Event Review Workflow](#event-review-workflow)
6. [Predictive Intelligence](#predictive-intelligence)
7. [Camera Map](#camera-map)
8. [Audit & Compliance](#audit--compliance)
9. [Best Practices](#best-practices)

---

## Getting Started

### Logging In

1. Navigate to the dashboard URL
2. Enter your credentials (username/password or SSO)
3. Complete two-factor authentication if required
4. You will be directed to the Live Monitoring screen

### Understanding Your Role

| Role | Permissions |
|------|-------------|
| **Operator** | Monitor cameras, review events, confirm/dismiss alerts |
| **Supervisor** | All operator permissions + escalation handling, bulk actions |
| **Admin** | All permissions + system settings, user management |

### System Health Indicator

Located in the top-right corner of the header:

- 🟢 **Green**: All systems operational
- 🟡 **Amber**: Degraded performance or minor issues
- 🔴 **Red**: Critical system failure - contact IT immediately

---

## Dashboard Overview

### Navigation Sidebar

The left sidebar provides access to all major sections:

| Icon | Section | Description |
|------|---------|-------------|
| 📹 | Live Monitoring | Real-time camera feeds |
| 🧠 | VLM Analysis | AI vision-language model outputs |
| 📋 | Events & Incidents | Event review queue |
| 📈 | Predictive Alerts | Forecasting and trend analysis |
| 🗺️ | Camera Map | Spatial view of all cameras |
| 📜 | Audit Logs | Compliance and action history |
| 📊 | Reports | Analytics and exports |
| ⚙️ | Settings | System configuration (Admin only) |

### Global Header

Displays:
- Current date and time (IST)
- Your user role and name
- System health status
- Notification indicator

---

## Live Monitoring

### Camera Grid View

The default view shows all cameras in a responsive grid layout.

#### Camera Tile Status Indicators

| Status | Visual | Meaning |
|--------|--------|---------|
| **Online** | 🟢 Green dot, "LIVE" label | Camera streaming normally |
| **Offline** | ⚫ Gray dot, "OFFLINE" label | No connection to camera |
| **Alert** | 🔴 Pulsing red, highlighted border | AI detected event requires attention |

#### Filtering Cameras

Use the toolbar to narrow down cameras:

1. **Search**: Type camera ID or location name
2. **Zone Filter**: Select specific zone (Zone A, B, C, etc.)
3. **View Toggle**: Switch between grid and list views

#### Camera Statistics Bar

At the top of the grid, you'll see:
- Total cameras online
- Active alerts count
- Offline cameras count

### Opening Camera Detail

Click any camera tile to open the detailed camera view with:
- Full-size video feed
- Recent AI detections
- Quick action buttons

---

## VLM Analysis

The Vision-Language Model (VLM) provides AI-powered scene understanding.

### Understanding VLM Output

| Section | Description |
|---------|-------------|
| **Scene Understanding** | Natural language description of what the AI sees |
| **Detected Objects** | List of identified objects with confidence scores |
| **Risk Assessment** | Calculated risk level with reasoning |
| **Anomalies Detected** | Unusual patterns compared to baseline |
| **Behavior Analysis** | Interpretation of movement and actions |

### Confidence Scores

| Range | Color | Interpretation |
|-------|-------|----------------|
| 85-100% | 🟢 Green | High confidence - likely accurate |
| 60-84% | 🟡 Yellow | Medium confidence - verify carefully |
| 0-59% | 🔴 Red | Low confidence - treat with caution |

### Risk Levels

| Level | Score Range | Action Required |
|-------|-------------|-----------------|
| Low | 0-30 | Routine monitoring |
| Medium | 31-60 | Enhanced attention |
| High | 61-85 | Priority review |
| Critical | 86-100 | Immediate action |

### Analysis History

Click "Analysis History" to view previous VLM outputs for the selected camera, useful for tracking how a situation evolved.

> ⚠️ **Important**: VLM outputs are AI-generated suggestions. Always validate before taking enforcement action.

---

## Event Review Workflow

### Events Table

The Events & Incidents screen displays all AI-detected events requiring human review.

#### Table Columns

| Column | Description |
|--------|-------------|
| Event ID | Unique identifier (format: EVT-YYYY-NNNNNN) |
| Camera Location | Physical location of the camera |
| Event Type | Category of detection (intrusion, loitering, etc.) |
| Date & Time | When the event was detected |
| AI Confidence | Model's certainty percentage |
| Risk Score | Calculated threat level |
| Status | Current review state |

#### Event Statuses

| Status | Color | Meaning |
|--------|-------|---------|
| Pending | 🟡 Yellow | Awaiting human review |
| Confirmed | 🟢 Green | Validated as real incident |
| Dismissed | ⚫ Gray | Marked as false positive |
| Escalated | 🔴 Red | Sent to supervisor |

### Reviewing an Event

1. Click "View" on any event row
2. Review the video snapshot/clip
3. Read the AI analysis and reasoning
4. Compare with historical baseline
5. **Enter a mandatory comment** explaining your decision
6. Click one of the action buttons:
   - ✅ **Confirm Event** - This is a real incident
   - ❌ **Mark False Positive** - AI made an error
   - ⬆️ **Escalate** - Send to supervisor for decision

> ⚠️ **Compliance Note**: Comments are mandatory and become part of the permanent audit record.

### Filtering Events

Use the filter toolbar to narrow results:
- **Date Range**: Select start/end dates
- **Event Type**: Filter by category
- **Status**: Show only pending, confirmed, etc.
- **Confidence Threshold**: Set minimum confidence level

---

## Predictive Intelligence

### Understanding Predictions

The Predictive Alerts screen shows AI forecasts about potential future events.

#### Crowd Density Trends

The line chart shows:
- Historical crowd levels (past 24 hours)
- Current crowd density
- Predicted crowd levels (next 4 hours)

#### Risk Score Trends

Displays how the overall risk score for a zone has changed and where it's predicted to go.

### Predictive Alert Cards

Each alert card shows:
- **Prediction**: What the AI expects to happen
- **Timeframe**: When it might occur
- **Confidence**: How certain the model is
- **Recommended Action**: Suggested response

Example alerts:
- "Likely crowd surge in 15 minutes at Zone A"
- "Anomalous activity probability rising in Zone C"

> ⚠️ **Disclaimer**: Predictions require human validation before any enforcement action. AI forecasts are probabilistic, not certain.

---

## Camera Map

### Map View Features

The camera map provides a spatial overview of your facility.

#### Map Elements

| Element | Description |
|---------|-------------|
| Camera Markers | Show camera locations and status |
| Zone Boundaries | Colored regions for different areas |
| Heatmap Overlay | Activity density visualization |

#### Interacting with the Map

- **Click a camera marker** to see quick info and open detail view
- **Toggle heatmap** to show/hide activity density
- **Use time slider** to view historical activity patterns

### Zone Colors

| Color | Meaning |
|-------|---------|
| 🟢 Green | Normal activity levels |
| 🟡 Yellow | Elevated activity |
| 🟠 Orange | High activity |
| 🔴 Red | Critical alert in zone |

---

## Audit & Compliance

### Audit Log Features

The audit log provides an immutable record of all system actions.

#### Logged Actions

| Action Type | What's Recorded |
|-------------|-----------------|
| User Access | Login, logout, session duration |
| Event Decisions | Confirm, dismiss, escalate with comments |
| Data Exports | Who exported what and when |
| Settings Changes | Configuration modifications |
| Model Updates | AI model version changes |

#### Searching Audit Logs

Use the search bar and filters to find specific entries:
- User name
- Action type
- Date range
- Resource affected

> 🔒 **Note**: Audit logs cannot be edited or deleted. Export functionality may be restricted based on your role.

### Compliance Information

This system is designed for compliance with:
- **DPDP Act 2023**: Personal data protection requirements
- **CERT-In**: Incident reporting guidelines
- **IT Act 2000**: Electronic record retention

---

## Best Practices

### For Shift Handover

1. Review all pending events before end of shift
2. Document any ongoing situations in event comments
3. Notify incoming operator of critical alerts
4. Log any system issues in the shift report

### For Event Review

1. Always watch the video clip, not just the snapshot
2. Compare current behavior with historical baseline
3. Consider environmental factors (time of day, weather, events)
4. When in doubt, escalate rather than dismiss
5. Write clear, specific comments that explain your reasoning

### For Eye Strain Reduction

The dashboard is designed for long monitoring shifts:
- Dark theme reduces eye strain
- Low-contrast backgrounds minimize fatigue
- Important alerts use color and motion sparingly

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `R` | Refresh current view |
| `N` | Next pending event |
| `P` | Previous event |
| `E` | Open event detail |
| `Esc` | Close modal/dialog |

---

## Getting Help

- **Technical Issues**: Contact IT Support
- **Training**: Request training from your supervisor
- **Feature Requests**: Submit through the feedback system

---

*This guide is maintained by the Security Operations team. Last updated: January 2024*
