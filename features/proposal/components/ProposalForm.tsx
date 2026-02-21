'use client'

import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useRouter } from 'next/navigation'
import { useProposal } from '@/features/proposal/hooks/useProposal'
import { useProposalWebSocket } from '@/features/proposal/hooks/useProposalWebSocket'
import { useAuth } from '@/features/auth/hooks/useAuth'
import RichEditor from '@/components/editor/RichEditor'

export default function ProposalForm() {
    const [brief, setBrief] = useState('')
    const [userBrief, setUserBrief] = useState('')
    const [language, setLanguage] = useState('id')
    const [processingProposalId, setProcessingProposalId] = useState<number | null>(null)
    const { generateProposal, isLoading, result, setResult, error: hookError } = useProposal()
    const { user } = useAuth()
    const { updates } = useProposalWebSocket(user?.id || null)
    // Local error state for validation
    const [validationError, setValidationError] = useState<string | null>(null)
    const router = useRouter()

    const error = hookError || validationError

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (brief.length < 50) {
            setValidationError('Brief minimal 50 karakter.')
            return
        }
        setValidationError(null)

        try {
            const data = await generateProposal(brief, userBrief, language)
            if (data?.id) {
                setProcessingProposalId(data.id)
            }
        } catch (err) {
            // Error handled by hook
        }
    }

    // Handle WebSocket updates
    useEffect(() => {
        if (updates && updates.proposal_id === processingProposalId) {
            // Redirect to proposal detail page
            router.push(`/dashboard/proposal/${updates.proposal_id}`)
        }
    }, [updates, processingProposalId, router])

    // Polling fallback for WebSocket failures
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (result && result.status !== 'completed' && result.status !== 'failed') {
            const poll = async () => {
                try {
                    // Import axios locally to avoid circular dependencies if any, or use global
                    const { default: axios } = await import('@/lib/axios')
                    const { data } = await axios.get(`/api/proposals/${result.id}`)

                    // ResponseTrait wraps in 'data', and show() wraps in 'proposal'
                    const payload = data.data?.proposal || data.proposal || data.data || data

                    if (payload.status === 'completed') {
                        router.push(`/dashboard/proposal/${payload.id}`)
                    }
                    setResult(payload)
                } catch (e) {
                    console.error('Polling error:', e)
                }
            }
            interval = setInterval(poll, 3000)
        }
        return () => clearInterval(interval)
    }, [result, router, setResult])

    const copyToClipboard = () => {
        const textToCopy = result?.content || result?.proposal
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy)
            // You might want to use a toast here instead of alert
            alert('Proposal successfully copied!')
        }
    }

    const getLoadingMessage = () => {
        if (!result) return 'Memulai...'
        if (!result.summary) return 'Menganalisis Brief Project...'
        if (!result.scope || result.scope.length === 0) return 'Menentukan Scope Pekerjaan...'
        if (!result.estimation) return 'Menghitung Estimasi Biaya & Waktu...'
        if (!result.content && !result.proposal) return 'Menulis Draf Proposal...'
        return 'Finalisasi...'
    }

    if (result) {
        const isPending = result.status !== 'completed' && result.status !== 'failed'
        const loadingMessage = getLoadingMessage()

        if (result.status === 'failed') {
            return (
                <div className="space-y-6 animate-fade-in">
                    <Card className="border-t-4 border-t-red-500">
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Membuat Proposal</h2>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Maaf, terjadi kesalahan saat AI memproses permintaan Anda. Silakan coba lagi atau periksa koneksi internet Anda.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    </Card>
                </div>
            )
        }

        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isPending ? loadingMessage : 'Hasil Analisis AI'}
                    </h1>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Buat Baru
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Scope & Estimates */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card title="Ringkasan & Scope">
                            <div className="space-y-4">
                                {!result.summary ? (
                                    <div className="space-y-2 animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600 animate-fade-in">{result.summary}</p>
                                )}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Scope Pekerjaan:</h4>
                                    {!result.scope || result.scope.length === 0 ? (
                                        <div className="space-y-2 animate-pulse">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 animate-fade-in">
                                            {(result.scope || []).map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </Card>

                        <Card title="Estimasi">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-600">Durasi</span>
                                    {!result.estimation ? (
                                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                    ) : (
                                        <span className="font-semibold text-gray-900 animate-fade-in">{result.estimation?.duration_days || '-'} Hari</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-gray-600">Harga</span>
                                    {!result.estimation ? (
                                        <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                                    ) : (
                                        <span className="font-bold text-[#FE5B00] text-lg animate-fade-in">
                                            {result.estimation?.price ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(result.estimation.price) : '-'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Proposal Text */}
                    <div className="lg:col-span-2">
                        <Card title={isPending ? loadingMessage : "Draft Proposal (Siap Kirim)"}>
                            <div className="space-y-4">
                                <div className="relative">
                                    {isPending ? (
                                        <div className="w-full h-[500px] p-6 bg-gray-50 rounded-lg border border-gray-200 animate-pulse space-y-4 overflow-hidden">
                                            <div className="flex items-center gap-2 mb-8">
                                                <div className="h-2 w-2 bg-orange-400 rounded-full animate-bounce"></div>
                                                <div className="h-2 w-2 bg-orange-400 rounded-full animate-bounce delay-75"></div>
                                                <div className="h-2 w-2 bg-orange-400 rounded-full animate-bounce delay-150"></div>
                                                <span className="text-xs text-gray-500 ml-2">{loadingMessage}</span>
                                            </div>
                                            {[...Array(12)].map((_, i) => (
                                                <div key={i} className={`h-3 bg-gray-200 rounded ${i % 3 === 0 ? 'w-full' : i % 3 === 1 ? 'w-11/12' : 'w-4/5'}`}></div>
                                            ))}
                                            <div className="h-32"></div>
                                            {[...Array(8)].map((_, i) => (
                                                <div key={i} className={`h-3 bg-gray-200 rounded ${i % 2 === 0 ? 'w-full' : 'w-3/4'}`}></div>
                                            ))}
                                        </div>
                                    ) : (
                                        <textarea
                                            readOnly
                                            className="w-full h-[500px] p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm font-mono text-gray-800 focus:outline-none resize-none"
                                            value={result.content || result.proposal || ''}
                                        />
                                    )}
                                    {!isPending && (
                                        <button
                                            type="button"
                                            onClick={copyToClipboard}
                                            className="absolute top-4 right-4 bg-white/90 backdrop-blur shadow-sm border border-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                            Copy Text
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 text-center">
                                    Tips: Anda bisa mengedit teks ini setelah menyalinnya ke wa/email.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    // Show processing state
    if (processingProposalId && !result) {
        return (
            <div className="space-y-6 animate-fade-in">
                <Card className="border-t-4 border-t-[#FE5B00]">
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                            <svg className="animate-spin h-8 w-8 text-[#FE5B00]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Sedang Memproses Proposal...</h2>
                        <p className="text-gray-600 mb-4">AI sedang menganalisis brief dan membuat proposal profesional untuk Anda.</p>
                        <div className="max-w-md mx-auto space-y-2 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>Menganalisis kebutuhan klien</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <span>Membuat scope pekerjaan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                <span>Menghitung estimasi waktu dan harga</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                                <span>Menyusun proposal profesional</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-6">Proses ini biasanya memakan waktu 30-60 detik</p>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Buat Proposal Baru</h1>
                <p className="text-gray-500">
                    Masukkan pesan atau brief dari klien, AI akan membantu membuatkan proposal profesional dalam hitungan detik.
                </p>
            </div>

            <Card className="border-t-4 border-t-[#FE5B00]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="userBrief" className="block text-sm font-semibold text-gray-900 mb-2">
                            Brief Anda (Opsional)
                        </label>
                        <textarea
                            id="userBrief"
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-orange-100 focus:border-[#FE5B00] transition-all resize-y min-h-[100px] text-gray-800 placeholder-gray-400"
                            placeholder="Contoh: Saya adalah graphic designer dengan 5 tahun pengalaman di pembuatan branding dan logo. Saya biasa mengerjakan project dengan timeline 1-2 minggu..."
                            value={userBrief}
                            onChange={(e) => setUserBrief(e.target.value)}
                            disabled={isLoading}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Tambahkan informasi tentang keahlian, pengalaman, atau preferensi kerja Anda untuk proposal yang lebih personal.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="language" className="block text-sm font-semibold text-gray-900 mb-2">
                            Bahasa Proposal <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-orange-100 focus:border-[#FE5B00] transition-all text-gray-800"
                            disabled={isLoading}
                        >
                            <option value="id">🇮🇩 Bahasa Indonesia</option>
                            <option value="en">🇬🇧 English</option>
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                            Pilih bahasa untuk proposal yang akan digenerate oleh AI.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="brief" className="block text-sm font-semibold text-gray-900 mb-2">
                            Brief / Chat dari Klien <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <textarea
                                id="brief"
                                rows={8}
                                className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-100 focus:border-[#FE5B00]'} transition-all resize-y min-h-[150px] text-gray-800 placeholder-gray-400`}
                                placeholder="Contoh: Halo mas, saya mau bikin logo untuk perusahaan logistik saya. Saya butuh logo yang simpel, modern, dan bisa dipakai di berbagai media. Budget saya sekitar 5 juta. Bisa selesai berapa lama ya?"
                                value={brief}
                                onChange={(e) => {
                                    setBrief(e.target.value)
                                    setValidationError(null)
                                }}
                                disabled={isLoading}
                            />
                            <div className={`absolute bottom-3 right-3 text-xs ${brief.length < 50 ? 'text-orange-500' : 'text-gray-400'}`}>
                                {brief.length} / 50 karakter
                            </div>
                        </div>
                        {error && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="text-gray-500 hover:text-gray-700 text-sm font-medium px-4 py-2"
                        >
                            Batal
                        </button>
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            disabled={brief.length < 50 || isLoading}
                            className="shadow-lg shadow-orange-200 min-w-[180px]"
                        >
                            {isLoading ? 'Menganalisa Brief...' : '✨ Generate Proposal'}
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Quick Tips */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex gap-3">
                <div className="flex-shrink-0 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Tips agar hasil maksimal:</h4>
                    <p className="text-sm text-blue-700">
                        Pastikan brief mencakup jenis pekerjaan (e.g. desain logo, artikel blog, website), fitur atau hasil utama yang diinginkan, dan referensi jika ada. Semakin detail brief, semakin akurat estimasi harga dan waktunya.
                    </p>
                </div>
            </div>
        </div>
    )
}
