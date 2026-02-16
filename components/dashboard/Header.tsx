'use client'

import React, { useState } from 'react'
import { useAuth } from '@/hooks/auth'
import Link from 'next/link'

interface HeaderProps {
    onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { user, logout } = useAuth()
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Left side (Mobile Menu Button could go here) */}
            <div className="flex items-center md:hidden">
                <button
                    onClick={onMenuClick}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Right side */}
            <div className="flex items-center ml-auto space-x-4">
                {/* Notifications */}
                <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-3 focus:outline-none"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        {user?.avatar ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${user.avatar}`}
                                alt={user.name}
                                className="w-9 h-9 rounded-full object-cover border border-orange-200"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-[#FE5B00] font-bold">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        )}
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                            <Link
                                href="/dashboard/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                Profil Saya
                            </Link>
                            <Link
                                href="/dashboard/settings"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                Pengaturan
                            </Link>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button
                                onClick={logout}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                Keluar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
