import { Building2, Users, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { superAdminDashboardData } from "@/lib/mockData";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--accent))'];

export default function SuperAdminDashboard() {
  const featureData = Object.entries(superAdminDashboardData.featureUsage).map(([name, value]) => ({
    name: name.replace(/([A-Z])/g, ' $1').trim(),
    value
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Super Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform-wide analytics and management</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Colleges"
          value={superAdminDashboardData.totalColleges}
          icon={Building2}
        />
        <StatCard
          title="Total Students"
          value={superAdminDashboardData.totalStudents.toLocaleString()}
          icon={Users}
        />
        <StatCard
          title="Active Users"
          value={superAdminDashboardData.activeUsers.toLocaleString()}
          icon={Activity}
        />
        <StatCard
          title="Avg ATS Score"
          value={superAdminDashboardData.avgAtsScore}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Platform Usage Trend */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Platform Usage</CardTitle>
            <CardDescription>Active users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={superAdminDashboardData.platformUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Feature Usage */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Feature Usage</CardTitle>
            <CardDescription>Most used features across platform</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={featureData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {featureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* College Performance Leaderboard */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>College Performance Leaderboard</CardTitle>
          <CardDescription>Top performing institutions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>College</TableHead>
                <TableHead className="text-center">Students</TableHead>
                <TableHead className="text-center">Avg ATS</TableHead>
                <TableHead className="text-center">Placement %</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {superAdminDashboardData.collegePerformance.map((college, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-bold">#{idx + 1}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <span className="text-white font-bold">{college.college[0]}</span>
                      </div>
                      {college.college}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{college.students}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{college.avgAts}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-success text-success-foreground">{college.placement}%</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge>Active</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
