import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Insights into your academic performance</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Comprehensive analytics and performance insights</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Visualize your progress with charts, correlations, and improvement suggestions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
