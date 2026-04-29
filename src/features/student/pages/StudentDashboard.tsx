import { useMemo } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import { ContributionGraph } from '@/shared/components/common';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StudentDashboard() {
  const contributionData = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (364 - i));
    const dateStr = date.toISOString().split('T')[0];
    const count = Math.random() > 0.7 ? Math.floor(Math.random() * 8) : 0;
    return { date: dateStr, count };
  });

  // Weekly learning stats
  const weeklyStats = useMemo(() => [
    { id: 'mon', name: 'Mon', hours: 3.5 },
    { id: 'tue', name: 'Tue', hours: 2.8 },
    { id: 'wed', name: 'Wed', hours: 4.2 },
    { id: 'thu', name: 'Thu', hours: 3.1 },
    { id: 'fri', name: 'Fri', hours: 2.5 },
    { id: 'sat', name: 'Sat', hours: 5.0 },
    { id: 'sun', name: 'Sun', hours: 4.5 },
  ], []);

  const stats = [
    {
      label: 'Khóa học đã đăng ký',
      value: '4',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Đang học',
      value: '3',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Điểm trung bình',
      value: '90%',
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Giờ học',
      value: '48h',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-[#1A1953] bg-clip-text text-transparent mb-2">
            Chào mừng trở lại!
          </h1>
          <p className="text-gray-600 mt-1">
            Tiếp tục hành trình học tập của bạn
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contribution Graph */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động học tập</CardTitle>
              <CardDescription>
                Theo dõi thói quen học tập của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ContributionGraph data={contributionData} />
            </CardContent>
          </Card>
        </div>

        {/* Weekly Learning Stats */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Giờ học hàng tuần</CardTitle>
              <CardDescription>Xem tiến độ học tập trong tuần</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div key="student-weekly-chart">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    id="student-weekly-stats-chart"
                    data={weeklyStats}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid key="student-grid" strokeDasharray="3 3" />
                    <XAxis key="student-xaxis" dataKey="name" />
                    <YAxis key="student-yaxis" />
                    <Tooltip key="student-tooltip" />
                    <Legend key="student-legend" />
                    <Bar
                      key="student-hours-bar"
                      dataKey="hours"
                      fill="#8884d8"
                      name="Giờ học"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}