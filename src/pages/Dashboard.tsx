import { Card, CardContent, CardHeader, CardTitle } from '../components/Dashboard/Card';
import { Users, GraduationCap, Calendar, IndianRupee, TrendingUp, BookOpen, Clock, Award, MoreHorizontal, Download, Filter, Search, ChevronRight, Eye, Activity } from 'lucide-react';

const stats = [
  {
    title: 'Total Students',
    value: '2,453',
    change: '+12.5%',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20',
    trend: 'up'
  },
  {
    title: 'New Admissions',
    value: '145',
    change: '+8.2%',
    icon: GraduationCap,
    color: 'text-emerald-500',
    bgColor: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20',
    trend: 'up'
  },
  {
    title: 'Fee Collection',
    value: '₹2.84L',
    change: '+23.1%',
    icon: IndianRupee,
    color: 'text-violet-500',
    bgColor: 'bg-gradient-to-br from-violet-500/20 to-violet-600/20',
    trend: 'up'
  },
  {
    title: 'Attendance',
    value: '94.5%',
    change: '+2.3%',
    icon: Calendar,
    color: 'text-amber-500',
    bgColor: 'bg-gradient-to-br from-amber-500/20 to-amber-600/20',
    trend: 'up'
  },
];

const attendanceData = [
  { day: 'Mon', present: 89, absent: 11 },
  { day: 'Tue', present: 92, absent: 8 },
  { day: 'Wed', present: 95, absent: 5 },
  { day: 'Thu', present: 88, absent: 12 },
  { day: 'Fri', present: 96, absent: 4 },
  { day: 'Sat', present: 85, absent: 15 },
];

const performanceData = [
  { subject: 'Mathematics', percentage: 92, trend: 'up' },
  { subject: 'Science', percentage: 88, trend: 'up' },
  { subject: 'English', percentage: 85, trend: 'down' },
  { subject: 'Social Studies', percentage: 90, trend: 'up' },
];

const recentActivities = [
  { 
    id: 1, 
    action: 'New Admission', 
    student: 'Rahul Sharma', 
    time: '2 min ago', 
    type: 'admission',
    avatar: 'RS'
  },
  { 
    id: 2, 
    action: 'Fee Received', 
    student: 'Priya Patel', 
    amount: '₹15,000', 
    time: '15 min ago', 
    type: 'payment',
    avatar: 'PP'
  },
  { 
    id: 3, 
    action: 'Attendance Marked', 
    student: 'Class 10A', 
    time: '1 hour ago', 
    type: 'attendance',
    avatar: '10A'
  },
  { 
    id: 4, 
    action: 'Course Updated', 
    student: 'Advanced Math', 
    time: '2 hours ago', 
    type: 'course',
    avatar: 'AM'
  },
];

const topPerformers = [
  { rank: 1, name: 'Aarav Kumar', class: '12th Science', percentage: '96.5%', avatar: 'AK' },
  { rank: 2, name: 'Neha Singh', class: '11th Commerce', percentage: '95.2%', avatar: 'NS' },
  { rank: 3, name: 'Vikram Joshi', class: '10th A', percentage: '94.8%', avatar: 'VJ' },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-600 mt-2">Welcome back! Here's your overview for today.</p>
        </div>
        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:shadow-sm transition-all">
            <Filter className="w-4 h-4 text-slate-600" />
          </button>
          <button className="p-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:shadow-sm transition-all">
            <Download className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.title}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-2">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</p>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Weekly Attendance</h2>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          <div className="space-y-4">
            {attendanceData.map((day, index) => (
              <div key={day.day} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 w-12">{day.day}</span>
                <div className="flex-1 mx-4">
                  <div className="flex h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                      style={{ width: `${day.present}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-slate-800">{day.present}%</span>
                  <span className="text-xs text-slate-500 ml-2">{day.absent}% absent</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Subject Performance</h2>
            <Activity className="w-5 h-5 text-slate-600" />
          </div>
          <div className="space-y-4">
            {performanceData.map((subject, index) => (
              <div key={subject.subject} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50">
                <div>
                  <p className="font-medium text-slate-800">{subject.subject}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                        style={{ width: `${subject.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600">{subject.percentage}%</span>
                  </div>
                </div>
                <div className={`p-1.5 rounded-full ${
                  subject.trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Recent Activities</h2>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
              View All <ChevronRight className="w-4 h-4 inline" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50/50 transition-all group">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {activity.avatar}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800 truncate">{activity.action}</p>
                    <span className="text-xs text-slate-500">•</span>
                    <p className="text-sm text-slate-600 truncate">{activity.student}</p>
                    {activity.amount && (
                      <span className="text-sm font-medium text-emerald-600">{activity.amount}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-100 rounded-lg transition-all">
                  <Eye className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Top Performers</h2>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div className="space-y-4">
            {topPerformers.map((student) => (
              <div key={student.rank} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50/50 to-slate-100/50 border border-slate-200/40">
                <div className="flex-shrink-0 relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {student.avatar}
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {student.rank}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{student.name}</p>
                  <p className="text-sm text-slate-600 truncate">{student.class}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-800">{student.percentage}</p>
                  <p className="text-xs text-slate-500">Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: GraduationCap, label: 'New Admission', desc: 'Register student', color: 'from-blue-500 to-blue-600' },
            { icon: Calendar, label: 'Attendance', desc: 'Mark daily', color: 'from-violet-500 to-violet-600' },
            { icon: IndianRupee, label: 'Collect Fee', desc: 'Process payment', color: 'from-emerald-500 to-emerald-600' },
            { icon: BookOpen, label: 'Courses', desc: 'Manage courses', color: 'from-amber-500 to-amber-600' },
          ].map((action, index) => (
            <button
              key={action.label}
              className={`p-6 bg-gradient-to-br ${action.color} text-white rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group`}
            >
              <div className="flex items-center justify-between mb-4">
                <action.icon className="w-6 h-6 text-white/90" />
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-1">{action.label}</h3>
              <p className="text-sm text-white/80">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;