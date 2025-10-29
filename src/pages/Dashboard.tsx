import { FileText, Target, Calendar, Code2, Trophy, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { studentDashboardData } from "@/lib/mockData";

export default function Dashboard() {
  const { resumeCompletion, atsScore, nextPlacementDrive, attendance, codingStats, upcomingTests, recentJobs } = studentDashboardData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Resume Completion"
          value={`${resumeCompletion}%`}
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
          subtitle="Keep building!"
        />
        <StatCard
          title="ATS Score"
          value={atsScore}
          icon={Target}
          trend={{ value: 5, isPositive: true }}
          subtitle="Above average"
        />
        <StatCard
          title="Attendance"
          value={`${attendance.overall}%`}
          icon={Calendar}
          subtitle="Overall this semester"
        />
        <StatCard
          title="Problems Solved"
          value={codingStats.totalSolved}
          icon={Code2}
          trend={{ value: 8, isPositive: true }}
          subtitle={`${codingStats.weeklyStreak} day streak!`}
        />
      </div>

      {/* Next Placement Drive */}
      <Card className="shadow-card border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Next Placement Drive</CardTitle>
              <CardDescription>You're registered for this opportunity</CardDescription>
            </div>
            <Trophy className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-foreground">{nextPlacementDrive.company}</h3>
                <p className="text-muted-foreground">{nextPlacementDrive.role}</p>
              </div>
              <Badge className="bg-success text-success-foreground">{nextPlacementDrive.status}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{new Date(nextPlacementDrive.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <Button className="w-full bg-gradient-primary">View Details</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Attendance Overview */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Attendance by Subject</CardTitle>
            <CardDescription>Current semester overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {attendance.subjects.map((subject) => (
              <div key={subject.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{subject.name}</span>
                  <span className={`font-semibold ${
                    subject.status === 'good' ? 'text-success' : 'text-warning'
                  }`}>
                    {subject.percentage}%
                  </span>
                </div>
                <Progress 
                  value={subject.percentage} 
                  className={subject.status === 'good' ? '[&>div]:bg-success' : '[&>div]:bg-warning'}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Coding Stats */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Coding Practice</CardTitle>
            <CardDescription>Your progress this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-success">{codingStats.easyCount}</p>
                  <p className="text-sm text-muted-foreground">Easy</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">{codingStats.mediumCount}</p>
                  <p className="text-sm text-muted-foreground">Medium</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{codingStats.hardCount}</p>
                  <p className="text-sm text-muted-foreground">Hard</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Weekly Streak</span>
                  <Badge variant="outline" className="bg-gradient-secondary text-white">
                    🔥 {codingStats.weeklyStreak} days
                  </Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full">Practice Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Upcoming Tests */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Upcoming Tests</CardTitle>
            <CardDescription>Don't miss these assessments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <p className="font-medium text-foreground">{test.title}</p>
                  <p className="text-sm text-muted-foreground">{new Date(test.date).toLocaleDateString()}</p>
                </div>
                <Badge variant={test.type === 'College' ? 'default' : 'secondary'}>
                  {test.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Job Postings</CardTitle>
            <CardDescription>Latest opportunities for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-start justify-between p-3 rounded-lg bg-muted">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{job.company}</p>
                  <p className="text-sm text-muted-foreground">{job.role}</p>
                  <p className="text-sm font-semibold text-primary">{job.ctc}</p>
                </div>
                <Badge variant={job.status === 'Applied' ? 'default' : 'outline'}>
                  {job.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
