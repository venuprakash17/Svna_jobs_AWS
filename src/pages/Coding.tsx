import { Code2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Coding() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Coding Practice</h1>
        <p className="text-muted-foreground mt-1">Sharpen your programming skills</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Code2 className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Coding practice module with integrated editor</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is under development and will include a Monaco editor, problem sets, and real-time code execution.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
