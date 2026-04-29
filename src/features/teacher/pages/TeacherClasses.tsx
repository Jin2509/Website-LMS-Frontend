import React from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { classes } from '@/shared/data';
import { Users, BookOpen, Calendar, Clock, MapPin, ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';

export default function TeacherClasses() {
  // Filter classes for current teacher (for demo, showing all)
  const myClasses = classes;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
              Lớp học của tôi
            </h1>
            <p className="text-gray-600 mt-1">Quản lý các lớp học bạn đang giảng dạy</p>
          </div>
          <Button 
            className="gap-2" 
            onClick={() => toast.info('Tính năng tạo lớp học mới sẽ sớm được cập nhật')}
          >
            <Plus className="w-4 h-4" />
            Tạo lớp mới
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng số lớp</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{myClasses.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng sinh viên</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {myClasses.reduce((sum, c) => sum + c.studentCount, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Kỳ học</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">Fall 2026</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Giờ dạy/tuần</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myClasses.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl">{classItem.name}</CardTitle>
                      <Badge variant="default">
                        {classItem.semester} {classItem.year}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {classItem.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Schedule */}
                {classItem.schedule && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{classItem.schedule}</span>
                  </div>
                )}

                {/* Room */}
                {classItem.room && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Phòng: {classItem.room}</span>
                  </div>
                )}

                {/* Students count */}
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{classItem.studentCount} sinh viên</span>
                </div>

                {/* Assignments count */}
                <div className="flex items-center gap-2 text-gray-700">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{classItem.assignmentIds.length} bài tập</span>
                </div>

                {/* View Details Button */}
                <Link to={`/teacher/classes/${classItem.id}`} className="block mt-4">
                  <Button className="w-full gap-2 group-hover:bg-indigo-700 transition-colors">
                    Quản lý lớp học
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}