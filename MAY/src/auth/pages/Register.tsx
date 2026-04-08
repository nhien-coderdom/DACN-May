import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';
import { useRegister } from '../hooks/useRegister';
import { useLogin } from '../hooks/useLogin';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const navigate = useNavigate();
  const { mutate: register, isPending: isRegistering } = useRegister();
  const { mutate: login, isPending: isLoggingIn } = useLogin();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName) newErrors.fullName = 'Vui lòng nhập họ và tên';
    if (!formData.email) newErrors.email = 'Vui lòng nhập email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.phone) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10 số, bắt đầu từ 0)';
    }
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (!/^(?=.*[A-Z])(?=.*\d).+$/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 số';
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
    setGlobalError('');
    if (validateForm()) {
      register(
        {
          email: formData.email,
          name: formData.fullName,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
        },
        {
          onSuccess: () => {
            // Đăng ký thành công, auto login
            login(
              {
                email: formData.email,
                password: formData.password,
              },
              {
                onSuccess: () => {
                  // Login thành công, reload page để AuthContext fetch user data
                  setTimeout(() => {
                    window.location.href = '/';
                  }, 500);
                },
                onError: (error: any) => {
                  // Login fail nhưng register ok, redirect sang login page
                  console.error('Auto login failed:', error);
                  setTimeout(() => {
                    navigate('/login');
                  }, 1500);
                },
              }
            );
          },
          onError: (error: any) => {
            console.error('Registration error:', error);
            let message = 'Đăng ký không thành công';
            if (error?.response?.data?.message) {
              message = error.response.data.message;
            } else if (error?.message) {
              message = error.message;
            }
            setGlobalError(message);
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-orange-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Form Card */}
        <div className="rounded-3xl bg-white shadow-lg border border-neutral-200 p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Đăng ký tài khoản</h2>

          {globalError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{globalError}</p>
            </div>
          )}

          <RegisterForm
            formData={formData}
            errors={errors}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            isLoading={isRegistering || isLoggingIn}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />

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
