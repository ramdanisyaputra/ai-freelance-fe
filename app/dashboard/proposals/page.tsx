'use client'

import React from 'react'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import ProposalList from '@/features/proposal/components/ProposalList'

export default function ProposalsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Daftar Proposal</h1>
                    <p className="text-gray-500">Kelola semua proposal yang telah Anda buat.</p>
                </div>
                <Link href="/dashboard/proposal/create" className="bg-[#FE5B00] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#E54F00] transition-colors shadow-sm">
                    Buat Proposal Baru
                </Link>
            </div>

            <ProposalList />
        </div>
    )
}
