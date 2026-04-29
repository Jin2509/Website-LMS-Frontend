import React from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { courses, assignments } from '@/shared/data';
import { BookOpen, Users, FileCheck, Award, Calendar, TrendingUp } from 'lucide-react';

export default function TeacherHistory() {
  const myCourses = courses.filter(c => c.instructor === 'Dr. Sarah Smith');
  const myAssignments = assignments;

  // Teaching timeline
  const teachingTimeline = [
    {
      date: '2026-03-20',
      type: 'course_created',
      title: 'Advanced React Patterns',
      description: 'Created new course with 24 lessons',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      date: '2026-03-18',
      type: 'assignments_graded',
      title: 'Graded 15 assignments',
      description: 'Web Development Fundamentals - Week 5',
      icon: FileCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      date: '2026-03-15',
      type: 'student_milestone',
      title: '50 students enrolled',
      description: 'Introduction to Computer Science reached milestone',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      date: '2026-03-10',
      type: 'achievement',
      title: 'Course completion rate: 95%',
      description: 'Data Structures and Algorithms achieved high completion',
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  // Course statistics
  const courseStats = [
    {
      course: 'Web Development Fundamentals',
      students: 52,
      completionRate: 78,
      avgGrade: 88,
      assignments: 24,
    },
    {
      course: 'Introduction to Computer Science',
      students: 48,
      completionRate: 85,
      avgGrade: 90,
      assignments: 20,
    },
    {
      course: 'Data Structures and Algorithms',
      students: 35,
      completionRate: 72,
      avgGrade: 85,
      assignments: 18,
    },
  ];

  // Teaching stats
  const totalStudents = 156;
  const totalCourses = myCourses.length;
  const totalAssignmentsGraded = 342;
  const avgStudentSatisfaction = 4.8;

  return (
    <Layout>
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teaching History</h1>
          <p className="text-gray-600 mt-1">Review your teaching journey and impact</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students Taught</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Courses Created</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalCourses}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assignments Graded</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalAssignmentsGraded}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Student Rating</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{avgStudentSatisfaction}/5.0</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="courses">All Courses</TabsTrigger>
            <TabsTrigger value="statistics">Course Statistics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Teaching Timeline</CardTitle>
                <CardDescription>Your recent teaching activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {teachingTimeline.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${item.color}`} />
                          </div>
                          {index !== teachingTimeline.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>All Courses</CardTitle>
                <CardDescription>Complete list of your teaching materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myCourses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <Badge className="mb-2">{course.category}</Badge>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              52 students
                            </span>
                            <span>{course.totalLessons} lessons</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Created: Jan 2026</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics">
            <Card>
              <CardHeader>
                <CardTitle>Course Statistics</CardTitle>
                <CardDescription>Performance metrics for each course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseStats.map((stat, index) => (
                    <div
                      key={index}
                      className="p-6 rounded-lg border border-gray-200"
                    >
                      <h3 className="font-semibold text-gray-900 mb-4">{stat.course}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Students</p>
                          <p className="text-2xl font-bold text-blue-600">{stat.students}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                          <p className="text-2xl font-bold text-green-600">{stat.completionRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Avg. Grade</p>
                          <p className="text-2xl font-bold text-purple-600">{stat.avgGrade}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Assignments</p>
                          <p className="text-2xl font-bold text-orange-600">{stat.assignments}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Teaching Achievements</CardTitle>
                <CardDescription>Milestones and recognitions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-lg border-2 border-yellow-200 bg-yellow-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Top Instructor</h3>
                        <p className="text-sm text-gray-600">Q1 2026</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      Recognized for outstanding student satisfaction ratings
                    </p>
                  </div>

                  <div className="p-6 rounded-lg border-2 border-blue-200 bg-blue-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">100+ Students</h3>
                        <p className="text-sm text-gray-600">Feb 2026</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      Reached milestone of teaching 100+ students
                    </p>
                  </div>

                  <div className="p-6 rounded-lg border-2 border-green-200 bg-green-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Course Creator</h3>
                        <p className="text-sm text-gray-600">Jan 2026</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      Published 3 comprehensive courses with excellent reviews
                    </p>
                  </div>

                  <div className="p-6 rounded-lg border-2 border-purple-200 bg-purple-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">High Engagement</h3>
                        <p className="text-sm text-gray-600">Mar 2026</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      Maintained 95% average student engagement rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}