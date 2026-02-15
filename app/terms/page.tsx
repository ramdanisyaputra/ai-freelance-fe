import React from 'react'
import Link from 'next/link'

export default function Terms() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
                <div className="mb-6">
                    <Link href="/register" className="text-[#FE5B00] hover:text-[#E54F00] font-medium">
                        &larr; Kembali ke Pendaftaran
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-6">Syarat & Ketentuan</h1>

                <div className="prose prose-orange max-w-none text-gray-600">
                    <p>Selamat datang di Lepas AI. Harap baca syarat dan ketentuan ini dengan saksama sebelum menggunakan layanan kami.</p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Pendahuluan</h2>
                    <p>Dengan mengakses atau menggunakan Lepas AI, Anda setuju untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak boleh mengakses layanan ini.</p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Penggunaan Layanan</h2>
                    <p>Anda bertanggung jawab untuk menjaga kerahasiaan akun dan password Anda. Anda setuju untuk menerima tanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda.</p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Konten Pengguna</h2>
                    <p>Layanan kami memungkinkan Anda untuk memasukkan brief dan menghasilkan proposal. Anda memegang hak atas konten yang Anda buat, namun Anda memberikan kami lisensi untuk menggunakan konten tersebut demi penyediaan dan peningkatan layanan.</p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Batasan Tanggung Jawab</h2>
                    <p>Lepas AI tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensi yang timbul dari penggunaan layanan kami.</p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Perubahan Syarat</h2>
                    <p>Kami berhak untuk mengubah atau mengganti syarat-syarat ini kapan saja. Perubahan akan berlaku segera setelah diposting di halaman ini.</p>
                </div>

                <div className="mt-8 border-t pt-6 text-gray-500 text-sm">
                    Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
                </div>
            </div>
        </div>
    )
}
