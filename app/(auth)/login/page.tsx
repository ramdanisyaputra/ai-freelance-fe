'use client'

import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import Link from 'next/link'

export default function Login() {
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
    }

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            await login({
                email: formData.email,
                password: formData.password,
                remember: formData.remember,
                setErrors,
            })
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

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">
                                Atau lanjutkan dengan
                            </span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M21.35 11.1h-9.17v2.98h5.63c-.54 2.1-2.4 3.66-4.78 3.66-2.94 0-5.33-2.4-5.33-5.34s2.39-5.34 5.33-5.34c1.38 0 2.63.52 3.59 1.46l2.39-2.38C17.54 4.68 15.29 3.5 12.18 3.5 7.63 3.5 3.96 7.17 3.96 11.72s3.67 8.22 8.22 8.22c4.81 0 8.58-3.53 8.58-8.58 0-.46-.04-.89-.11-1.26z"
                                />
                            </svg>
                            <span className="ml-2 text-sm font-medium text-gray-700">
                                Google
                            </span>
                        </button>
                        <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    fillRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="ml-2 text-sm font-medium text-gray-700">
                                GitHub
                            </span>
                        </button>
                    </div>

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
