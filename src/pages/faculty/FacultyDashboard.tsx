import { Users, TrendingDown, ClipboardCheck, Code2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { facultyDashboardData } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function FacultyDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Faculty Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage your classes</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={facultyDashboardData.totalStudents}
          icon={Users}
        />
        <StatCard
          title="Avg Attendance"
          value={`${facultyDashboardData.averageAttendance}%`}
          icon={TrendingDown}
        />
        <StatCard
          title="Pending Tests"
          value={facultyDashboardData.pendingTests}
          icon={ClipboardCheck}
        />
        <StatCard
          title="Submissions to Review"
          value={facultyDashboardData.submissionsToReview}
          icon={Code2}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Class Performance */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
            <CardDescription>Average scores by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={facultyDashboardData.classPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="average" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* At-Risk Students */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>At-Risk Students</CardTitle>
            <CardDescription>Students requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Attendance</TableHead>
                  <TableHead className="text-center">Avg Marks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facultyDashboardData.atRiskStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.department}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={student.attendance < 60 ? "destructive" : "secondary"}>
                        {student.attendance}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={student.avgMarks < 50 ? "destructive" : "secondary"}>
                        {student.avgMarks}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {facultyDashboardData.recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded-lg bg-muted">
                  {activity.type === "test" ? <ClipboardCheck className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
