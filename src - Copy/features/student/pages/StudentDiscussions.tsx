import React, { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar } from '@/shared/components/ui/avatar';
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
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { getCurrentUser } from '@/features/auth/services/auth';

export default function StudentDiscussions() {
  const user = getCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    category: 'general',
  });
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Mock data
  const discussions = [
    {
      id: '1',
      title: 'Cách sử dụng React Hooks hiệu quả?',
      content: 'Mọi người có thể chia sẻ kinh nghiệm sử dụng React Hooks không?',
      author: 'Nguyễn Văn A',
      authorAvatar: 'A',
      category: 'Lập trình Web',
      createdAt: '2026-04-07 10:30',
      replies: 15,
      likes: 23,
      isPinned: true,
      views: 234,
    },
    {
      id: '2',
      title: 'Hỏi về bài tập tuần 5 - Cơ sở dữ liệu',
      content: 'Có ai làm được câu 3 chưa? Mình đang bị stuck ở phần JOIN.',
      author: 'Trần Thị B',
      authorAvatar: 'B',
      category: 'Cơ sở dữ liệu',
      createdAt: '2026-04-07 14:20',
      replies: 8,
      likes: 12,
      isPinned: false,
      views: 156,
    },
    {
      id: '3',
      title: 'Chia sẻ tài liệu về Machine Learning',
      content: 'Mình có một số tài liệu hay về ML, muốn chia sẻ với mọi người.',
      author: 'Lê Văn C',
      authorAvatar: 'C',
      category: 'Trí tuệ nhân tạo',
      createdAt: '2026-04-07 16:45',
      replies: 25,
      likes: 45,
      isPinned: false,
      views: 423,
    },
    {
      id: '4',
      title: 'Tìm nhóm làm đồ án cuối kỳ',
      content: 'Team mình đang thiếu 1 người có kinh nghiệm về frontend. Ai quan tâm inbox nhé!',
      author: 'Phạm Thị D',
      authorAvatar: 'D',
      category: 'Dự án nhóm',
      createdAt: '2026-04-06 09:15',
      replies: 5,
      likes: 8,
      isPinned: false,
      views: 89,
    },
    {
      id: '5',
      title: 'Câu hỏi về thuật toán Dijkstra',
      content: 'Các bạn giải thích giúp mình độ phức tạp của thuật toán này với.',
      author: 'Hoàng Văn E',
      authorAvatar: 'E',
      category: 'Thuật toán',
      createdAt: '2026-04-06 11:30',
      replies: 12,
      likes: 18,
      isPinned: false,
      views: 201,
    },
  ];

  const replies = [
    {
      id: '1',
      threadId: '1',
      author: 'Trần Thị B',
      authorAvatar: 'B',
      content: 'Mình thấy useEffect và useState là 2 hooks quan trọng nhất. Nên tìm hiểu kỹ về dependency array.',
      createdAt: '2026-04-07 10:45',
      likes: 5,
    },
    {
      id: '2',
      threadId: '1',
      author: 'Lê Văn C',
      authorAvatar: 'C',
      content: 'Thêm cả useMemo và useCallback để tối ưu performance nữa nhé!',
      createdAt: '2026-04-07 11:00',
      likes: 8,
    },
  ];

  const categories = ['Tất cả', 'Lập trình Web', 'Cơ sở dữ liệu', 'Trí tuệ nhân tạo', 'Thuật toán', 'Dự án nhóm', 'Khác'];
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
    setNewDiscussion({ title: '', content: '', category: 'general' });
  };

  const handleReply = (threadId: string) => {
    if (!replyContent.trim()) {
      toast.error('Vui lòng nhập nội dung phản hồi');
      return;
    }

    toast.success('Đã gửi phản hồi');
    setReplyContent('');
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
              <p className="text-gray-600 mt-1">Trao đổi, học hỏi và chia sẻ kiến thức</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Tạo chủ đề mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Tạo chủ đề thảo luận mới</DialogTitle>
                  <DialogDescription>
                    Đặt câu hỏi hoặc chia sẻ kiến thức với cộng đồng
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
                      <option value="general">Chung</option>
                      <option value="web">Lập trình Web</option>
                      <option value="database">Cơ sở dữ liệu</option>
                      <option value="ai">Trí tuệ nhân tạo</option>
                      <option value="algorithm">Thuật toán</option>
                      <option value="project">Dự án nhóm</option>
                    </select>
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
            <Card key={discussion.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {discussion.authorAvatar}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {discussion.isPinned && (
                            <Pin className="w-4 h-4 text-indigo-600" />
                          )}
                          <h3 className="font-semibold text-lg text-gray-900 hover:text-indigo-600 transition-colors">
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
                      <button className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors">
                        <ThumbsUp className="w-5 h-5" />
                        <span className="font-medium">{discussion.likes}</span>
                      </button>
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
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{reply.author}</span>
                          <span className="text-sm text-gray-500">{reply.createdAt}</span>
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
                  <h3 className="font-semibold text-gray-900 mb-3">Phản hồi của bạn</h3>
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