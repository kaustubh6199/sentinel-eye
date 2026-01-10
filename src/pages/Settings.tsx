import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Database,
  Users,
  Lock,
  Info,
} from "lucide-react";

export default function Settings() {
  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">System Settings</h2>
            <p className="text-sm text-muted-foreground">
              Configuration and administration (Admin access required)
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Access Notice */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-status-warning/10 border border-status-warning/20">
            <Lock className="w-5 h-5 text-status-warning flex-shrink-0" />
            <p className="text-sm text-foreground">
              <span className="font-semibold">Restricted Access:</span> Changes to
              system settings require Admin role and are logged for compliance.
            </p>
          </div>

          {/* Alert Configuration */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                Alert Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    High-Priority Alert Threshold
                  </p>
                  <p className="text-2xs text-muted-foreground">
                    Minimum confidence % to trigger high-priority alerts
                  </p>
                </div>
                <Input
                  type="number"
                  defaultValue="85"
                  className="w-20 text-center bg-background"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Escalation Timeout
                  </p>
                  <p className="text-2xs text-muted-foreground">
                    Auto-escalate pending events after (minutes)
                  </p>
                </div>
                <Input
                  type="number"
                  defaultValue="15"
                  className="w-20 text-center bg-background"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Audio Alerts Enabled
                  </p>
                  <p className="text-2xs text-muted-foreground">
                    Play sound on critical events
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* AI Model Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Database className="w-4 h-4 text-decision-ai" />
                AI Model Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Intrusion Detection Model
                  </p>
                  <p className="text-2xs text-muted-foreground">
                    Current version: v2.3.1
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Crowd Detection Model
                  </p>
                  <p className="text-2xs text-muted-foreground">
                    Current version: v1.8.0
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Inference Frequency
                  </p>
                  <p className="text-2xs text-muted-foreground">
                    Process frames every (seconds)
                  </p>
                </div>
                <Input
                  type="number"
                  defaultValue="2"
                  className="w-20 text-center bg-background"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-status-healthy" />
                Security & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Session Timeout
                  </p>
                  <p className="text-2xs text-muted-foreground">
                    Auto-logout after inactivity (minutes)
                  </p>
                </div>
                <Input
                  type="number"
                  defaultValue="30"
                  className="w-20 text-center bg-background"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Two-Factor Authentication
                  </p>
                  <p className="text-2xs text-muted-foreground">
                    Require 2FA for all users
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Audit Log Retention
                  </p>
                  <p className="text-2xs text-muted-foreground">
                    DPDP Act compliance: minimum 7 years
                  </p>
                </div>
                <span className="text-sm font-mono text-muted-foreground">7 years</span>
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Active Users: 24
                  </p>
                  <p className="text-2xs text-muted-foreground">
                    12 Operators • 8 Supervisors • 4 Admins
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Manage Users
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-2xs text-muted-foreground">Version</p>
                  <p className="font-mono text-foreground">v3.2.1-stable</p>
                </div>
                <div>
                  <p className="text-2xs text-muted-foreground">Last Update</p>
                  <p className="font-mono text-foreground">2024-01-08</p>
                </div>
                <div>
                  <p className="text-2xs text-muted-foreground">Database Status</p>
                  <p className="text-status-healthy">Connected</p>
                </div>
                <div>
                  <p className="text-2xs text-muted-foreground">AI Backend</p>
                  <p className="text-status-healthy">Operational</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
