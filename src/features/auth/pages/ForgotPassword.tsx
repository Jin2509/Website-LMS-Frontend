import { useState, FormEvent } from 'react';
import { Link } from 'react-router';
import { resetPassword } from '../services/auth';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { GraduationCap, AlertCircle, CheckCircle, Mail, ArrowLeft, Send } from 'lucide-react';
import loginBg from 'figma:asset/6f97e68d1d8a64927907b1518734c1796c839f5b.png';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = resetPassword(email);
      
      if (result.success) {
        setSuccess('Đã gửi email hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.');
        setEmail('');
      } else {
        setError(result.message || 'Không tìm thấy email trong hệ thống.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Reset Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Quên mật khẩu?
            </h1>
            <p className="text-gray-600">
              Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
            </p>
          </div>

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                'Đang gửi...'
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Gửi yêu cầu
                  <Send className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-3">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại trang đăng nhập
            </Link>
            
            <div className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link 
                to="/register" 
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                Đăng ký ngay
              </Link>
            </div>
          </div>

          {/* Info Note */}
          <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              Hướng dẫn
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>Nhập email bạn đã đăng ký tài khoản</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>Kiểm tra hộp thư email (bao gồm cả thư mục spam)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>Làm theo hướng dẫn trong email để đặt lại mật khẩu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>Liên kết đặt lại mật khẩu có hiệu lực trong 24 giờ</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={loginBg} 
            alt="Students learning" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-pink-600/90"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Đừng lo lắng!<br />
            Chúng tôi sẽ giúp bạn
          </h2>
          <p className="text-xl mb-12 text-white/90 max-w-lg">
            Quên mật khẩu là chuyện bình thường. Chúng tôi sẽ giúp bạn lấy lại quyền truy cập một cách nhanh chóng và an toàn.
          </p>

          {/* Security Info */}
          <div className="space-y-4">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <h3 className="text-2xl font-bold mb-4">Bảo mật & An toàn</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" />
                  <p>Mã xác thực được mã hóa và bảo mật cao</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" />
                  <p>Chỉ bạn mới có quyền truy cập email của mình</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" />
                  <p>Liên kết đặt lại có thời hạn sử dụng</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" />
                  <p>Thông báo ngay khi có thay đổi mật khẩu</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <p className="text-sm text-white/90">
                <strong>Cần hỗ trợ?</strong> Liên hệ đội ngũ hỗ trợ của chúng tôi qua email: 
                <span className="block mt-1 text-white font-semibold">support@lms.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
