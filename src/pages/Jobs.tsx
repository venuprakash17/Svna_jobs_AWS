import { Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Jobs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Jobs & Placement</h1>
        <p className="text-muted-foreground mt-1">Explore opportunities and track applications</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Job aggregation and placement tracking</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Browse on-campus jobs, aggregated opportunities, and track your placement progress.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
