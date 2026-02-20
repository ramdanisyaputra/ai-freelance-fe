'use client'

import React from 'react'
import Card from '@/components/ui/Card'
import { useAuth } from '@/features/auth/hooks/useAuth'
import Link from 'next/link'

import { useProposals } from '@/features/proposal/hooks/useProposals'

export default function Dashboard() {
    const { user } = useAuth({ middleware: 'auth' })

    const { proposals, isLoading } = useProposals()

    // Calculate stats
    const totalProposals = proposals.length
    const recentProposals = [...proposals].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)

    // Calculate total value (simple sum of all proposal prices)
    const totalValue = proposals.reduce((acc, curr) => acc + curr.price, 0)

    const stats = [
        {
            title: 'Total Proposal',
            value: totalProposals.toString(),
            change: 'All time',
            color: 'bg-blue-50 text-blue-600'
        },
        {
            title: 'Estimasi Nilai',
            value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalValue),
            change: 'Potential',
            color: 'bg-green-50 text-green-600'
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Selamat datang kembali, {user?.name}!</p>
                </div>
                <Link href="/dashboard/proposal/create" className="bg-[#FE5B00] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#E54F00] transition-colors shadow-sm">
                    Buat Proposal Baru
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="flex flex-col">
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <div className="flex items-baseline mt-2">
                            <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                            <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                                {stat.change}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2" title="Proposal Terkini">
                    {isLoading ? (
                        <div className="animate-pulse space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-100 rounded"></div>
                            ))}
                        </div>
                    ) : recentProposals.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Proposal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                    {recentProposals.map((proposal) => (
                                        <tr key={proposal.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 max-w-xs truncate">
                                                <Link href={`/dashboard/proposal/${proposal.id}`} className="hover:text-[#FE5B00]">
                                                    {proposal.title || proposal.summary || 'Proposal Proyek'}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${proposal.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {proposal.status || 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {new Date(proposal.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: proposal.currency }).format(proposal.price)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">Belum ada proposal yang dibuat.</p>
                    )}
                </Card>

                <Card title="Aktivitas Terkini">
                    {isLoading ? (
                        <div className="animate-pulse space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="h-8 w-8 bg-gray-100 rounded-full"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : recentProposals.length > 0 ? (
                        <ul className="space-y-4">
                            {recentProposals.map((proposal) => (
                                <li key={proposal.id} className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">Proposal Baru Dibuat</p>
                                        <p className="text-xs text-gray-500 line-clamp-1">Untuk "{proposal.title || proposal.summary || 'Proyek Tanpa Judul'}"</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(proposal.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center py-4 text-sm">Belum ada aktivitas.</p>
                    )}
                </Card>
            </div>
        </div>
    )
}
