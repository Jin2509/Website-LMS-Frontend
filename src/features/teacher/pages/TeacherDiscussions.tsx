import React, { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Clock,
  MessageCircle,
  ThumbsUp,
  Pin,
  Lock,
  Send,
  Filter,
  TrendingUp,
  Trash2,
  Edit,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { getCurrentUser } from '@/features/auth/services/auth';

export default function TeacherDiscussions() {
  const user = getCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    category: 'general',
    isPinned: false,
  });
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Mock data
  const discussions = [
    {
      id: '1',
      title: 'Hướng dẫn nộp bài tập cuối kỳ',
      content: 'Các em chú ý deadline nộp bài là 20/4/2026. File nộp phải là PDF hoặc DOCX.',
      author: 'TS. Nguyễn Văn A',
      authorAvatar: 'A',
      category: 'Thông báo',
      createdAt: '2026-04-05 09:00',
      replies: 24,
      likes: 56,
      isPinned: true,
      views: 523,
      isTeacherPost: true,
    },
    {
      id: '2',
      title: 'Cách sử dụng React Hooks hiệu quả?',
      content: 'Mọi người có thể chia sẻ kinh nghiệm sử dụng React Hooks không?',
      author: 'Nguyễn Văn B',
      authorAvatar: 'B',
      category: 'Lập trình Web',
      createdAt: '2026-04-07 10:30',
      replies: 15,
      likes: 23,
      isPinned: false,
      views: 234,
      isTeacherPost: false,
    },
    {
      id: '3',
      title: 'Tài liệu tham khảo cho bài thi giữa kỳ',
      content: 'Thầy đã upload tài liệu ôn tập lên hệ thống. Các em tải về và học kỹ nhé.',
      author: 'TS. Nguyễn Văn A',
      authorAvatar: 'A',
      category: 'Tài liệu',
      createdAt: '2026-04-06 14:00',
      replies: 18,
      likes: 42,
      isPinned: true,
      views: 412,
      isTeacherPost: true,
    },
    {
      id: '4',
      title: 'Hỏi về bài tập tuần 5 - Cơ sở dữ liệu',
      content: 'Có ai làm được câu 3 chưa? Mình đang bị stuck ở phần JOIN.',
      author: 'Trần Thị C',
      authorAvatar: 'C',
      category: 'Câu hỏi',
      createdAt: '2026-04-07 14:20',
      replies: 8,
      likes: 12,
      isPinned: false,
      views: 156,
      isTeacherPost: false,
    },
  ];

  const replies = [
    {
      id: '1',
      threadId: '1',
      author: 'Trần Thị B',
      authorAvatar: 'B',
      content: 'Dạ em đã hiểu. Cảm ơn thầy ạ!',
      createdAt: '2026-04-05 10:30',
      likes: 3,
    },
    {
      id: '2',
      threadId: '1',
      author: 'Lê Văn C',
      authorAvatar: 'C',
      content: 'Thầy ơi, em có thể nộp file ZIP được không ạ?',
      createdAt: '2026-04-05 11:00',
      likes: 1,
    },
  ];

  const categories = ['Tất cả', 'Thông báo', 'Tài liệu', 'Câu hỏi', 'Thảo luận', 'Hướng dẫn'];
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const filteredDiscussions = discussions.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleCreateDiscussion = () => {
    if (!newDiscussion.title || !newDiscussion.content) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    toast.success('Đã tạo chủ đề thảo luận mới');
    setIsCreateDialogOpen(false);
    setNewDiscussion({ title: '', content: '', category: 'general', isPinned: false });
  };

  const handleReply = (threadId: string) => {
    if (!replyContent.trim()) {
      toast.error('Vui lòng nhập nội dung phản hồi');
      return;
    }

    toast.success('Đã gửi phản hồi');
    setReplyContent('');
  };

  const handleDeleteThread = (threadId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa chủ đề này?')) {
      toast.success('Đã xóa chủ đề');
    }
  };

  const handlePinThread = (threadId: string) => {
    toast.success('Đã ghim chủ đề');
  };

  const threadReplies = replies.filter(r => r.threadId === selectedThread);

  return (
    <Layout>
      <div className="max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
                Thảo luận
              </h1>
              <p className="text-gray-600 mt-1">Trao đổi với học sinh và quản lý thảo luận</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Tạo thông báo mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Tạo thông báo/thảo luận mới</DialogTitle>
                  <DialogDescription>
                    Tạo thông báo hoặc chủ đề thảo luận cho học sinh
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Danh mục</label>
                    <select
                      value={newDiscussion.category}
                      onChange={(e) => setNewDiscussion({ ...newDiscussion, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="announcement">Thông báo</option>
                      <option value="material">Tài liệu</option>
                      <option value="discussion">Thảo luận</option>
                      <option value="guide">Hướng dẫn</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="pinned"
                      checked={newDiscussion.isPinned}
                      onChange={(e) => setNewDiscussion({ ...newDiscussion, isPinned: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="pinned" className="text-sm font-medium">
                      Ghim chủ đề (hiển thị ưu tiên)
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tiêu đề</label>
                    <Input
                      placeholder="Nhập tiêu đề..."
                      value={newDiscussion.title}
                      onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nội dung</label>
                    <Textarea
                      placeholder="Mô tả chi tiết..."
                      value={newDiscussion.content}
                      onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                      rows={6}
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleCreateDiscussion}>Đăng</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng chủ đề</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{discussions.length}</p>
                </div>
                <MessageSquare className="w-10 h-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Phản hồi</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {discussions.reduce((sum, d) => sum + d.replies, 0)}
                  </p>
                </div>
                <MessageCircle className="w-10 h-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã ghim</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {discussions.filter(d => d.isPinned).length}
                  </p>
                </div>
                <Pin className="w-10 h-10 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lượt xem</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {discussions.reduce((sum, d) => sum + d.views, 0)}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm chủ đề..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className="whitespace-nowrap"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discussions List */}
        <div className="space-y-4">
          {filteredDiscussions.map((discussion) => (
            <Card key={discussion.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      discussion.isTeacherPost 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                        : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                    }`}>
                      <span className="text-white font-semibold text-lg">
                        {discussion.authorAvatar}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {discussion.isPinned && (
                            <Pin className="w-4 h-4 text-indigo-600" />
                          )}
                          {discussion.isTeacherPost && (
                            <Shield className="w-4 h-4 text-purple-600" />
                          )}
                          <h3 className="font-semibold text-lg text-gray-900">
                            {discussion.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {discussion.content}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="font-medium text-gray-700">{discussion.author}</span>
                          <span>•</span>
                          <Badge variant="outline">{discussion.category}</Badge>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{discussion.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons for teacher */}
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePinThread(discussion.id)}
                          title="Ghim chủ đề"
                        >
                          <Pin className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteThread(discussion.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Xóa chủ đề"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                      <button 
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                        onClick={() => setSelectedThread(discussion.id)}
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">{discussion.replies}</span>
                        <span className="text-sm">phản hồi</span>
                      </button>
                      <div className="flex items-center gap-2 text-gray-600">
                        <ThumbsUp className="w-5 h-5" />
                        <span className="font-medium">{discussion.likes}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-medium">{discussion.views}</span>
                        <span className="text-sm">lượt xem</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDiscussions.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Không tìm thấy chủ đề nào</p>
            </CardContent>
          </Card>
        )}

        {/* Thread Detail Dialog */}
        {selectedThread && (
          <Dialog open={!!selectedThread} onOpenChange={() => setSelectedThread(null)}>
            <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {discussions.find(d => d.id === selectedThread)?.title}
                </DialogTitle>
                <DialogDescription>
                  Bởi {discussions.find(d => d.id === selectedThread)?.author} • {discussions.find(d => d.id === selectedThread)?.createdAt}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Original Post */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800">
                    {discussions.find(d => d.id === selectedThread)?.content}
                  </p>
                </div>

                {/* Replies */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    Phản hồi ({threadReplies.length})
                  </h3>
                  {threadReplies.map((reply) => (
                    <div key={reply.id} className="flex gap-3 p-4 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold">
                          {reply.authorAvatar}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{reply.author}</span>
                            <span className="text-sm text-gray-500">{reply.createdAt}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-gray-700 mb-2">{reply.content}</p>
                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-pink-600">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{reply.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Phản hồi</h3>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Nhập phản hồi của bạn..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={4}
                    />
                    <div className="flex justify-end">
                      <Button onClick={() => handleReply(selectedThread)} className="gap-2">
                        <Send className="w-4 h-4" />
                        Gửi phản hồi
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}