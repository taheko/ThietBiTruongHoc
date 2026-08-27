import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Package,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ClipboardList,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setError(error.message === 'Invalid login credentials' ? 'Sai email hoặc mật khẩu' : error.message);
        return;
      }

      if (data?.session) {
        onLoginSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi kết nối máy chủ xác thực');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Mật khẩu phải có tối thiểu 6 ký tự');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Theo đúng đặc tả UC001 và TC_01:
      setSuccess('Tài khoản đã tạo. Vui lòng đăng nhập.');
      setTab('login');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi đăng ký tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAccount = (em: string, pw: string) => {
    setEmail(em);
    setPassword(pw);
    setTab('login');
    setError('');
    setSuccess('');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-900 p-4 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[100px]" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/95 backdrop-blur-xl shadow-2xl transition-all">
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-8 py-8 text-center text-white relative">
          <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 shadow-lg shadow-primary-500/30">
            <Package className="h-7 w-7 text-white" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-xs">
              <Sparkles className="h-2.5 w-2.5" />
            </span>
          </div>

          <h1 className="text-xl font-extrabold tracking-tight">
            Quản Lý Tài Sản Trường Học
          </h1>
          <p className="mt-1 text-xs font-medium text-slate-300">
            Hệ thống quản lý thiết bị thông minh tích hợp AI
          </p>
        </div>

        {/* Segmented Control Tabs */}
        <div className="p-3 bg-slate-100/70 border-b border-slate-200/60">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-200/60 p-1">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all duration-200 ${
                tab === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="h-3.5 w-3.5" />
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all duration-200 ${
                tab === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Đăng ký
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-7">
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="label">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                  className="input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm shadow-md"
              >
                {loading ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="label">
                  Email đăng ký <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gv01@truong.edu.vn"
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="label">
                  Mật khẩu (tối thiểu 6 ký tự) <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  minLength={6}
                  className="input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm shadow-md"
              >
                {loading ? 'Đang đăng ký tài khoản...' : 'Tạo tài khoản'}
              </button>
            </form>
          )}

          {/* Quick Login helper for test/admin users */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Tài khoản mẫu dùng thử:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => fillQuickAccount('admin@example.com', '123456')}
                className="group flex items-center justify-between rounded-xl bg-slate-50 hover:bg-primary-50/70 p-2.5 border border-slate-200/80 transition-all text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="rounded-lg bg-emerald-100 p-1.5 text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800">Quản trị viên</p>
                    <p className="text-[11px] text-slate-500 truncate">admin@example.com</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-primary-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  123456
                </span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickAccount('kiemke@example.com', '123456')}
                  className="flex items-center justify-between rounded-xl bg-slate-50 hover:bg-slate-100 p-2 border border-slate-200 text-left transition"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ClipboardList className="h-3 w-3 text-slate-500" />
                    <span className="text-[11px] font-semibold text-slate-700 truncate">Kiểm kê viên</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">123456</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillQuickAccount('giaovien@example.com', '123456')}
                  className="flex items-center justify-between rounded-xl bg-slate-50 hover:bg-slate-100 p-2 border border-slate-200 text-left transition"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <GraduationCap className="h-3 w-3 text-slate-500" />
                    <span className="text-[11px] font-semibold text-slate-700 truncate">Giáo viên</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">123456</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}