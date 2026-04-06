import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-orange-50 px-4">
      <div className="w-full max-w-md">
        {/* Form Card */}
        <div className="rounded-3xl bg-white shadow-lg border border-neutral-200 p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Đăng nhập</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full rounded-lg border border-neutral-300 bg-neutral-50 pl-11 pr-4 py-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-neutral-300 bg-neutral-50 pl-11 pr-11 py-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded cursor-pointer accent-orange-400"
                />
                <span className="text-neutral-600">Nhớ tôi</span>
              </label>
              <a href="#" className="text-orange-400 hover:text-orange-500 transition font-medium">
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-orange-400 py-3 text-sm font-bold text-white transition hover:bg-orange-500 active:scale-95"
            >
              Đăng nhập
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-neutral-600">
            Chưa có tài khoản?{' '}
            <Link
              to="/register"
              className="font-semibold text-orange-400 hover:text-orange-500 transition"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Back Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-neutral-600 hover:text-neutral-900 transition font-medium"
          >
            ← Quay về
            <span className="text-xl">☕</span>
            M<span className="text-orange-400">A</span>Y
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;