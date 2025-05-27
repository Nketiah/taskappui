'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAppDispatch } from '../../store';
import { loginSuccess } from '../../slices/authSlice';
import Cookies from "js-cookie";

interface RegisterForm {
    fullName: string;
    email: string;
    password: string;
}

export default function RegisterPage() {
    const [form, setForm] = useState<RegisterForm>({ fullName: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [apiErrors, setApiErrors] = useState<string[]>([]);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!form.email.trim()) newErrors.email = 'Email is required';
        if (!form.password.trim()) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setApiErrors([]); // Clear previous errors
        try {
            const res = await axios.post('https://localhost:7178/api/Account/register', form, {withCredentials: true});
              if (res.data?.isSuccess && res.data?.result?.token) {
            dispatch(
              loginSuccess({
                user: {
                fullName: res.data.result.fullName,
                email: res.data.result.email,
                userId: res.data.result.userId
                },
                token: res.data.result.token
              })
           )
           const token = res.data.result.token
           const oneYearFromNow = new Date();
           oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
           Cookies.set("authToken", token, { expires: oneYearFromNow });
            router.push('/dashboard'); // Redirect to dashboard
          } else {
            // If not successful, show backend errors if any
            setApiErrors(res.data?.errorMessages || ['Registration failed.']);
           }
            // router.push('/dashboard');
        } catch (err: any) {
            console.log("res",err)
            const apiErrorMessages = err.response?.data?.errorMessages;
            if (Array.isArray(apiErrorMessages)) {
                setApiErrors(apiErrorMessages);
            } else {
                setApiErrors(['Registration failed']);
            }
        } finally {
            setLoading(false);
        }
    };



    const isFormValid = form.fullName.trim() && form.email.trim() && form.password.trim();

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md"
                noValidate
            >
                <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Create an Account</h2>

                {apiErrors.length > 0 && (
                    <div className="mb-6 bg-red-50 border border-red-300 text-red-700 text-sm p-4 rounded-md">
                        <ul className="list-disc list-inside space-y-1">
                            {apiErrors.map((msg, idx) => (
                                <li key={idx}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mb-5">
                    <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className={`w-full px-5 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        required
                    />
                    {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div className="mb-5">
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className={`w-full px-5 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        required
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="mb-6">
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className={`w-full px-5 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        required
                    />
                    {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed"
                    disabled={!isFormValid || loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                        onClick={() => router.push('/login')}
                        className="text-blue-600 hover:underline"
                        type="button"
                    >
                        Login
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
