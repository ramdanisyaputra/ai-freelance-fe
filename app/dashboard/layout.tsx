'use client'

import { Toaster } from 'react-hot-toast'
import React from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import { useAuth } from '@/hooks/auth'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user } = useAuth({ middleware: 'auth' })
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FE5B00]"></div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <Toaster position="bottom-right" />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <Header onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
