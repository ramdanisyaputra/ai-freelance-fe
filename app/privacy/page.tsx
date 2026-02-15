import React from 'react'
import Link from 'next/link'

export default function Privacy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
                <div className="mb-6">
                    <Link href="/register" className="text-[#FE5B00] hover:text-[#E54F00] font-medium">
                        &larr; Kembali ke Pendaftaran
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-6">Kebijakan Privasi</h1>

                <div className="prose prose-orange max-w-none text-gray-600">
                    <p>Di Lepas AI, kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda.</p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Informasi yang Kami Kumpulkan</h2>
                    <p>Kami mengumpulkan informasi yang Anda berikan saat mendaftar, seperti nama, alamat email, dan informasi profil freelancer Anda. Kami juga mengumpulkan data penggunaan untuk meningkatkan layanan kami.</p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Penggunaan Informasi</h2>
                    <p>Informasi yang kami kumpulkan digunakan untuk:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Menyediakan dan memelihara layanan kami.</li>
                        <li>Memproses transaksi dan mengelola akun Anda.</li>
                        <li>Mengirimkan notifikasi terkait layanan.</li>
                        <li>Meningkatkan kualitas dan keamanan layanan.</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Keamanan Data</h2>
                    <p>Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah.</p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Layanan Pihak Ketiga</h2>
                    <p>Kami dapat menggunakan layanan pihak ketiga (seperti Google Analytics atau penyedia autentikasi) yang memiliki kebijakan privasi mereka sendiri.</p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Hubungi Kami</h2>
                    <p>Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami melalui email support yang tersedia.</p>
                </div>

                <div className="mt-8 border-t pt-6 text-gray-500 text-sm">
                    Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
                </div>
            </div>
        </div>
    )
}
