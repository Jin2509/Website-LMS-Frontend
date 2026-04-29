import React, { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { studentSubmissions, assignments } from '@/shared/data';
import { Download, FileText, Calendar, User, Search, ChevronLeft } from 'lucide-react';

export default function AssignmentSubmissions() {
  const { assignmentId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const assignment = assignments.find(a => a.id === assignmentId);
  const submissions = studentSubmissions.filter(s => s.assignmentId === assignmentId);

  const filteredSubmissions = submissions.filter(s => 
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (fileName: string) => {
    // In a real app, this would download the file from the server
    alert(`Đang tải xuống: ${fileName}`);
  };

  if (!assignment) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài tập</h2>
          <p className="text-gray-600 mb-4">Bài tập này không tồn tại hoặc đã bị xóa.</p>
          <Button asChild>
            <Link to="/teacher/dashboard">Quay lại Trang chủ</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const submittedCount = submissions.length;
  const gradedCount = submissions.filter(s => s.status === 'graded').length;
  const averageGrade = submissions
    .filter(s => s.grade !== undefined)
    .reduce((sum, s) => sum + (s.grade || 0), 0) / (gradedCount || 1);

  return (
    <Layout>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" className="mb-4" asChild>
            <Link to="/teacher/dashboard">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
          <p className="text-gray-600">Danh sách bài nộp của học sinh</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Tổng bài nộp</p>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{submittedCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Đã chấm điểm</p>
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{gradedCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Chờ chấm</p>
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{submittedCount - gradedCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Điểm TB</p>
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{averageGrade.toFixed(1)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email học sinh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách bài nộp ({filteredSubmissions.length})</CardTitle>
            <CardDescription>Quản lý và tải xuống bài nộp của học sinh</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Chưa có bài nộp nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-indigo-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {submission.studentName}
                            </h3>
                            <p className="text-sm text-gray-600">{submission.studentEmail}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Nộp: {new Date(submission.submittedDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>{submission.fileName} ({submission.fileSize})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {submission.status === 'graded' ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                Điểm: {submission.grade}
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                Chờ chấm
                              </Badge>
                            )}
                          </div>
                        </div>

                        {submission.feedback && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-1">Nhận xét:</p>
                            <p className="text-sm text-gray-600">{submission.feedback}</p>
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => handleDownload(submission.fileName)}
                        className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Download className="w-4 h-4" />
                        Tải xuống
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}