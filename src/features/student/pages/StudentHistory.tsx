import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { courses, assignments } from '@/shared/data';
import { BookOpen, Award, CheckCircle, Clock, Calendar } from 'lucide-react';

export default function StudentHistory() {
  const completedCourses = courses.filter(c => c.progress === 100);
  const inProgressCourses = courses.filter(c => c.progress > 0 && c.progress < 100);
  const completedAssignments = assignments.filter(a => a.status === 'graded');

  // Learning timeline data
  const learningTimeline = [
    {
      date: '2026-03-20',
      type: 'course_completed',
      title: 'Advanced React Patterns',
      description: 'Completed all 24 lessons with 95% score',
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      date: '2026-03-18',
      type: 'assignment_graded',
      title: 'React Quiz - Week 5',
      description: 'Received grade: 92/100',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      date: '2026-03-15',
      type: 'course_started',
      title: 'Web Development Fundamentals',
      description: 'Enrolled in new course',
      icon: BookOpen,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      date: '2026-03-10',
      type: 'assignment_submitted',
      title: 'Final Project: Build a Web App',
      description: 'Submitted project for review',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  // Stats
  const totalCoursesCompleted = completedCourses.length;
  const totalAssignmentsCompleted = completedAssignments.length;
  const totalStudyHours = 248;
  const averageScore = 90;

  return (
    <Layout>
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning History</h1>
          <p className="text-gray-600 mt-1">Track your educational journey</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Courses Completed</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalCoursesCompleted}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assignments Done</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalAssignmentsCompleted}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Study Hours</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalStudyHours}h</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{averageScore}%</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="completed">Completed Courses</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="assignments">Assignments History</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Learning Timeline</CardTitle>
                <CardDescription>Your recent learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {learningTimeline.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${item.color}`} />
                          </div>
                          {index !== learningTimeline.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          </div>
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

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Courses</CardTitle>
                <CardDescription>Courses you've finished</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex gap-4 p-4 rounded-lg border border-gray-200"
                    >
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            <p className="text-sm text-gray-600">{course.instructor}</p>
                          </div>
                          <Badge className="bg-green-500">
                            <Award className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{course.totalLessons} lessons completed</span>
                          <span>•</span>
                          <span>Grade: 95%</span>
                          <span>•</span>
                          <span>Completed: March 20, 2026</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {completedCourses.length === 0 && (
                    <div className="text-center py-12">
                      <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No completed courses yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="in-progress">
            <Card>
              <CardHeader>
                <CardTitle>Courses In Progress</CardTitle>
                <CardDescription>Continue your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inProgressCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex gap-4 p-4 rounded-lg border border-gray-200"
                    >
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            <p className="text-sm text-gray-600">{course.instructor}</p>
                          </div>
                          <Badge variant="secondary">In Progress</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {course.completedLessons}/{course.totalLessons} lessons
                            </span>
                            <span className="font-semibold text-indigo-600">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Assignments History</CardTitle>
                <CardDescription>All your completed assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{assignment.course}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted: {assignment.dueDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">
                          {assignment.grade}%
                        </div>
                        <Badge variant="default" className="mt-2">Graded</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}