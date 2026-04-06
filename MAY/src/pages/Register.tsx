import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { register } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName) newErrors.fullName = 'Vui lòng nhập họ và tên';
    if (!formData.email) newErrors.email = 'Vui lòng nhập email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      register(formData.email, formData.fullName, formData.password);
      navigate('/');
    }
  };

  const passwordStrength = () => {
    if (!formData.password) return 0;
    let strength = 0;
    if (formData.password.length >= 6) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    return strength;
  };

  const strength = passwordStrength();
  const strengthColor = {
    0: 'bg-neutral-300',
    1: 'bg-red-400',
    2: 'bg-orange-400',
    3: 'bg-yellow-400',
    4: 'bg-green-400',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-orange-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Form Card */}
        <div className="rounded-3xl bg-white shadow-lg border border-neutral-200 p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Đăng ký tài khoản</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Họ và tên
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className={`w-full rounded-lg border ${
                    errors.fullName ? 'border-red-400' : 'border-neutral-300'
                  } bg-neutral-50 pl-11 pr-4 py-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <FiX size={14} /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={`w-full rounded-lg border ${
                    errors.email ? 'border-red-400' : 'border-neutral-300'
                  } bg-neutral-50 pl-11 pr-4 py-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <FiX size={14} /> {errors.email}
                </p>
              )}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full rounded-lg border ${
                    errors.password ? 'border-red-400' : 'border-neutral-300'
                  } bg-neutral-50 pl-11 pr-11 py-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < strength ? strengthColor[strength as keyof typeof strengthColor] : 'bg-neutral-200'
                        } transition`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500">
                    {strength === 0 && 'Mật khẩu quá yếu'}
                    {strength === 1 && 'Mật khẩu yếu'}
                    {strength === 2 && 'Mật khẩu trung bình'}
                    {strength === 3 && 'Mật khẩu tốt'}
                    {strength === 4 && 'Mật khẩu rất mạnh'}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <FiX size={14} /> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Nhập lại mật khẩu
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full rounded-lg border ${
                    errors.confirmPassword ? 'border-red-400' : 'border-neutral-300'
                  } bg-neutral-50 pl-11 pr-11 py-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {formData.password && formData.confirmPassword === formData.password && (
                <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
                  <FiCheck size={14} /> Mật khẩu khớp
                </p>
              )}
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <FiX size={14} /> {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                required
                className="h-4 w-4 mt-1 rounded cursor-pointer accent-orange-400"
              />
              <span className="text-xs text-neutral-600">
                Tôi đồng ý với <a href="#" className="text-orange-400 hover:underline">điều khoản dịch vụ</a> và <a href="#" className="text-orange-400 hover:underline">chính sách bảo mật</a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-orange-400 py-3 text-sm font-bold text-white transition hover:bg-orange-500 active:scale-95"
            >
              Tạo tài khoản
            </button>
          </form>
          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-neutral-600">
            Đã có tài khoản?{' '}
            <Link
              to="/login"
              className="font-semibold text-orange-400 hover:text-orange-500 transition"
            >
              Đăng nhập
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

export default Register;