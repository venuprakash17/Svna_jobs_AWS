import { Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { attendanceData } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function Attendance() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "bg-success text-success-foreground";
      case "warning": return "bg-warning text-warning-foreground";
      case "danger": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted";
    }
  };

  const getBarColor = (percentage: number) => {
    if (percentage >= 75) return "hsl(var(--success))";
    if (percentage >= 60) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  const overallAttendance = Math.round(
    attendanceData.reduce((acc, curr) => acc + curr.percentage, 0) / attendanceData.length
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
        <p className="text-muted-foreground mt-1">Monitor your attendance across subjects</p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardDescription>Overall Attendance</CardDescription>
            <CardTitle className="text-4xl">{overallAttendance}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallAttendance} className="h-2" />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardDescription>Subjects At Risk</CardDescription>
            <CardTitle className="text-4xl">
              {attendanceData.filter(s => s.percentage < 75).length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Below 75% threshold
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardDescription>Perfect Attendance</CardDescription>
            <CardTitle className="text-4xl">
              {attendanceData.filter(s => s.percentage >= 90).length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-success">
              <TrendingUp className="h-4 w-4" />
              Above 90%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Table */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Subject-wise Attendance</CardTitle>
              <CardDescription>Detailed breakdown of your attendance</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Present</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Percentage</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((subject) => (
                  <TableRow key={subject.subject}>
                    <TableCell className="font-medium">{subject.subject}</TableCell>
                    <TableCell className="text-center">{subject.present}</TableCell>
                    <TableCell className="text-center">{subject.total}</TableCell>
                    <TableCell className="text-center font-semibold">
                      {subject.percentage}%
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getStatusColor(subject.status)}>
                        {subject.status === "good" ? "Good" : subject.status === "warning" ? "Warning" : "Critical"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Progress value={subject.percentage} className="h-2" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Attendance Comparison</CardTitle>
          <CardDescription>Visual representation of subject-wise attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="subject" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
