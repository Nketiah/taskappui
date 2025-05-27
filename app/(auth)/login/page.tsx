'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../slices/authSlice';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null); // clear error as user types
  };



  
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    const res = await axios.post('https://localhost:7178/api/Account/login', form);

    const user = res.data?.user;
    const token = user?.token;

    if (user && token && user.isSuccess) {
      dispatch(loginSuccess({ user, token }));

      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      Cookies.set('authToken', token, { expires: oneYearFromNow });

      router.push('/dashboard');
    } else {
      setError('Invalid login response from server.');
    }
  } catch (err: any) {
    console.error(err);
    const messages = err.response?.data?.errorMessages || [err.response?.data?.message];
    setError(Array.isArray(messages) ? messages.join(', ') : 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Login</h2>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 text-red-700 text-sm p-4 rounded-md">
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-5 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full mb-6 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <button
            onClick={() => router.push('/register')}
            className="text-blue-600 hover:underline"
            type="button"
          >
            Register here
          </button>
        </p>

        <p className="mt-4 text-center text-sm text-gray-500">
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-blue-600 hover:underline"
            type="button"
          >
            ← Back to Home
          </button>
        </p>
      </form>
    </div>
  );
}
