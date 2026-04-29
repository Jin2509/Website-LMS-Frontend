import React, { useState, useRef, ChangeEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Textarea } from '@/shared/components/ui/textarea';
import { Input } from '@/shared/components/ui/input';
import { 
  Calendar,
  Clock,
  FileText,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Award,
  User,
  Send,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'late';
  grade?: number;
  files: { name: string; size: string }[];
  feedback?: string;
}

export default function AssignmentDetail() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);

  // Check if user is teacher (mock - in real app, get from auth context)
  const userRole = 'student'; // or 'teacher'

  // Mock assignment data
  const assignment = {
    id: assignmentId,
    title: 'Bài tập 1: Tạo Component React đầu tiên',
    courseTitle: 'Lập trình Web với React',
    description: `
      <h3>Mục tiêu</h3>
      <p>Trong bài tập này, bạn sẽ tạo component React đầu tiên của mình và hiểu cách hoạt động của JSX.</p>
      
      <h3>Yêu cầu</h3>
      <ol>
        <li>Tạo một Function Component tên là <code>Greeting</code></li>
        <li>Component nhận prop <code>name</code> và hiển thị lời chào</li>
        <li>Thêm CSS để tạo style cho component</li>
        <li>Tạo ít nhất 3 instances của component với tên khác nhau</li>
        <li>Sử dụng useState để thêm tính năng tương tác (ví dụ: đếm số lần click)</li>
      </ol>

      <h3>Tiêu chí chấm điểm</h3>
      <ul>
        <li><strong>Code quality (30 điểm):</strong> Code sạch, có comment phù hợp</li>
        <li><strong>Functionality (40 điểm):</strong> Component hoạt động đúng yêu cầu</li>
        <li><strong>Styling (15 điểm):</strong> UI đẹp và responsive</li>
        <li><strong>Creativity (15 điểm):</strong> Thêm tính năng độc đáo</li>
      </ul>

      <h3>Tài liệu tham khảo</h3>
      <p>Xem lại bài học về JSX và Components. Tham khảo React documentation tại <a href="https://react.dev" target="_blank">react.dev</a></p>

      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <p><strong>⚠️ Lưu ý:</strong> Nộp bài đúng hạn để nhận điểm tối đa. Bài nộp trễ sẽ bị trừ 10% điểm mỗi ngày.</p>
      </div>
    `,
    dueDate: '2024-04-15T23:59:00',
    points: 100,
    status: 'pending' as 'submitted' | 'pending' | 'graded' | 'late',
    submittedAt: null as string | null,
    grade: null as number | null,
    feedback: null as string | null,
    files: [
      { name: 'Assignment-Template.zip', size: '1.2 MB', url: '#' },
      { name: 'Starter-Code.js', size: '500 KB', url: '#' },
    ],
  };

  // Mock submissions data (for teacher view)
  const submissions: Submission[] = [
    {
      id: 'sub-1',
      studentName: 'Nguyễn Văn A',
      studentId: 'SV001',
      submittedAt: '2024-04-14T15:30:00',
      status: 'graded',
      grade: 95,
      files: [
        { name: 'greeting-component.zip', size: '2.1 MB' },
        { name: 'demo-video.mp4', size: '15 MB' },
      ],
      feedback: 'Bài làm rất tốt! Code sạch sẽ, có tính năng sáng tạo. Cần cải thiện phần responsive.',
    },
    {
      id: 'sub-2',
      studentName: 'Trần Thị B',
      studentId: 'SV002',
      submittedAt: '2024-04-15T20:15:00',
      status: 'submitted',
      files: [
        { name: 'my-component.zip', size: '1.8 MB' },
      ],
    },
    {
      id: 'sub-3',
      studentName: 'Lê Văn C',
      studentId: 'SV003',
      submittedAt: '2024-04-16T10:00:00',
      status: 'late',
      files: [
        { name: 'assignment.zip', size: '2.5 MB' },
      ],
    },
  ];

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0 && !submissionText) {
      alert('Vui lòng thêm tệp hoặc nhập nội dung bài làm!');
      return;
    }
    alert('Nộp bài thành công! Giáo viên sẽ chấm điểm sớm.');
    // Handle submission logic
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      submitted: <Badge className="bg-blue-500">Đã nộp</Badge>,
      pending: <Badge variant="outline" className="text-orange-600 border-orange-600">Chưa nộp</Badge>,
      graded: <Badge className="bg-green-500">Đã chấm điểm</Badge>,
      late: <Badge variant="destructive">Nộp muộn</Badge>,
    };
    return badges[status as keyof typeof badges];
  };

  const isOverdue = new Date() > new Date(assignment.dueDate);
  const daysUntilDue = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Layout>
      <div className="w-full max-w-[1600px] mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6 text-base"
          >
            ← Quay lại
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{assignment.title}</h1>
              <p className="text-lg text-gray-600">{assignment.courseTitle}</p>
            </div>
            {getStatusBadge(assignment.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Assignment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Thông tin bài tập</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
                    <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hạn nộp</p>
                      <p className="font-semibold text-gray-900 text-lg">
                        {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
                    <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Award className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Điểm tối đa</p>
                      <p className="font-semibold text-gray-900 text-lg">{assignment.points} điểm</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                      isOverdue ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      <Clock className={`w-7 h-7 ${isOverdue ? 'text-red-600' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Thời gian còn lại</p>
                      <p className={`font-semibold text-lg ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                        {isOverdue ? 'Đã hết hạn' : `${daysUntilDue} ngày`}
                      </p>
                    </div>
                  </div>
                </div>

                {!isOverdue && daysUntilDue <= 3 && (
                  <div className="flex items-start gap-4 p-6 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-orange-900 text-lg">Sắp hết hạn!</p>
                      <p className="text-base text-orange-700">Còn {daysUntilDue} ngày để nộp bài tập này.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assignment Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Mô tả bài tập</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-base max-w-none"
                  dangerouslySetInnerHTML={{ __html: assignment.description }}
                />
              </CardContent>
            </Card>

            {/* Assignment Files */}
            {assignment.files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <FileText className="w-6 h-6 text-indigo-600" />
                    Tài liệu đính kèm ({assignment.files.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignment.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-5 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-base font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="w-5 h-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Student Submission Area */}
            {userRole === 'student' && assignment.status !== 'graded' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Nộp bài</CardTitle>
                  <CardDescription className="text-base">Tải lên tệp hoặc nhập nội dung bài làm của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-base font-medium text-gray-700 mb-3 block">
                      Nội dung bài làm (tùy chọn)
                    </label>
                    <Textarea
                      placeholder="Nhập nội dung, link GitHub, hoặc ghi chú..."
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      rows={6}
                      className="resize-none text-base"
                    />
                  </div>

                  <div>
                    <label className="text-base font-medium text-gray-700 mb-3 block">
                      Tệp đính kèm
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                    >
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-base text-gray-600 mb-2">
                        Click để chọn tệp hoặc kéo thả vào đây
                      </p>
                      <p className="text-sm text-gray-500">
                        Hỗ trợ: .zip, .pdf, .doc, .jpg, .png (tối đa 50MB)
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".zip,.pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-base font-medium text-gray-700">
                        Đã chọn {selectedFiles.length} tệp:
                      </p>
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <FileText className="w-6 h-6 text-gray-600" />
                            <div>
                              <p className="text-base font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button onClick={handleSubmit} className="w-full gap-2 text-base py-6">
                    <Send className="w-5 h-5" />
                    Nộp bài
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Teacher View - Submissions List */}
            {userRole === 'teacher' && (
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách bài nộp ({submissions.length})</CardTitle>
                  <CardDescription>Quản lý và chấm điểm bài nộp của học sinh</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="border rounded-lg overflow-hidden">
                      <div
                        className="p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() =>
                          setExpandedSubmission(
                            expandedSubmission === submission.id ? null : submission.id
                          )
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{submission.studentName}</p>
                              <p className="text-xs text-gray-500">
                                {submission.studentId} • Nộp lúc:{' '}
                                {new Date(submission.submittedAt).toLocaleString('vi-VN')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {submission.grade !== undefined && (
                              <div className="text-right">
                                <p className="text-2xl font-bold text-indigo-600">
                                  {submission.grade}
                                </p>
                                <p className="text-xs text-gray-500">/{assignment.points}</p>
                              </div>
                            )}
                            {getStatusBadge(submission.status)}
                          </div>
                        </div>
                      </div>

                      {expandedSubmission === submission.id && (
                        <div className="p-4 bg-gray-50 border-t space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Tệp đính kèm:</p>
                            <div className="space-y-2">
                              {submission.files.map((file, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2 bg-white rounded border"
                                >
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-900">{file.name}</span>
                                    <span className="text-xs text-gray-500">({file.size})</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="ghost">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {submission.feedback && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Nhận xét:</p>
                              <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                                {submission.feedback}
                              </p>
                            </div>
                          )}

                          {submission.status === 'submitted' && (
                            <div className="space-y-3">
                              <div className="flex gap-3">
                                <div className="flex-1">
                                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    Điểm số
                                  </label>
                                  <Input type="number" placeholder="0-100" max={assignment.points} />
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                  Nhận xét
                                </label>
                                <Textarea placeholder="Nhập nhận xét cho học sinh..." rows={3} />
                              </div>
                              <Button className="w-full gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Lưu điểm
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Student Grade Card */}
              {userRole === 'student' && assignment.grade !== null && (
                <Card>
                  <CardHeader>
                    <CardTitle>Kết quả</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-4">
                      <p className="text-5xl font-bold text-indigo-600">{assignment.grade}</p>
                      <p className="text-gray-600">/ {assignment.points} điểm</p>
                    </div>
                    {assignment.feedback && (
                      <div className="text-left bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Nhận xét:</p>
                        <p className="text-sm text-gray-600">{assignment.feedback}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats for Teacher */}
              {userRole === 'teacher' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Thống kê</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-gray-700">Đã nộp</span>
                      <span className="font-bold text-blue-600">
                        {submissions.filter((s) => s.status !== 'pending').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-700">Đã chấm</span>
                      <span className="font-bold text-green-600">
                        {submissions.filter((s) => s.status === 'graded').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm text-gray-700">Chưa chấm</span>
                      <span className="font-bold text-orange-600">
                        {submissions.filter((s) => s.status === 'submitted').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm text-gray-700">Nộp muộn</span>
                      <span className="font-bold text-red-600">
                        {submissions.filter((s) => s.status === 'late').length}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              {userRole === 'teacher' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Thao tác</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full gap-2">
                      <Edit className="w-4 h-4" />
                      Chỉnh sửa bài tập
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Download className="w-4 h-4" />
                      Xuất danh sách
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}