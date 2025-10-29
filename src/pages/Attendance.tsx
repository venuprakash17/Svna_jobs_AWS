import { Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Attendance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
        <p className="text-muted-foreground mt-1">Monitor your attendance across subjects</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Detailed attendance tracking and analytics</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            View subject-wise attendance, track trends, and receive low attendance alerts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
