import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { login } from "../services/auth"; 
import { Button } from '../../../shared/components/ui/button';
import { Input } from "../../../shared/components/ui/input";
import { Label } from "../../../shared/components/ui/label";
import {
  GraduationCap,
  AlertCircle,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Mail,
  Lock,
  ArrowRight,
  Shield,
} from "lucide-react";
import loginBg from '../../../assets/bg-login.jpg';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = login(email, password);

      if (user) {
        if (user.role === "student") {
          navigate("/student/dashboard");
        } else if (user.role === "teacher") {
          navigate("/teacher/dashboard");
        } else if (user.role === "admin") {
          navigate("/admin/dashboard");
        }
      } else {
        setError("Email hoặc mật khẩu không đúng");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT SIDE - LOGIN FORM (Style từ File 2) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#eef4f8]">
        <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#73A5CA] rounded-2xl mb-4 shadow-sm">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Chào mừng trở lại
            </h1>
            <p className="text-gray-500 text-sm">
              Đăng nhập vào hệ thống quản lý học tập
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-gray-600 ml-1">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-gray-200 focus:ring-[#73A5CA] focus:border-[#73A5CA]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-gray-600 ml-1">
                Mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-gray-200 focus:ring-[#73A5CA] focus:border-[#73A5CA]"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#73A5CA] hover:bg-[#5f8cae] text-white font-semibold rounded-xl shadow-md transition-all"
            >
              {loading ? (
                "Đang đăng nhập..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Đăng nhập
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Demo Accounts (Style từ File 2) */}
          <div className="mt-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Tài khoản demo
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: "Học sinh", email: "student@lms.com" },
                { label: "Giáo viên", email: "teacher@lms.com" },
                { label: "Quản trị viên", email: "admin@lms.com" },
              ].map((acc) => (
                <div
                  key={acc.email}
                  className="p-3 bg-white rounded-xl border border-gray-100 hover:border-[#73A5CA] transition cursor-pointer flex justify-between items-center group shadow-sm"
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword("password");
                  }}
                >
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {acc.label}
                    </p>
                    <p className="text-xs text-gray-500">{acc.email}</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#73A5CA]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - HERO SECTION (Giữ Layout File 1 nhưng dùng tone màu File 2) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center mr-0 ml-32">
        <img
          src={loginBg}
          className="h-auto w-full object-contain mix-blend-multiply"
        />
      </div>
    </div>
  );
}
