'use client'

import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useRouter } from 'next/navigation'
import { useProposalDetail } from '../hooks/useProposalDetail'
import RichEditor from '@/components/editor/RichEditor'

import Link from 'next/link'
import toast from 'react-hot-toast'
import axios from '@/lib/axios'

interface ProposalDetailProps {
    id: string
}

export default function ProposalDetail({ id }: ProposalDetailProps) {
    const { proposal, isLoading, isError, mutate } = useProposalDetail(id)
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState('')

    const copyToClipboard = () => {
        if (proposal?.content) {
            navigator.clipboard.writeText(proposal.content)
            toast.success('Proposal copied to clipboard!')
        }
    }

    const handleEdit = () => {
        setEditedContent(proposal?.content || '')
        setIsEditing(true)
    }

    const handleExportPdf = async () => {
        if (!proposal) return

        const loadingToast = toast.loading('Generating PDF...')
        try {
            const response = await axios.get(`/api/proposals/${id}/pdf`, {
                responseType: 'blob'
            })

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `proposal-${id}.pdf`)

            // Append to html link element page
            document.body.appendChild(link)

            // Start download
            link.click()

            // Clean up and remove the link
            link.parentNode?.removeChild(link)
            toast.success('PDF downloaded successfully!', { id: loadingToast })
        } catch (error) {
            console.error('Failed to export PDF:', error)
            toast.error('Failed to generate PDF', { id: loadingToast })
        }
    }

    const handleSave = async () => {
        if (!proposal) return

        const loadingToast = toast.loading('Saving changes...')
        try {
            await axios.put(`/api/proposals/${id}`, {
                content: editedContent
            })

            await mutate()
            setIsEditing(false)
            toast.success('Proposal updated successfully!', { id: loadingToast })
        } catch (error) {
            console.error('Failed to update proposal:', error)
            toast.error('Failed to update proposal', { id: loadingToast })
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditedContent('')
    }

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-40 bg-gray-200 rounded-xl"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="h-64 bg-gray-200 rounded-xl"></div>
                    <div className="lg:col-span-2 h-64 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        )
    }

    if (isError || !proposal) {
        return (
            <Card className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Proposal Tidak Ditemukan</h3>
                <p className="mt-1 text-gray-500 mb-6">Proposal yang Anda cari tidak ditemukan atau telah dihapus.</p>
                <Button onClick={() => router.push('/dashboard/proposals')}>
                    Kembali ke Daftar
                </Button>
            </Card>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1 mb-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 line-clamp-1">{proposal.title || proposal.summary || 'Detail Proposal'}</h1>
                </div>
                <div className="flex gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${proposal.status === 'sent' ? 'bg-green-100 text-green-800' :
                        proposal.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {proposal.status ? proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1) : 'Draft'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Info & Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Ringkasan Proyek">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Brief Klien</h4>
                                <p className="text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto">
                                    {proposal.brief}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Scope Pekerjaan</h4>
                                <ul className="space-y-1.5">
                                    {(proposal.scope || []).map((item, i) => (
                                        <li key={i} className="flex items-start text-sm text-gray-700">
                                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Card>

                    <Card title="Estimasi">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Durasi Pengerjaan</span>
                                <span className="font-semibold text-gray-900">{proposal.duration_days} Hari</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-600">Total Harga</span>
                                <span className="font-bold text-[#FE5B00] text-xl">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: proposal.currency || 'IDR' }).format(proposal.price)}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Proposal Text */}
                <div className="lg:col-span-2">
                    <Card
                        title="Proposal Siap Kirim"
                        action={
                            !isEditing && proposal ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleExportPdf}
                                        className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                                        title="Export PDF"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        PDF
                                    </button>
                                    <button
                                        onClick={handleEdit}
                                        className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={copyToClipboard}
                                        className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        Copy
                                    </button>
                                </div>
                            ) : undefined
                        }
                    >
                        <div className="space-y-4">
                            {!isEditing ? (
                                <div className="relative">
                                    <div
                                        className="prose prose-sm sm:prose-base max-w-none min-h-[600px] px-4 py-3 text-gray-900 prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3 prose-p:text-gray-700 prose-p:my-3 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ul:my-3 prose-ul:list-disc prose-ul:pl-6 prose-ol:text-gray-700 prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-a:text-blue-600 prose-a:underline prose-img:rounded-lg prose-img:border prose-img:border-gray-200 prose-hr:my-4 prose-hr:border-gray-200 border border-gray-200 rounded-xl overflow-hidden"
                                        dangerouslySetInnerHTML={{ __html: proposal.content || '' }}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <RichEditor
                                        key="edit-mode"
                                        content={editedContent}
                                        onChange={setEditedContent}
                                        editable={true}
                                        className="min-h-[600px]"
                                    />
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button variant="secondary" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSave}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
