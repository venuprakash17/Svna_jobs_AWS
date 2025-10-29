import { useState } from "react";
import { Briefcase, MapPin, Calendar, Filter, Search, Building2, IndianRupee } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { allJobs } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";

export default function Jobs() {
  const [selectedJob, setSelectedJob] = useState<typeof allJobs[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || 
                      (activeTab === "on-campus" && job.type === "On-Campus") ||
                      (activeTab === "aggregated" && job.type === "Aggregated");
    return matchesSearch && matchesTab;
  });

  const handleApply = (jobId: number) => {
    toast({
      title: "Application Submitted",
      description: "Your application has been submitted successfully!",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Jobs & Placement</h1>
        <p className="text-muted-foreground mt-1">Explore opportunities and track applications</p>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Jobs</TabsTrigger>
          <TabsTrigger value="on-campus">On-Campus</TabsTrigger>
          <TabsTrigger value="aggregated">Aggregated</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
                    onClick={() => setSelectedJob(job)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <span className="text-white font-bold text-xl">{job.logo}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{job.company}</CardTitle>
                        <CardDescription>{job.role}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IndianRupee className="h-4 w-4" />
                      {job.ctc}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={job.type === "On-Campus" ? "default" : "secondary"}>
                      {job.type}
                    </Badge>
                    {job.status === "Applied" && (
                      <Badge className="bg-success text-success-foreground">Applied</Badge>
                    )}
                  </div>

                  <Button 
                    className="w-full" 
                    variant={job.status === "Applied" ? "outline" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (job.status !== "Applied") handleApply(job.id);
                    }}
                  >
                    {job.status === "Applied" ? "View Application" : "Apply Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <Card className="shadow-card">
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No jobs found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Job Detail Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-16 w-16 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-2xl">{selectedJob?.logo}</span>
              </div>
              <div>
                <DialogTitle className="text-2xl">{selectedJob?.company}</DialogTitle>
                <DialogDescription className="text-lg">{selectedJob?.role}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedJob.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">CTC</p>
                  <p className="font-medium">{selectedJob.ctc}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-medium">{new Date(selectedJob.deadline).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge>{selectedJob.type}</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Job Description</h3>
                <p className="text-muted-foreground">{selectedJob.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Requirements</h3>
                <ul className="space-y-1">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx} className="text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Selection Rounds</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.rounds.map((round, idx) => (
                    <Badge key={idx} variant="outline">{round}</Badge>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                variant={selectedJob.status === "Applied" ? "outline" : "default"}
                onClick={() => {
                  if (selectedJob.status !== "Applied") handleApply(selectedJob.id);
                }}
              >
                {selectedJob.status === "Applied" ? "Application Submitted" : "Apply for this Position"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
