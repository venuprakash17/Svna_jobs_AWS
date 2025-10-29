import { ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Tests() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tests</h1>
        <p className="text-muted-foreground mt-1">View and attempt college and placement tests</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Test management and assessment module</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Access college tests and super admin tests, track your performance, and view results.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
