import { Card, CardContent, CardHeader, CardTitle } from '../components/Dashboard/Card';
import { Users, GraduationCap,  Calendar, IndianRupee } from 'lucide-react';

const stats = [
  {
    title: 'Total Students',
    value: '2,453',
    change: '+12.5%',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'New Admissions',
    value: '145',
    change: '+8.2%',
    icon: GraduationCap,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    title: 'Fee Collection',
    value: '284K',
    change: '+23.1%',
    icon: IndianRupee,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    title: 'Attendance Today',
    value: '94.5%',
    change: '+2.3%',
    icon: Calendar,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
];

const Dashboard = () => {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-border shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-sm text-success mt-1">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-border shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-6 bg-gradient-to-br from-slate-700 to-green-400 text-primary-foreground rounded-lg hover:shadow-lg transition-all">
            <GraduationCap className="w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg">New Admission</h3>
            <p className="text-sm opacity-90 mt-1">Register new students</p>
          </button>
          <button className="p-6 bg-gradient-to-br from-slate-700 to-blue-400 text-accent-foreground rounded-lg hover:shadow-lg transition-all">
            <Calendar className="w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg">Mark Attendance</h3>
            <p className="text-sm opacity-90 mt-1">Take daily attendance</p>
          </button>
          <button className="p-6 bg-gradient-to-br from-slate-700 to-red-400 text-success-foreground rounded-lg hover:shadow-lg transition-all">
            <IndianRupee className="w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg">Collect Fee</h3>
            <p className="text-sm opacity-90 mt-1">Process fee payments</p>
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;