import { Users, Building2, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { adminDashboardData } from "@/lib/mockData";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">College-wide overview and management</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={adminDashboardData.totalStudents}
          icon={Users}
        />
        <StatCard
          title="Total Faculty"
          value={adminDashboardData.totalFaculty}
          icon={Users}
        />
        <StatCard
          title="Departments"
          value={adminDashboardData.departments}
          icon={Building2}
        />
        <StatCard
          title="Placement Rate"
          value={`${adminDashboardData.placementRate}%`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Statistics */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Department Statistics</CardTitle>
            <CardDescription>Student count and placement rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adminDashboardData.departmentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="students" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                <Bar yAxisId="right" dataKey="percentage" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Yearly Placement Trend */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Placement Trend</CardTitle>
            <CardDescription>Year-over-year growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={adminDashboardData.yearlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="placed" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Recruiters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Top Recruiters</CardTitle>
          <CardDescription>Companies with most placements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead className="text-center">Students Placed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminDashboardData.topCompanies.map((company, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <span className="text-white font-bold">{company.company[0]}</span>
                      </div>
                      {company.company}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge>{company.students}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="text-sm text-primary hover:underline">View Details</button>
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
