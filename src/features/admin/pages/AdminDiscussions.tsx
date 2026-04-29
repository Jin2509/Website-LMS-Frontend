import React, { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { 
  MessageSquare, 
  Search, 
  Clock,
  MessageCircle,
  ThumbsUp,
  Pin,
  Trash2,
  Shield,
  Eye,
  AlertTriangle,
  TrendingUp,
  Users,
  Activity,
  BarChart3,
  Filter,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { SemesterSelector } from '@/shared/components/common';
import { getSelectedSemester, saveSelectedSemester, type Semester } from '@/shared/data/semesterData';

export default function AdminDiscussions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState<Semester>(getSelectedSemester());

  const handleSemesterChange = (semester: Semester) => {
    setSelectedSemester(semester);
    saveSelectedSemester(semester.id);
  };

  // Mock data - all discussions from all courses
  const allDiscussions = [
    {
      id: '1',
      title: 'Hướng dẫn nộp bài tập cuối kỳ',
      content: 'Các em chú ý deadline nộp bài là 20/4/2026. File nộp phải là PDF hoặc DOCX.',
      author: 'TS. Nguyễn Văn A',
      authorAvatar: 'A',
      authorRole: 'teacher',
      course: 'Lập trình Web nâng cao',
      category: 'Thông báo',
      createdAt: '2026-04-05 09:00',
      replies: 24,
      likes: 56,
      isPinned: true,
      views: 523,
      status: 'active',
      reports: 0,
    },
    {
      id: '2',
      title: 'Cách sử dụng React Hooks hiệu quả?',
      content: 'Mọi người có thể chia sẻ kinh nghiệm sử dụng React Hooks không?',
      author: 'Nguyễn Văn B',
      authorAvatar: 'B',
      authorRole: 'student',
      course: 'Lập trình Web nâng cao',
      category: 'Câu hỏi',
      createdAt: '2026-04-07 10:30',
      replies: 15,
      likes: 23,
      isPinned: false,
      views: 234,
      status: 'active',
      reports: 0,
    },
    {
      id: '3',
      title: 'Tài liệu tham khảo cho bài thi giữa kỳ',
      content: 'Thầy đã upload tài liệu ôn tập lên hệ thống. Các em tải về và học kỹ nhé.',
      author: 'ThS. Trần Thị B',
      authorAvatar: 'B',
      authorRole: 'teacher',
      course: 'Cơ sở dữ liệu',
      category: 'Tài liệu',
      createdAt: '2026-04-06 14:00',
      replies: 18,
      likes: 42,
      isPinned: true,
      views: 412,
      status: 'active',
      reports: 0,
    },
    {
      id: '4',
      title: 'Spam content - cần kiểm duyệt',
      content: 'Nội dung vi phạm quy định...',
      author: 'User X',
      authorAvatar: 'X',
      authorRole: 'student',
      course: 'Lập trình Web nâng cao',
      category: 'Câu hỏi',
      createdAt: '2026-04-07 14:20',
      replies: 2,
      likes: 0,
      isPinned: false,
      views: 45,
      status: 'reported',
      reports: 5,
    },
    {
      id: '5',
      title: 'Thảo luận về đồ án cuối kỳ',
      content: 'Các bạn muốn làm về chủ đề gì?',
      author: 'Lê Văn C',
      authorAvatar: 'C',
      authorRole: 'student',
      course: 'Trí tuệ nhân tạo',
      category: 'Thảo luận',
      createdAt: '2026-04-08 08:15',
      replies: 32,
      likes: 48,
      isPinned: false,
      views: 356,
      status: 'active',
      reports: 0,
    },
  ];

  // Statistics
  const stats = [
    {
      label: 'Tổng thảo luận',
      value: allDiscussions.length.toString(),
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
    },
    {
      label: 'Hoạt động hôm nay',
      value: '24',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8%',
    },
    {
      label: 'Cần kiểm duyệt',
      value: allDiscussions.filter(d => d.reports > 0).length.toString(),
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '-2',
    },
    {
      label: 'Người tham gia',
      value: '1,234',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+156',
    },
  ];

  const categories = ['all', 'Thông báo', 'Câu hỏi', 'Thảo luận', 'Tài liệu'];
  const statusFilters = [
    { value: 'all', label: 'Tất cả' },
    { value: 'active', label: 'Hoạt động' },
    { value: 'reported', label: 'Bị báo cáo' },
    { value: 'pinned', label: 'Đã ghim' },
  ];

  const filteredDiscussions = allDiscussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discussion.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || discussion.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'pinned' && discussion.isPinned) ||
                         discussion.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDeleteDiscussion = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thảo luận này?')) {
      toast.success('Đã xóa thảo luận');
    }
  };

  const handleTogglePin = (id: string) => {
    toast.success('Đã cập nhật trạng thái ghim');
  };

  const handleApproveDiscussion = (id: string) => {
    toast.success('Đã phê duyệt thảo luận');
  };

  const handleRejectDiscussion = (id: string) => {
    toast.success('Đã từ chối và ẩn thảo luận');
  };

  const getStatusBadge = (discussion: typeof allDiscussions[0]) => {
    if (discussion.reports > 0) {
      return <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="w-3 h-3" />
        {discussion.reports} báo cáo
      </Badge>;
    }
    if (discussion.isPinned) {
      return <Badge variant="default" className="gap-1">
        <Pin className="w-3 h-3" />
        Đã ghim
      </Badge>;
    }
    return null;
  };

  const getRoleBadge = (role: string) => {
    if (role === 'teacher') {
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
        Giáo viên
      </Badge>;
    }
    return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
      Học sinh
    </Badge>;
  };

  return (
    <Layout>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Quản lý thảo luận
          </h1>
          <p className="text-gray-600 mt-1">Giám sát và kiểm duyệt các thảo luận trên hệ thống</p>
        </div>

        {/* Semester Selector */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-4">
              <SemesterSelector 
                selectedSemester={selectedSemester}
                onSemesterChange={handleSemesterChange}
              />
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <span className={`text-xs font-semibold ${stat.color}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="reported">Cần kiểm duyệt</TabsTrigger>
            <TabsTrigger value="stats">Thống kê</TabsTrigger>
          </TabsList>

          {/* All Discussions Tab */}
          <TabsContent value="all" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm thảo luận..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat === 'all' ? 'Tất cả danh mục' : cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {statusFilters.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Discussions List */}
            <div className="space-y-4">
              {filteredDiscussions.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Không tìm thấy thảo luận nào</p>
                  </CardContent>
                </Card>
              ) : (
                filteredDiscussions.map((discussion) => (
                  <Card 
                    key={discussion.id} 
                    className={`hover:shadow-md transition-all ${discussion.reports > 0 ? 'border-orange-300 bg-orange-50' : ''}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {discussion.authorAvatar}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-semibold text-lg text-gray-900">
                                  {discussion.title}
                                </h3>
                                {getStatusBadge(discussion)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                                <span className="font-medium">{discussion.author}</span>
                                {getRoleBadge(discussion.authorRole)}
                                <span>•</span>
                                <Badge variant="outline">{discussion.course}</Badge>
                                <span>•</span>
                                <Badge variant="outline">{discussion.category}</Badge>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {discussion.createdAt}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-4 line-clamp-2">{discussion.content}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                {discussion.replies} phản hồi
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4" />
                                {discussion.likes} thích
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {discussion.views} lượt xem
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {discussion.reports > 0 ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleApproveDiscussion(discussion.id)}
                                    className="gap-2 text-green-600 border-green-300 hover:bg-green-50"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Phê duyệt
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRejectDiscussion(discussion.id)}
                                    className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Từ chối
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleTogglePin(discussion.id)}
                                    className="gap-2"
                                  >
                                    <Pin className="w-4 h-4" />
                                    {discussion.isPinned ? 'Bỏ ghim' : 'Ghim'}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedThread(discussion.id)}
                                    className="gap-2"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Xem
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteDiscussion(discussion.id)}
                                className="gap-2 text-red-600 hover:text-red-700 border-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                                Xóa
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Reported Discussions Tab */}
          <TabsContent value="reported" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Các thảo luận cần kiểm duyệt
                </CardTitle>
                <CardDescription>
                  Danh sách các bài viết bị báo cáo vi phạm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allDiscussions.filter(d => d.reports > 0).length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                      <p className="text-gray-600">Không có thảo luận nào cần kiểm duyệt</p>
                    </div>
                  ) : (
                    allDiscussions.filter(d => d.reports > 0).map((discussion) => (
                      <div 
                        key={discussion.id}
                        className="p-4 border-2 border-orange-300 rounded-lg bg-orange-50"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{discussion.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <span>{discussion.author}</span>
                              {getRoleBadge(discussion.authorRole)}
                              <span>•</span>
                              <Badge variant="outline">{discussion.course}</Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{discussion.content}</p>
                          </div>
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {discussion.reports} báo cáo
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveDiscussion(discussion.id)}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Phê duyệt - Bài viết hợp lệ
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectDiscussion(discussion.id)}
                            className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4" />
                            Từ chối - Ẩn bài viết
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteDiscussion(discussion.id)}
                            className="gap-2 text-red-600 border-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa vĩnh viễn
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Thống kê theo danh mục
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.filter(c => c !== 'all').map(category => {
                      const count = allDiscussions.filter(d => d.category === category).length;
                      const percentage = (count / allDiscussions.length) * 100;
                      return (
                        <div key={category}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{category}</span>
                            <span className="text-sm font-bold text-gray-900">{count} bài</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Thảo luận phổ biến
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {allDiscussions
                      .sort((a, b) => (b.views + b.likes + b.replies) - (a.views + a.likes + a.replies))
                      .slice(0, 5)
                      .map((discussion, index) => (
                        <div key={discussion.id} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-indigo-600">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{discussion.title}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                              <span>{discussion.views} lượt xem</span>
                              <span>•</span>
                              <span>{discussion.replies} phản hồi</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}