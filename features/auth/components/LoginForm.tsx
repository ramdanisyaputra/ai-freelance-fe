'use client'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginForm() {
    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [errors, setErrors] = useState<any>([])
    const [serverError, setServerError] = useState<string | null>(null)
    // const [status, setStatus] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
        setErrors([])
        setServerError(null)
    }

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)
        setServerError(null)
        setErrors([])

        try {
            await login({
                email: formData.email,
                password: formData.password,
                remember: formData.remember,
                setErrors,
            })
        } catch (error: any) {
            const serverMessage = error.response?.data?.message;
            if (serverMessage) {
                setServerError(serverMessage);
            } else {
                setServerError('Terjadi kesalahan pada server. Silakan coba lagi.');
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-100 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-[#FE5B00] rounded-full opacity-5 blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FE5B00] rounded-full opacity-5 blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center justify-center space-x-2 mb-8">
                    <div className="w-10 h-10 bg-[#FE5B00] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">LA</span>
                    </div>
                    <span className="font-bold text-2xl text-gray-900">
                        Lepas AI
                    </span>
                </Link>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Selamat Datang!
                        </h1>
                        <p className="text-gray-600">
                            Masuk ke akun Lepas AI kamu
                        </p>
                    </div>

                    {serverError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-red-600">{serverError}</p>
                        </div>
                    )}

                    <form onSubmit={submitForm} noValidate>
                        {/* Email Field */}
                        <div className="mb-6">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-400 ${errors.email
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:border-[#FE5B00]'
                                    } focus:outline-none focus:ring-2 ${errors.email
                                        ? 'focus:ring-red-200'
                                        : 'focus:ring-orange-200'
                                    } transition-colors`}
                                placeholder="nama@email.com"
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="mb-6">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-400 ${errors.password
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-[#FE5B00]'
                                        } focus:outline-none focus:ring-2 ${errors.password
                                            ? 'focus:ring-red-200'
                                            : 'focus:ring-orange-200'
                                        } transition-colors pr-12`}
                                    placeholder="Masukkan password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                                    {showPassword ? (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#FE5B00] border-gray-300 rounded focus:ring-[#FE5B00] focus:ring-2"
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-2 text-sm text-gray-700">
                                    Ingat saya
                                </label>
                            </div>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-[#FE5B00] hover:text-[#E54F00] font-medium">
                                Lupa password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#FE5B00] text-white py-3 rounded-lg font-semibold hover:bg-[#E54F00] transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                            {isLoading ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>



                    {/* Register Link */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Belum punya akun?{' '}
                        <Link
                            href="/register"
                            className="text-[#FE5B00] hover:text-[#E54F00] font-semibold">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link
                        href="/"
                        className="text-sm text-gray-600 hover:text-[#FE5B00] transition-colors">
                        ← Kembali ke beranda
                    </Link>
                </div>
            </div>
        </div>
    )
}
