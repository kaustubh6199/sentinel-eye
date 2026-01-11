# AI Video Intelligence Platform - SOC Dashboard

[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4)](https://lovable.dev)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8)](https://tailwindcss.com)

An enterprise-grade Security Operations Center (SOC) web dashboard for AI-driven video surveillance systems. Designed for deployment in India, compliant with Indian regulatory requirements (DPDP Act, CERT-In).

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Design Principles](#design-principles)
- [Compliance](#compliance)
- [Documentation](#documentation)

## Overview

This dashboard enables security operators and supervisors to:

- **Monitor** AI-detected events from CCTV cameras in real-time
- **Review** incidents by date, time, and camera location
- **Validate** AI predictions with human-in-the-loop approval workflows
- **Maintain** audit-ready visibility of all actions and access

### Design Philosophy

- **Serious & Authoritative**: Enterprise/government-grade UI
- **Low Eye Strain**: Dark theme optimized for 24/7 SOC monitoring shifts
- **Desktop-First**: Widescreen SOC environment optimization
- **No Automated Enforcement**: All AI decisions require human validation

## Key Features

| Feature | Description |
|---------|-------------|
| **Live Monitoring** | Real-time camera grid with status indicators and AI alerts |
| **VLM Analysis** | Vision-Language Model scene understanding and risk assessment |
| **Event Review** | Table-based incident management with filtering and pagination |
| **Predictive Alerts** | Time-series charts for crowd density and risk predictions |
| **Camera Map** | Floor-plan style view with heatmap overlays |
| **Audit Logs** | Immutable compliance logging for DPDP Act / CERT-In |
| **Reports** | Analytics dashboards and exportable reports |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React + Vite)                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Pages     │  │  Components │  │   Hooks     │              │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤              │
│  │ Monitoring  │  │ CameraTile  │  │ useMobile   │              │
│  │ Events      │  │ VLMAnalysis │  │ useToast    │              │
│  │ Predictive  │  │ StatusBadge │  │             │              │
│  │ CameraMap   │  │ RiskBadge   │  │             │              │
│  │ AuditLogs   │  │ Layout/*    │  │             │              │
│  │ Reports     │  │ UI/*        │  │             │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│                    Design System (Tailwind + CSS Variables)      │
│  • HSL-based semantic colors  • Status/Risk/Confidence tokens   │
│  • Dark theme only            • Custom scrollbars                │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend APIs (Not Included)                 │
│  • Camera feeds  • AI/ML inference  • Event storage  • Auth     │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd <project-directory>

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/           # Dashboard layout components
│   │   ├── DashboardLayout.tsx
│   │   ├── GlobalHeader.tsx
│   │   └── NavigationSidebar.tsx
│   ├── monitoring/       # SOC-specific components
│   │   ├── CameraTile.tsx
│   │   ├── ConfidenceMeter.tsx
│   │   ├── RiskBadge.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── VLMAnalysis.tsx
│   │   └── VLMPanel.tsx
│   └── ui/               # shadcn/ui base components
├── pages/
│   ├── LiveMonitoring.tsx
│   ├── VLMMonitoring.tsx
│   ├── EventsIncidents.tsx
│   ├── EventDetail.tsx
│   ├── PredictiveAlerts.tsx
│   ├── CameraMap.tsx
│   ├── AuditLogs.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── index.css             # Design system tokens
└── App.tsx               # Route configuration
```

## Design Principles

### Color System

All colors use HSL format for consistency and are defined as CSS custom properties:

| Token | Purpose |
|-------|---------|
| `--status-healthy` | Online/success states |
| `--status-warning` | Caution/medium priority |
| `--status-critical` | Critical alerts, errors |
| `--confidence-high/medium/low` | AI confidence visualization |
| `--risk-low/moderate/high/critical` | Risk score levels |
| `--decision-ai/approved/dismissed/pending` | Human decision states |

### Typography

- **Sans-serif**: Inter (system fallback)
- **Monospace**: JetBrains Mono (for IDs, timestamps)
- **Size `text-2xs`**: 10px for compact metadata

### Interaction Patterns

1. **No automated enforcement** - AI suggestions always require human action
2. **Mandatory comments** - Decision actions require justification
3. **Clear separation** - AI analysis vs. human decision UI is visually distinct
4. **Audit trail** - All actions logged with user, timestamp, and reason

## Compliance

This dashboard is designed for compliance with:

| Regulation | Requirement | Implementation |
|------------|-------------|----------------|
| **DPDP Act 2023** | Data processing transparency | Audit logs, consent notices |
| **CERT-In** | Incident reporting | Event export, immutable logs |
| **IT Act 2000** | Data retention | Timestamped records |

### Audit Features

- Immutable log viewing (no edit/delete)
- User access tracking with IP addresses
- Export restrictions for sensitive data
- Session timeout and re-authentication

## Documentation

| Document | Description |
|----------|-------------|
| [User Guide](./USER_GUIDE.md) | Operator training and workflows |
| [Component Library](./COMPONENTS.md) | UI component reference |
| [API Reference](./API_REFERENCE.md) | Backend integration specs |

---

## Tech Stack

- **Framework**: React 18.3 + Vite
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **UI Components**: shadcn/ui + Radix Primitives
- **Charts**: Recharts
- **Routing**: React Router 6.x
- **State**: TanStack Query (React Query)

## License

Proprietary - All rights reserved.

---

*Built with [Lovable](https://lovable.dev) - The AI-powered full-stack development platform*
