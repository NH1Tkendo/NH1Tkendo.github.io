import { Eye, EyeOff } from 'lucide-react';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(form.email)) {
      toast.error('Email không hợp lệ. Vui lòng nhập lại!');
      return;
    }

    try {
      const res = await api.post('/auth/login', form);
      login(res.data);
      toast.success('Đăng nhập thành công!');
      if (res.data.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại!');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#95B1CE] to-[#E6F2FF] p-5">
      <div className="w-full max-w-[480px] rounded-xl bg-white p-10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] sm:p-6">
        <h1 className="mb-8 text-center text-3xl font-semibold text-[#333] sm:text-2xl">
          Đăng nhập
        </h1>
        <form onSubmit={handleSubmit} className="mb-6 grid gap-4">
          <input
            className="box-border w-full rounded-lg border-2 border-[#E6F2FF] p-3 px-4 text-base transition-colors duration-300 outline-none placeholder:text-[#999] focus:border-[#4AA4FF]"
            onChange={handleChange}
            name="email"
            placeholder="Email"
          />
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="box-border w-full rounded-lg border-2 border-[#E6F2FF] p-3 px-4 text-base transition-colors duration-300 outline-none placeholder:text-[#999] focus:border-[#4AA4FF]"
              onChange={handleChange}
              placeholder="Mật khẩu"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 cursor-pointer text-gray-500 transition-all duration-300 ease-in-out hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-[#4AA4FF] px-6 py-3 text-base font-semibold text-white transition-colors duration-300 hover:bg-[#3590E6] active:translate-y-[1px]"
          >
            Đăng nhập
          </button>
        </form>
        <p className="text-center text-sm text-[#666]">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-medium text-[#4AA4FF] no-underline hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
