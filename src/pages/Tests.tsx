import { useState } from "react";
import { ClipboardCheck, Clock, Calendar, Award, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { studentTests } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";

export default function Tests() {
  const [selectedTest, setSelectedTest] = useState<typeof studentTests[0] | null>(null);

  const collegeTests = studentTests.filter(t => t.type === "College");
  const placementTests = studentTests.filter(t => t.type === "Placement");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming": return "bg-warning text-warning-foreground";
      case "Ongoing": return "bg-primary text-primary-foreground";
      case "Completed": return "bg-success text-success-foreground";
      default: return "bg-muted";
    }
  };

  const handleStartTest = (testId: number) => {
    toast({
      title: "Test Started",
      description: "Redirecting to test interface...",
    });
  };

  const renderTestCard = (test: typeof studentTests[0]) => (
    <Card 
      key={test.id} 
      className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
      onClick={() => setSelectedTest(test)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{test.title}</CardTitle>
            <CardDescription>{test.subject}</CardDescription>
          </div>
          <Badge className={getStatusColor(test.status)}>
            {test.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(test.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {test.startTime} - {test.endTime} ({test.duration})
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Award className="h-4 w-4" />
            Total Marks: {test.totalMarks}
          </div>
        </div>

        {test.status === "Completed" && test.score && (
          <div className="p-3 rounded-lg bg-muted">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Your Score</span>
              <span className="text-2xl font-bold text-primary">
                {test.score}/{test.totalMarks}
              </span>
            </div>
          </div>
        )}

        <Button 
          className="w-full" 
          onClick={(e) => {
            e.stopPropagation();
            if (test.status === "Upcoming") {
              toast({
                title: "Not Yet Available",
                description: "Test will be available at the scheduled time.",
                variant: "destructive"
              });
            } else if (test.status === "Ongoing") {
              handleStartTest(test.id);
            }
          }}
          variant={test.status === "Completed" ? "outline" : "default"}
          disabled={test.status === "Upcoming"}
        >
          {test.status === "Completed" ? "View Results" : test.status === "Ongoing" ? "Start Test" : "Scheduled"}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tests</h1>
        <p className="text-muted-foreground mt-1">View and attempt college and placement tests</p>
      </div>

      <Tabs defaultValue="college" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="college" className="gap-2">
            <BookOpen className="h-4 w-4" />
            College Tests
          </TabsTrigger>
          <TabsTrigger value="placement" className="gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Placement Tests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="college" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {collegeTests.map(renderTestCard)}
          </div>
          {collegeTests.length === 0 && (
            <Card className="shadow-card">
              <CardContent className="py-12 text-center">
                <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No college tests available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="placement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {placementTests.map(renderTestCard)}
          </div>
          {placementTests.length === 0 && (
            <Card className="shadow-card">
              <CardContent className="py-12 text-center">
                <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No placement tests available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Test Detail Dialog */}
      <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">{selectedTest?.title}</DialogTitle>
                <DialogDescription className="text-lg mt-1">{selectedTest?.subject}</DialogDescription>
              </div>
              <Badge className={getStatusColor(selectedTest?.status || "")}>
                {selectedTest?.status}
              </Badge>
            </div>
          </DialogHeader>

          {selectedTest && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedTest.date).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedTest.duration}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedTest.startTime} - {selectedTest.endTime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Marks</p>
                  <p className="font-medium">{selectedTest.totalMarks}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{selectedTest.description}</p>
              </div>

              {selectedTest.status === "Completed" && selectedTest.score && (
                <Card className="bg-muted">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Your Score</p>
                        <p className="text-3xl font-bold text-primary mt-1">
                          {selectedTest.score}/{selectedTest.totalMarks}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Percentage</p>
                        <p className="text-3xl font-bold text-success mt-1">
                          {Math.round((selectedTest.score / selectedTest.totalMarks) * 100)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button 
                className="w-full" 
                size="lg"
                onClick={() => {
                  if (selectedTest.status === "Ongoing") {
                    handleStartTest(selectedTest.id);
                  }
                }}
                disabled={selectedTest.status === "Upcoming"}
                variant={selectedTest.status === "Completed" ? "outline" : "default"}
              >
                {selectedTest.status === "Completed" ? "View Detailed Results" : 
                 selectedTest.status === "Ongoing" ? "Start Test Now" : "Test Not Yet Available"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
