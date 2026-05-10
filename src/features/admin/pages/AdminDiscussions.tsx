import { useState, useEffect, useMemo } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  MessageSquare, 
  Search, 
  Clock,
  MessageCircle,
  ThumbsUp,
  Pin,
  Trash2,
  Eye,
  AlertTriangle,
  Activity,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { SemesterSelector } from '@/shared/components/common';
import { getSelectedSemester, saveSelectedSemester, semesters } from '@/shared/data/semesterData';
import { discussionService, type Discussion } from '@/core/service/discussion.service';
import { adminService } from '@/core/service/admin.service';

export default function AdminDiscussions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>(getSelectedSemester().id);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDiscussions();
  }, [selectedSemesterId]);

  const fetchDiscussions = async () => {
    setIsLoading(true);
    try {
      // Note: In a real app, you might pass semesterId to the API
      const data = await discussionService.getAllDiscussions();
      setDiscussions(data || []);
    } catch (error) {
      console.error('Error fetching discussions:', error);
      toast.error('Không thể tải danh sách thảo luận');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSemesterChange = (semesterId: string) => {
    setSelectedSemesterId(semesterId);
    saveSelectedSemester(semesterId);
  };

  const categories = ['all', 'Thông báo', 'Câu hỏi', 'Thảo luận', 'Tài liệu'];
  const statusFilters = [
    { value: 'all', label: 'Tất cả' },
    { value: 'ACTIVE', label: 'Hoạt động' },
    { value: 'REPORTED', label: 'Bị báo cáo' },
    { value: 'pinned', label: 'Đã ghim' },
  ];

  const filteredDiscussions = useMemo(() => {
    return discussions.filter(discussion => {
      const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (discussion.courseName && discussion.courseName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || discussion.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'pinned' && discussion.isPinned) ||
                           discussion.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [discussions, searchQuery, filterCategory, filterStatus]);

  const stats = useMemo(() => [
    {
      label: 'Tổng thảo luận',
      value: discussions.length.toString(),
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Hoạt động tích cực',
      value: discussions.filter(d => d.repliesCount > 10).length.toString(),
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Cần kiểm duyệt',
      value: discussions.filter(d => d.status === 'REPORTED').length.toString(),
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Bài viết đã ghim',
      value: discussions.filter(d => d.isPinned).length.toString(),
      icon: Pin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ], [discussions]);

  const handleDeleteDiscussion = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa thảo luận này?')) {
      try {
        await discussionService.deleteDiscussion(id);
        setDiscussions(discussions.filter(d => d.id !== id));
        toast.success('Đã xóa thảo luận thành công');
      } catch (error) {
        console.error('Error deleting discussion:', error);
        toast.error('Có lỗi xảy ra khi xóa thảo luận');
      }
    }
  };

  const handleTogglePin = async (id: number) => {
    try {
      await discussionService.togglePin(id);
      setDiscussions(discussions.map(d => 
        d.id === id ? { ...d, isPinned: !d.isPinned } : d
      ));
      toast.success('Đã cập nhật trạng thái ghim');
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Có lỗi xảy ra khi cập nhật ghim');
    }
  };

  const handleApproveDiscussion = async (id: number) => {
    try {
      await adminService.approveReportedDiscussions([id]);
      setDiscussions(discussions.map(d => 
        d.id === id ? { ...d, status: 'ACTIVE' as const, reportsCount: 0 } : d
      ));
      toast.success('Đã phê duyệt thảo luận');
    } catch (error) {
      console.error('Error approving discussion:', error);
      toast.error('Có lỗi xảy ra khi phê duyệt');
    }
  };

  const getStatusBadge = (discussion: Discussion) => {
    if (discussion.status === 'REPORTED') {
      return <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="w-3 h-3" />
        {discussion.reportsCount || 0} báo cáo
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
    if (role === 'TEACHER') {
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">Giảng viên</Badge>;
    }
    if (role === 'ADMIN') {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Admin</Badge>;
    }
    return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Sinh viên</Badge>;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Quản lý thảo luận
          </h1>
          <p className="text-gray-600 mt-1">Giám sát và kiểm duyệt các thảo luận trên toàn hệ thống</p>
        </div>

        {/* Semester Selector */}
        <div className="mb-8">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <SemesterSelector 
                semesters={semesters}
                selectedSemester={selectedSemesterId}
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
              <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white p-1 shadow-sm border border-gray-100 rounded-lg">
            <TabsTrigger value="all" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Tất cả bài viết</TabsTrigger>
            <TabsTrigger value="reported" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">Cần kiểm duyệt</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6 animate-in fade-in duration-300">
            {/* Search and Filters */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm tiêu đề, nội dung..."
                      className="pl-10 h-11"
                    />
                  </div>
                  
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="h-11 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'Tất cả danh mục' : cat}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-11 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {statusFilters.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Discussions List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                  <p className="text-gray-500 font-medium">Đang tải thảo luận...</p>
                </div>
              ) : filteredDiscussions.length === 0 ? (
                <Card className="border-none shadow-sm">
                  <CardContent className="p-20 text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                    <p className="text-gray-500 font-medium text-lg">Không tìm thấy thảo luận nào</p>
                    <Button variant="link" onClick={() => { setSearchQuery(''); setFilterCategory('all'); setFilterStatus('all'); }}>Xóa bộ lọc</Button>
                  </CardContent>
                </Card>
              ) : (
                filteredDiscussions.map((discussion) => (
                  <Card 
                    key={discussion.id} 
                    className={`hover:shadow-md transition-all border-none shadow-sm overflow-hidden ${discussion.status === 'REPORTED' ? 'ring-1 ring-orange-300 bg-orange-50/30' : ''}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                          {discussion.authorAvatar || discussion.authorName.charAt(0)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">
                                  {discussion.title}
                                </h3>
                                {getStatusBadge(discussion)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                                <span className="font-bold text-gray-700">{discussion.authorName}</span>
                                {getRoleBadge(discussion.authorRole)}
                                <span>•</span>
                                <Badge variant="outline" className="bg-white">{discussion.courseName || 'Chung'}</Badge>
                                <span>•</span>
                                <Badge variant="secondary" className="bg-white">{discussion.category}</Badge>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-xs">
                                  <Clock className="w-3.5 h-3.5" />
                                  {new Date(discussion.createdAt).toLocaleString('vi-VN')}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">{discussion.content}</p>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                            <div className="flex items-center gap-6 text-xs font-medium text-gray-400">
                              <span className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-default">
                                <MessageCircle className="w-4 h-4" />
                                {discussion.repliesCount} phản hồi
                              </span>
                              <span className="flex items-center gap-1.5 hover:text-pink-600 transition-colors cursor-default">
                                <ThumbsUp className="w-4 h-4" />
                                {discussion.likesCount} thích
                              </span>
                              <span className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-default">
                                <Eye className="w-4 h-4" />
                                {discussion.viewsCount} xem
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {discussion.status === 'REPORTED' ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleApproveDiscussion(discussion.id)}
                                    className="gap-2 text-green-600 border-green-200 hover:bg-green-50 h-9"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Phê duyệt
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleTogglePin(discussion.id)}
                                    className={`gap-2 h-9 ${discussion.isPinned ? 'text-indigo-600 border-indigo-200 bg-indigo-50' : ''}`}
                                  >
                                    <Pin className="w-4 h-4" />
                                    {discussion.isPinned ? 'Bỏ ghim' : 'Ghim'}
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteDiscussion(discussion.id)}
                                className="gap-2 text-red-500 hover:text-red-700 border-red-100 hover:bg-red-50 h-9"
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

          <TabsContent value="reported" className="animate-in fade-in duration-300">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-orange-50/50 border-b border-orange-100">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Yêu cầu kiểm duyệt
                </CardTitle>
                <CardDescription>
                  Danh sách các bài viết bị người dùng báo cáo vi phạm tiêu chuẩn cộng đồng
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {discussions.filter(d => d.status === 'REPORTED').length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <p className="text-gray-500 font-medium">Tuyệt vời! Không có bài viết nào cần kiểm duyệt.</p>
                    </div>
                  ) : (
                    discussions.filter(d => d.status === 'REPORTED').map((discussion) => (
                      <div 
                        key={discussion.id}
                        className="p-5 border border-orange-200 rounded-xl bg-orange-50/30 flex flex-col md:flex-row gap-6 items-start justify-between animate-in slide-in-from-right-2 duration-300"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-gray-900 text-lg truncate">{discussion.title}</h4>
                            <Badge variant="destructive" className="bg-red-500">{discussion.reportsCount} báo cáo</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                            <span className="font-bold text-gray-700">{discussion.authorName}</span>
                            {getRoleBadge(discussion.authorRole)}
                            <span>•</span>
                            <span className="text-xs">{new Date(discussion.createdAt).toLocaleString('vi-VN')}</span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3 italic bg-white/50 p-3 rounded-lg border border-orange-100">
                            "{discussion.content}"
                          </p>
                        </div>
                        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                          <Button
                            onClick={() => handleApproveDiscussion(discussion.id)}
                            className="bg-green-600 hover:bg-green-700 text-white gap-2 flex-1 md:w-32"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Giữ lại
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteDiscussion(discussion.id)}
                            className="gap-2 flex-1 md:w-32"
                          >
                            <XCircle className="w-4 h-4" />
                            Xóa bài
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
