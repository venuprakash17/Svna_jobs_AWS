import { BarChart3, TrendingUp, Target, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { resumeAnalytics, attendanceData, codingProblems } from "@/lib/mockData";

export default function Analytics() {
  const performanceData = [
    { category: "DSA", score: 85 },
    { category: "Web Dev", score: 72 },
    { category: "ML", score: 78 },
    { category: "Database", score: 88 },
    { category: "Networks", score: 70 },
  ];

  const codingTrend = [
    { month: "Jun", solved: 20 },
    { month: "Jul", solved: 32 },
    { month: "Aug", solved: 28 },
    { month: "Sep", solved: 35 },
    { month: "Oct", solved: 30 },
  ];

  const attendanceMarksCorrelation = attendanceData.slice(0, 4).map(subject => ({
    subject: subject.subject.split(' ')[0],
    attendance: subject.percentage,
    marks: Math.round(subject.percentage * 0.9 + Math.random() * 10)
  }));

  const improvementIndex = [
    { subject: "Technical Skills", value: 85 },
    { subject: "Problem Solving", value: 78 },
    { subject: "Communication", value: 72 },
    { subject: "Resume Quality", value: 82 },
    { subject: "Coding Practice", value: 75 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Insights into your academic performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ATS Score</p>
                <p className="text-2xl font-bold">{resumeAnalytics.atsScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Attendance</p>
                <p className="text-2xl font-bold">
                  {Math.round(attendanceData.reduce((acc, curr) => acc + curr.percentage, 0) / attendanceData.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-warning/10">
                <Award className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Problems Solved</p>
                <p className="text-2xl font-bold">{codingProblems.filter(p => p.solved).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-accent/10">
                <BarChart3 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Index</p>
                <p className="text-2xl font-bold">78.4</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="resume" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="coding">Coding</TabsTrigger>
          <TabsTrigger value="correlation">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="resume" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>ATS Score Trend</CardTitle>
                <CardDescription>Your resume score over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={resumeAnalytics.trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
                <CardDescription>Category-wise analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resumeAnalytics.improvements}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Comparative analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Improvement Index</CardTitle>
                <CardDescription>Multi-dimensional analysis</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={improvementIndex}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="Score" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="coding" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Coding Activity Trend</CardTitle>
              <CardDescription>Problems solved per month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={codingTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="solved" stroke="hsl(var(--warning))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Attendance vs Marks Correlation</CardTitle>
              <CardDescription>How attendance impacts your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceMarksCorrelation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attendance" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="marks" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
