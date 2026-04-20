import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX, FiPhone } from 'react-icons/fi';

interface RegisterFormProps {
  formData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    address: string;
  };
  errors: Record<string, string>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

export const RegisterForm = ({
  formData,
  errors,
  showPassword,
  showConfirmPassword,
  isLoading,
  onSubmit,
  onChange,
  onTogglePassword,
  onToggleConfirmPassword,
}: RegisterFormProps) => {
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
    2: 'bg-[#6c935b]',
    3: 'bg-yellow-400',
    4: 'bg-green-400',
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
            onChange={onChange}
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
            onChange={onChange}
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

      {/* Phone Field */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-2">
          Số điện thoại
        </label>
        <div className="relative">
          <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            placeholder="0123456789"
            maxLength={10}
            className={`w-full rounded-lg border ${
              errors.phone ? 'border-red-400' : 'border-neutral-300'
            } bg-neutral-50 pl-11 pr-4 py-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400`}
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <FiX size={14} /> {errors.phone}
          </p>
        )}
      </div>

      {/* Address Field */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-2">
          Địa chỉ (Tùy chọn)
        </label>
        <div className="relative">
          <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={onChange}
            placeholder="123 Đường Lê Lợi, Quận 1, TP HCM"
            className={`w-full rounded-lg border ${
              errors.address ? 'border-red-400' : 'border-neutral-300'
            } bg-neutral-50 pl-11 pr-4 py-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400`}
          />
        </div>
        {errors.address && (
          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <FiX size={14} /> {errors.address}
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
            onChange={onChange}
            placeholder="••••••••"
            className={`w-full rounded-lg border ${
              errors.password ? 'border-red-400' : 'border-neutral-300'
            } bg-neutral-50 pl-11 pr-11 py-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400`}
          />
          <button
            type="button"
            onClick={onTogglePassword}
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
            onChange={onChange}
            placeholder="••••••••"
            className={`w-full rounded-lg border ${
              errors.confirmPassword ? 'border-red-400' : 'border-neutral-300'
            } bg-neutral-50 pl-11 pr-11 py-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400`}
          />
          <button
            type="button"
            onClick={onToggleConfirmPassword}
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
        disabled={isLoading}
        className="w-full rounded-lg bg-[#6c935b] py-3 text-sm font-bold text-white transition hover:bg-orange-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
      </button>
    </form>
  );
};
