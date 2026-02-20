'use client'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { useState } from 'react'
import Link from 'next/link'

export default function RegisterForm() {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
        stack: '',
        min_price: '',
        rate_type: 'fixed',
        role: '',
        currency: 'IDR'
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [errors, setErrors] = useState<any>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        // Helper to check checked property safely
        const checked = (e.target as HTMLInputElement).checked

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
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
                role: formData.role,
                // Convert stack string to array
                stack: formData.stack ? formData.stack.split(',').map(s => s.trim()).filter(s => s !== '') : [],
                rate_type: formData.rate_type,
                min_price: formData.min_price || '0',
                currency: formData.currency,
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

                {/* Register Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Buat Akun Baru
                        </h1>
                        <p className="text-gray-600">
                            Mulai buat proposal profesional dalam 3 menit
                        </p>
                    </div>

                    <form onSubmit={submitForm} noValidate>
                        {/* Name Field */}
                        <div className="mb-6">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-400 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#FE5B00]'
                                    } focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-red-200' : 'focus:ring-orange-200'
                                    } transition-colors`}
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/* Email Field */}
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-400 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#FE5B00]'
                                    } focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-200' : 'focus:ring-orange-200'
                                    } transition-colors`}
                                placeholder="nama@email.com"
                            />
                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        {/* Role Field */}
                        <div className="mb-6">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                                Peran Utama (Role)
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border text-gray-900 bg-white ${errors.role ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#FE5B00]'
                                    } focus:outline-none focus:ring-2 ${errors.role ? 'focus:ring-red-200' : 'focus:ring-orange-200'
                                    } transition-colors appearance-none`}
                            >
                                <option value="" disabled>Pilih peran Anda</option>
                                <option value="Fullstack Developer">Fullstack Developer</option>
                                <option value="Frontend Developer">Frontend Developer</option>
                                <option value="Backend Developer">Backend Developer</option>
                                <option value="Mobile Developer">Mobile Developer</option>
                                <option value="UI/UX Designer">UI/UX Designer</option>
                                <option value="Other">Lainnya</option>
                            </select>
                            {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role}</p>}
                        </div>

                        {/* Tech Stack Field */}
                        <div className="mb-6">
                            <label htmlFor="stack" className="block text-sm font-medium text-gray-700 mb-2">
                                Tech Stack (pisahkan dengan koma)
                            </label>
                            <input
                                type="text"
                                id="stack"
                                name="stack"
                                value={formData.stack}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-400 ${errors.stack ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#FE5B00]'
                                    } focus:outline-none focus:ring-2 ${errors.stack ? 'focus:ring-red-200' : 'focus:ring-orange-200'
                                    } transition-colors`}
                                placeholder="React, Laravel, Tailwind CSS, Docker"
                            />
                            {errors.stack && <p className="mt-2 text-sm text-red-600">{errors.stack}</p>}
                        </div>

                        {/* Rate Type & Min Price */}
                        {/* Rate Type */}
                        <div className="mb-6">
                            <label htmlFor="rate_type" className="block text-sm font-medium text-gray-700 mb-2">
                                Tipe Harga
                            </label>
                            <select
                                id="rate_type"
                                name="rate_type"
                                value={formData.rate_type}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FE5B00] transition-colors appearance-none"
                            >
                                <option value="fixed">Fixed Price</option>
                                <option value="hourly">Hourly Rate</option>
                            </select>
                        </div>

                        {/* Min Price */}
                        <div className="mb-6">
                            <label htmlFor="min_price" className="block text-sm font-medium text-gray-700 mb-2">
                                Harga Minimum
                            </label>
                            <div className="flex">
                                <div className="relative">
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="w-24 px-3 py-3 rounded-l-lg border border-r-0 border-gray-300 text-gray-900 bg-gray-50 focus:outline-none focus:ring-0 focus:border-gray-300 appearance-none pr-8"
                                    >
                                        <option value="IDR">IDR</option>
                                        <option value="USD">USD</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    id="min_price"
                                    name="min_price"
                                    value={formData.min_price}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-r-lg border text-gray-900 placeholder-gray-400 ${errors.min_price ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#FE5B00]'
                                        } focus:outline-none focus:ring-2 ${errors.min_price ? 'focus:ring-red-200' : 'focus:ring-orange-200'
                                        } transition-colors`}
                                    placeholder="1000000"
                                />
                            </div>
                            {errors.min_price && <p className="mt-2 text-sm text-red-600">{errors.min_price}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-400 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#FE5B00]'
                                        } focus:outline-none focus:ring-2 ${errors.password ? 'focus:ring-red-200' : 'focus:ring-orange-200'
                                        } transition-colors pr-12`}
                                    placeholder="Minimal 8 karakter"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Konfirmasi Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FE5B00] transition-colors pr-12"
                                    placeholder="Ketik ulang password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showConfirmPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        {/* Terms Agreement */}
                        <div className="mb-6">
                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#FE5B00] border-gray-300 rounded focus:ring-[#FE5B00] focus:ring-2 mt-1"
                                />
                                <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
                                    Saya setuju dengan{' '}
                                    <Link href="/terms" className="text-[#FE5B00] hover:text-[#E54F00] font-medium">Syarat & Ketentuan</Link>
                                    {' '}dan{' '}
                                    <Link href="/privacy" className="text-[#FE5B00] hover:text-[#E54F00] font-medium">Kebijakan Privasi</Link>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#FE5B00] text-white py-3 rounded-lg font-semibold hover:bg-[#E54F00] transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
                        </button>
                    </form>



                    {/* Login Link */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <Link
                            href="/login"
                            className="text-[#FE5B00] hover:text-[#E54F00] font-semibold">
                            Masuk di sini
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
