# API Reference

This document describes the expected backend API endpoints and data structures for the SOC Dashboard. The frontend is designed to consume these APIs.

> **Note**: This dashboard is frontend-only. Backend APIs must be implemented separately to provide real data.

## Table of Contents

- [Authentication](#authentication)
- [Cameras](#cameras)
- [Events](#events)
- [VLM Analysis](#vlm-analysis)
- [Predictive Analytics](#predictive-analytics)
- [Audit Logs](#audit-logs)
- [Reports](#reports)
- [WebSocket Events](#websocket-events)
- [Data Types](#data-types)

---

## Authentication

### POST /api/auth/login

Authenticate user and obtain session token.

**Request:**
```json
{
  "username": "string",
  "password": "string",
  "mfa_code": "string?"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "role": "operator" | "supervisor" | "admin",
    "display_name": "string"
  },
  "expires_at": "2024-01-10T20:00:00Z"
}
```

### POST /api/auth/logout

Invalidate current session.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true
}
```

---

## Cameras

### GET /api/cameras

List all cameras with current status.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `zone` | string | Filter by zone (e.g., "Zone A") |
| `status` | string | Filter by status: `online`, `offline`, `alert` |
| `search` | string | Search by camera ID or location |

**Response:**
```json
{
  "cameras": [
    {
      "id": "CAM-001",
      "location": "Main Entrance Gate A",
      "zone": "Zone A",
      "status": "online" | "offline" | "alert",
      "stream_url": "rtsp://...",
      "last_event": {
        "type": "Intrusion Detected",
        "timestamp": "2024-01-10T14:32:15+05:30",
        "confidence": 92
      } | null,
      "coordinates": {
        "x": 120,
        "y": 340
      }
    }
  ],
  "total": 12,
  "online_count": 11,
  "alert_count": 2
}
```

### GET /api/cameras/:id

Get detailed camera information.

**Response:**
```json
{
  "id": "CAM-001",
  "location": "Main Entrance Gate A",
  "zone": "Zone A",
  "status": "online",
  "stream_url": "rtsp://...",
  "thumbnail_url": "https://...",
  "specifications": {
    "resolution": "1920x1080",
    "fps": 30,
    "codec": "H.264"
  },
  "recent_events": [...],
  "maintenance_history": [...]
}
```

---

## Events

### GET /api/events

List AI-detected events with filtering.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |
| `start_date` | string | ISO 8601 start date |
| `end_date` | string | ISO 8601 end date |
| `event_type` | string | Filter by type |
| `status` | string | `pending`, `approved`, `dismissed`, `escalated` |
| `camera_id` | string | Filter by camera |
| `min_confidence` | number | Minimum confidence threshold (0-100) |
| `risk_level` | string | `low`, `moderate`, `high`, `critical` |

**Response:**
```json
{
  "events": [
    {
      "id": "EVT-2024-001247",
      "camera_id": "CAM-001",
      "camera_location": "Main Entrance Gate A",
      "event_type": "Intrusion Detected",
      "timestamp": "2024-01-10T14:32:15+05:30",
      "confidence": 92,
      "risk_score": 87,
      "risk_level": "critical",
      "status": "pending",
      "thumbnail_url": "https://...",
      "video_clip_url": "https://..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 247,
    "total_pages": 13
  },
  "pending_count": 15
}
```

### GET /api/events/:id

Get detailed event information.

**Response:**
```json
{
  "id": "EVT-2024-001247",
  "camera_id": "CAM-001",
  "camera_location": "Main Entrance Gate A",
  "zone": "Zone A",
  "event_type": "Intrusion Detected",
  "timestamp": "2024-01-10T14:32:15+05:30",
  "confidence": 92,
  "risk_score": 87,
  "risk_level": "critical",
  "status": "pending",
  "thumbnail_url": "https://...",
  "video_clip_url": "https://...",
  "ai_analysis": {
    "explanation": "Individual detected crossing restricted perimeter...",
    "historical_baseline": "This zone typically has 0-2 authorized entries...",
    "detected_objects": [
      { "label": "Person", "confidence": 96, "bounding_box": {...} }
    ]
  },
  "decision": null | {
    "action": "approved" | "dismissed" | "escalated",
    "user_id": "user-123",
    "user_name": "John Doe",
    "comment": "Confirmed unauthorized entry...",
    "timestamp": "2024-01-10T14:45:00+05:30"
  },
  "audit_trail": [
    {
      "action": "event_created",
      "timestamp": "2024-01-10T14:32:15+05:30",
      "actor": "system"
    }
  ]
}
```

### POST /api/events/:id/decision

Submit human decision for an event.

**Request:**
```json
{
  "action": "approved" | "dismissed" | "escalated",
  "comment": "string (required, min 10 characters)"
}
```

**Response:**
```json
{
  "success": true,
  "event": {
    "id": "EVT-2024-001247",
    "status": "approved",
    "decision": {
      "action": "approved",
      "user_id": "user-123",
      "user_name": "John Doe",
      "comment": "Confirmed unauthorized entry...",
      "timestamp": "2024-01-10T14:45:00+05:30"
    }
  }
}
```

---

## VLM Analysis

### GET /api/vlm/analysis/:camera_id

Get latest VLM analysis for a camera.

**Response:**
```json
{
  "camera_id": "CAM-001",
  "timestamp": "2024-01-10T14:32:15+05:30",
  "model_version": "VLM-SOC-v2.1",
  "processing_time_ms": 145,
  "scene_description": "Indoor corridor environment with two individuals present...",
  "detected_objects": [
    {
      "label": "Person A (Stationary)",
      "confidence": 96,
      "bounding_box": { "x": 120, "y": 80, "width": 60, "height": 180 }
    },
    {
      "label": "Security Door",
      "confidence": 94,
      "bounding_box": { "x": 300, "y": 50, "width": 100, "height": 250 }
    }
  ],
  "risk_assessment": {
    "level": "medium",
    "score": 58,
    "reasoning": "Elevated risk due to prolonged stationary behavior..."
  },
  "anomalies": [
    "Unusual dwell time near access control point (exceeds baseline by 340%)"
  ],
  "behavior_analysis": "Person A has remained within 2m radius of access door..."
}
```

### POST /api/vlm/analyze/:camera_id

Trigger new VLM analysis for a camera.

**Request:**
```json
{
  "frame_timestamp": "2024-01-10T14:32:15+05:30" // Optional, defaults to current
}
```

**Response:**
```json
{
  "job_id": "vlm-job-12345",
  "status": "processing",
  "estimated_time_ms": 150
}
```

### GET /api/vlm/history/:camera_id

Get VLM analysis history.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | number | Number of records (default: 10) |
| `before` | string | ISO 8601 timestamp for pagination |

**Response:**
```json
{
  "camera_id": "CAM-001",
  "analyses": [
    {
      "timestamp": "2024-01-10T14:32:15+05:30",
      "risk_level": "medium",
      "confidence": 87
    },
    {
      "timestamp": "2024-01-10T14:31:45+05:30",
      "risk_level": "low",
      "confidence": 92
    }
  ]
}
```

---

## Predictive Analytics

### GET /api/predictions/crowd-density

Get crowd density trends and predictions.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `zone` | string | Zone identifier |
| `hours_back` | number | Historical hours to include (default: 24) |
| `hours_forward` | number | Prediction hours (default: 4) |

**Response:**
```json
{
  "zone": "Zone A",
  "data_points": [
    {
      "timestamp": "2024-01-10T10:00:00+05:30",
      "value": 45,
      "type": "historical"
    },
    {
      "timestamp": "2024-01-10T15:00:00+05:30",
      "value": 68,
      "type": "predicted",
      "confidence_interval": { "low": 55, "high": 80 }
    }
  ],
  "current_value": 52,
  "peak_prediction": {
    "timestamp": "2024-01-10T17:30:00+05:30",
    "value": 85
  }
}
```

### GET /api/predictions/alerts

Get predictive alert notifications.

**Response:**
```json
{
  "alerts": [
    {
      "id": "pred-001",
      "type": "crowd_surge",
      "zone": "Zone A",
      "predicted_time": "2024-01-10T15:15:00+05:30",
      "confidence": 78,
      "severity": "high",
      "description": "Likely crowd surge in 15 minutes",
      "recommended_action": "Pre-position security personnel"
    }
  ]
}
```

---

## Audit Logs

### GET /api/audit-logs

Query audit log entries.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `user_id` | string | Filter by user |
| `action_type` | string | Filter by action type |
| `resource_type` | string | Filter by resource type |
| `start_date` | string | ISO 8601 start date |
| `end_date` | string | ISO 8601 end date |

**Response:**
```json
{
  "logs": [
    {
      "id": "log-12345",
      "timestamp": "2024-01-10T14:45:00+05:30",
      "user_id": "user-123",
      "user_name": "John Doe",
      "user_role": "operator",
      "action": "event_decision",
      "action_label": "Event Decision",
      "resource_type": "event",
      "resource_id": "EVT-2024-001247",
      "details": {
        "decision": "approved",
        "comment": "Confirmed unauthorized entry..."
      },
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1250
  }
}
```

### Action Types

| Action | Description |
|--------|-------------|
| `user_login` | User logged in |
| `user_logout` | User logged out |
| `event_decision` | Decision made on event |
| `event_export` | Event data exported |
| `report_generated` | Report created |
| `settings_changed` | Configuration modified |
| `model_updated` | AI model version changed |

---

## Reports

### GET /api/reports/summary

Get dashboard summary statistics.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `period` | string | `today`, `week`, `month`, `custom` |
| `start_date` | string | Required if period is `custom` |
| `end_date` | string | Required if period is `custom` |

**Response:**
```json
{
  "period": {
    "start": "2024-01-01T00:00:00+05:30",
    "end": "2024-01-10T23:59:59+05:30"
  },
  "events": {
    "total": 1247,
    "by_type": {
      "intrusion": 45,
      "loitering": 234,
      "crowding": 156,
      "vehicle": 89
    },
    "by_status": {
      "pending": 15,
      "approved": 892,
      "dismissed": 287,
      "escalated": 53
    }
  },
  "decisions": {
    "avg_response_time_minutes": 4.2,
    "false_positive_rate": 0.23
  },
  "cameras": {
    "total": 120,
    "avg_uptime_percent": 98.7
  }
}
```

### POST /api/reports/export

Generate and export a report.

**Request:**
```json
{
  "report_type": "events" | "audit" | "analytics",
  "format": "pdf" | "csv" | "xlsx",
  "filters": {
    "start_date": "2024-01-01",
    "end_date": "2024-01-10",
    "zones": ["Zone A", "Zone B"]
  }
}
```

**Response:**
```json
{
  "job_id": "export-12345",
  "status": "processing",
  "estimated_time_seconds": 30
}
```

### GET /api/reports/export/:job_id

Check export status and get download URL.

**Response:**
```json
{
  "job_id": "export-12345",
  "status": "completed",
  "download_url": "https://...",
  "expires_at": "2024-01-10T16:00:00+05:30"
}
```

---

## WebSocket Events

Connect to `wss://your-domain/ws` for real-time updates.

### Event Types

#### camera_status_change
```json
{
  "type": "camera_status_change",
  "camera_id": "CAM-001",
  "status": "alert",
  "timestamp": "2024-01-10T14:32:15+05:30"
}
```

#### new_event
```json
{
  "type": "new_event",
  "event": {
    "id": "EVT-2024-001248",
    "camera_id": "CAM-001",
    "event_type": "Intrusion Detected",
    "risk_level": "critical"
  }
}
```

#### vlm_analysis_complete
```json
{
  "type": "vlm_analysis_complete",
  "camera_id": "CAM-001",
  "risk_level": "medium",
  "risk_score": 58
}
```

#### prediction_alert
```json
{
  "type": "prediction_alert",
  "alert": {
    "id": "pred-001",
    "zone": "Zone A",
    "severity": "high",
    "description": "Likely crowd surge in 15 minutes"
  }
}
```

---

## Data Types

### EventType (enum)
```typescript
type EventType =
  | "intrusion"
  | "loitering"
  | "crowding"
  | "motion_detected"
  | "vehicle_detected"
  | "tailgating"
  | "unusual_activity"
  | "crowd_gathering";
```

### RiskLevel (enum)
```typescript
type RiskLevel = "low" | "moderate" | "high" | "critical";
```

### EventStatus (enum)
```typescript
type EventStatus = "pending" | "approved" | "dismissed" | "escalated";
```

### CameraStatus (enum)
```typescript
type CameraStatus = "online" | "offline" | "alert";
```

### UserRole (enum)
```typescript
type UserRole = "operator" | "supervisor" | "admin";
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": {}
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limits

| Endpoint Category | Rate Limit |
|-------------------|------------|
| Authentication | 10/minute |
| Read operations | 100/minute |
| Write operations | 30/minute |
| Export operations | 5/minute |
| WebSocket messages | 50/second |

---

*API documentation version 1.0 | Last updated: January 2024*
