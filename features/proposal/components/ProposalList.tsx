'use client'

import React from 'react'
import Card from '@/components/ui/Card'
import { Proposal } from '../types/proposal'
import { useProposals } from '../hooks/useProposals'
import Link from 'next/link'

export default function ProposalList() {
    const { proposals, isLoading } = useProposals()

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-32">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        )
    }

    if (!proposals || proposals.length === 0) {
        return (
            <Card className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-[#FE5B00] mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Belum ada proposal</h3>
                <p className="mt-1 text-gray-500 mb-6">Mulai buat proposal pertamamu sekarang.</p>
                <Link href="/dashboard/proposal/create" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FE5B00] hover:bg-[#E54F00] transition-colors">
                    Buat Proposal Baru
                </Link>
            </Card>
        )
    }

    return (
        <div className="grid gap-6">
            {proposals.map((proposal) => (
                <div key={proposal.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${proposal.status === 'sent' ? 'bg-green-100 text-green-800' :
                                        proposal.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {proposal.status ? proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1) : 'Draft'}
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(proposal.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#FE5B00] transition-colors line-clamp-1">
                                    {proposal.title || proposal.summary || 'Proposal Proyek'}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                    {proposal.brief}
                                </p>

                                <div className="flex items-center gap-6 pt-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Durasi</span>
                                        <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {proposal.duration_days} Hari
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nilai</span>
                                        <span className="text-sm font-bold text-[#FE5B00] flex items-center gap-1.5">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: proposal.currency }).format(proposal.price)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center self-center pl-4 ml-4 hidden md:flex border-l border-gray-100 h-full">
                                <span className="text-sm font-medium text-gray-400 group-hover:text-[#FE5B00] transition-colors pr-2">Detail</span>
                                <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-orange-50 flex items-center justify-center transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-[#FE5B00] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Full card link overlay */}
                    {/* Full card link overlay */}
                    <Link href={`/dashboard/proposal/${proposal.id}`} className="absolute inset-0 z-10">
                        <span className="sr-only">View details for {proposal.summary}</span>
                    </Link>
                </div>
            ))}
        </div>
    )
}
