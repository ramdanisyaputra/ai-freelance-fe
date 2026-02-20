'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname()

    const navItems = [
        {
            name: 'Dashboard', href: '/dashboard', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            )
        },
        {
            name: 'My Proposals', href: '/dashboard/proposals', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            name: 'Profile', href: '/dashboard/profile', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
    ]

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 transition-opacity md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <aside className={`fixed inset-y-0 left-0 z-[100] w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                {/* Logo & Close Button */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-[#FE5B00] rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">LA</span>
                        </div>
                        <span className="font-bold text-xl text-gray-900">Lepas AI</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        // Special handling for dashboard to only match exact path
                        const isActive = item.href === '/dashboard'
                            ? pathname === '/dashboard'
                            : pathname === item.href || pathname?.startsWith(item.href + '/')

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${isActive
                                    ? 'bg-orange-50 text-[#FE5B00]'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <span className={`mr-3 ${isActive ? 'text-[#FE5B00]' : 'text-gray-400 group-hover:text-gray-500'}`}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>


            </aside>
        </>
    )
}
