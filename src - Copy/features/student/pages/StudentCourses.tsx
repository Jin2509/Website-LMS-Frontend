import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Progress } from '@/shared/components/ui/progress';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { courses } from '@/shared/data';
import { Search, Filter, BookOpen, Clock, Award } from 'lucide-react';

export default function StudentCourses() {
  const [searchQuery, setSearchQuery] = useState('');

  const activeCourses = courses.filter(c => c.progress > 0 && c.progress < 100);
  const completedCourses = courses.filter(c => c.progress === 100);
  const allCourses = [...courses, ...completedCourses];

  const filterCourses = (courseList: typeof courses) => {
    return courseList.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Khóa học của tôi
          </h1>
          <p className="text-gray-600 mt-1">Quản lý và theo dõi tiến độ học tập của bạn</p>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Tìm kiếm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Lọc
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng đã đăng ký</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{courses.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đang học</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{activeCourses.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã hoàn thành</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{completedCourses.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Tất cả ({allCourses.length})</TabsTrigger>
            <TabsTrigger value="active">Đang học ({activeCourses.length})</TabsTrigger>
            <TabsTrigger value="completed">Đã hoàn thành ({completedCourses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterCourses(allCourses).map((course) => (
                <Link key={course.id} to={`/student/courses/${course.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <CardContent className="p-6">
                      <Badge className="mb-3">{course.category}</Badge>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">{course.instructor}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {course.completedLessons}/{course.totalLessons} bài học
                          </span>
                          <span className="font-semibold text-indigo-600">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterCourses(activeCourses).map((course) => (
                <Link key={course.id} to={`/student/courses/${course.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <CardContent className="p-6">
                      <Badge className="mb-3">{course.category}</Badge>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">{course.instructor}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {course.completedLessons}/{course.totalLessons} bài học
                          </span>
                          <span className="font-semibold text-indigo-600">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      <Button className="w-full mt-4">Tiếp tục học</Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterCourses(completedCourses).map((course) => (
                <Link key={course.id} to={`/student/courses/${course.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        Hoàn thành
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <Badge className="mb-3">{course.category}</Badge>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">{course.instructor}</p>
                      <Button variant="outline" className="w-full">Xem chứng chỉ</Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            {completedCourses.length === 0 && (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có khóa học hoàn thành. Tiếp tục học tập nhé!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}