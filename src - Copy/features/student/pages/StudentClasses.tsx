import React from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { classes } from '@/shared/data';
import { Users, BookOpen, Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export default function StudentClasses() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Lớp học của tôi
          </h1>
          <p className="text-gray-600 mt-1">Tất cả các lớp học bạn đã đăng ký</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng số lớp</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{classes.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
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
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Giờ học/tuần</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((classItem) => (
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
                {/* Instructor */}
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Giảng viên: <strong>{classItem.instructor}</strong></span>
                </div>

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
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{classItem.studentCount} sinh viên</span>
                </div>

                {/* View Details Button */}
                <Link to={`/student/classes/${classItem.id}`} className="block mt-4">
                  <Button className="w-full gap-2 group-hover:bg-indigo-700 transition-colors">
                    Xem chi tiết
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