'use client'

import React from 'react'
import Card from '@/components/ui/Card'
import { useAuth } from '@/hooks/auth'

export default function Dashboard() {
    const { user } = useAuth({ middleware: 'auth' })

    const stats = [
        { title: 'Total Proyek', value: '12', change: '+2.5%', color: 'bg-blue-50 text-blue-600' },
        { title: 'Proposal Terkirim', value: '24', change: '+12%', color: 'bg-green-50 text-green-600' },
        { title: 'Pendapatan', value: 'Rp 45.2Jt', change: '+4.3%', color: 'bg-orange-50 text-orange-600' },
        { title: 'Klien Aktif', value: '5', change: '0%', color: 'bg-purple-50 text-purple-600' },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Selamat datang kembali, {user?.name}!</p>
                </div>
                <button className="bg-[#FE5B00] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#E54F00] transition-colors shadow-sm">
                    Buat Proposal Baru
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="flex flex-col">
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <div className="flex items-baseline mt-2">
                            <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                            <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {stat.change}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2" title="Proyek Terbaru">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Proyek</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klien</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Redesain Website Corporate</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">PT Maju Sejahtera</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">Rp 12.000.000</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Aplikasi Mobile E-Commerce</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">Toko Berkah</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">Rp 25.000.000</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">SEO Optimization</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">CV Digital Kreatif</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Completed</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">Rp 5.000.000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card title="Aktivitas Terkini">
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Proposal Baru Dibuat</p>
                                <p className="text-xs text-gray-500">Untuk Proyek "App Marketplace"</p>
                                <p className="text-xs text-gray-400 mt-1">2 jam yang lalu</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Pembayaran Diterima</p>
                                <p className="text-xs text-gray-500">Dari PT Maju Sejahtera</p>
                                <p className="text-xs text-gray-400 mt-1">Kemarin</p>
                            </div>
                        </li>
                    </ul>
                </Card>
            </div>
        </div>
    )
}
