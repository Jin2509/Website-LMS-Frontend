import { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { getCurrentUser, logout } from '@/features/auth/services/auth';
import { Button } from '../ui/button';
import {
  GraduationCap,
  Home,
  BookOpen,
  FileText,
  LogOut,
  Users,
  BarChart,
  History,
  User,
  ChevronDown,
  Menu,
  X,
  Settings,
  TrendingUp,
  Shield,
  School,
  Calendar,
  Award,
  MessageSquare,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const isStudent = user.role === 'student';
  const isAdmin = user.role === 'admin';
  const baseRoute = isStudent ? '/student' : isAdmin ? '/admin' : '/teacher';

  const navigationItems = isStudent
    ? [
        { icon: Home, label: 'Trang chủ', path: `${baseRoute}/dashboard` },
        { icon: School, label: 'Lớp học', path: `${baseRoute}/classes` },
        { icon: Calendar, label: 'Thời khóa biểu', path: `${baseRoute}/schedule` },
        { icon: Award, label: 'Điểm số & Lịch sử', path: `${baseRoute}/grades` },
        { icon: MessageSquare, label: 'Thảo luận', path: `${baseRoute}/discussions` },
        { icon: Settings, label: 'Cài đặt', path: `${baseRoute}/settings` },
      ]
    : isAdmin
    ? [
        { icon: Home, label: 'Tổng quan', path: `${baseRoute}/dashboard` },
        { icon: Users, label: 'Người dùng', path: `${baseRoute}/users` },
        { icon: School, label: 'Lớp học', path: `${baseRoute}/classes` },
        { icon: BookOpen, label: 'Khóa học', path: `${baseRoute}/courses` },
        { icon: FileText, label: 'Bài tập', path: `${baseRoute}/assignments` },
        { icon: MessageSquare, label: 'Thảo luận', path: `${baseRoute}/discussions` },
        { icon: TrendingUp, label: 'Báo cáo', path: `${baseRoute}/reports` },
        { icon: Settings, label: 'Cài đặt', path: `${baseRoute}/settings` },
      ]
    : [
        { icon: Home, label: 'Trang chủ', path: `${baseRoute}/dashboard` },
        { icon: School, label: 'Lớp học', path: `${baseRoute}/classes` },
        { icon: BookOpen, label: 'Khóa học', path: `${baseRoute}/courses` },
        { icon: Users, label: 'Học sinh', path: `${baseRoute}/students` },
        { icon: FileText, label: 'Bài tập', path: `${baseRoute}/assignments` },
        { icon: MessageSquare, label: 'Thảo luận', path: `${baseRoute}/discussions` },
        { icon: History, label: 'Lịch sử giảng dạy', path: `${baseRoute}/history` },
        { icon: Settings, label: 'Cài đặt', path: `${baseRoute}/settings` },
      ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}
        style={{ backgroundColor: 'var(--sidebar)', borderRight: '1px solid var(--sidebar-border)' }}
      >
        <div className="p-6">
          <Link to={`${baseRoute}/dashboard`} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && <span className="text-xl font-bold" style={{ color: 'var(--sidebar-foreground)' }}>EduLearn</span>}
          </Link>
        </div>

        {/* Toggle Button */}
        <div className="px-4 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full justify-center"
            style={{ 
              color: 'var(--sidebar-foreground)',
              opacity: 0.7
            }}
          >
            {sidebarCollapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </Button>
        </div>

        <nav className="px-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'shadow-md'
                    : 'hover:bg-opacity-50'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                style={isActive ? {
                  backgroundColor: 'var(--sidebar-primary)',
                  color: 'var(--sidebar-primary-foreground)',
                } : {
                  color: 'var(--sidebar-foreground)',
                  opacity: 0.8,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--sidebar-accent)';
                    e.currentTarget.style.opacity = '1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.opacity = '0.8';
                  }
                }}
                title={sidebarCollapsed ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{ borderTop: '1px solid var(--sidebar-border)' }}
        >
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all duration-200 ${sidebarCollapsed ? 'justify-center' : ''}`}
              style={{ color: 'var(--sidebar-foreground)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--sidebar-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--sidebar-foreground)' }}>{user.name}</p>
                    <p className="text-xs capitalize" style={{ color: 'var(--sidebar-foreground)', opacity: 0.6 }}>
                      {isStudent ? 'Học sinh' : isAdmin ? 'Quản trị viên' : 'Giáo viên'}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} style={{ color: 'var(--sidebar-foreground)', opacity: 0.5 }} />
                </>
              )}
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className={`absolute bottom-full mb-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden ${sidebarCollapsed ? 'left-0 w-48' : 'left-4 right-4'}`}>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700 font-medium">Thông tin cá nhân</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`p-8 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {children}
      </main>
    </div>
  );
}

export default Layout;