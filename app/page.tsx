'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    // Wait for DOM to be ready
    setTimeout(() => {
      const elements = document.querySelectorAll('.fade-in-scroll');
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-100">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full backdrop-blur-md z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/80 shadow-sm'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
              <div className="w-8 h-8 bg-[#FE5B00] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LA</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Lepas AI</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-[#FE5B00] transition-colors duration-200">Fitur</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-[#FE5B00] transition-colors duration-200">Cara Kerja</a>
              <a href="#pricing" className="text-gray-600 hover:text-[#FE5B00] transition-colors duration-200">Harga</a>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="text-[#FE5B00] hover:text-[#E54F00] transition-colors duration-200 font-medium flex items-center">
                Masuk
              </Link>
              <Link href="/register" className="bg-[#FE5B00] text-white px-6 py-2 rounded-full hover:bg-[#E54F00] transition-all duration-200 hover:shadow-md flex items-center">
                Mulai Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Buat Proposal <span className="text-[#FE5B00]">Freelance</span> dalam{" "}
                <span className="text-[#FE5B00]">3 Menit</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                AI Freelancer Assistant membantu web developer Indonesia mengubah brief klien
                menjadi proposal profesional lengkap dengan estimasi harga dan timeline.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="bg-[#FE5B00] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#E54F00] transition-all duration-200 hover:shadow-xl text-lg text-center">
                  Coba Sekarang - Gratis
                </Link>
                <button className="border-2 border-[#FE5B00] text-[#FE5B00] px-8 py-4 rounded-full font-semibold hover:bg-[#FE5B00] hover:text-white transition-all duration-200 text-lg">
                  Lihat Demo
                </button>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="text-[#FE5B00] text-lg">✓</span>
                  <span>Tanpa kartu kredit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[#FE5B00] text-lg">✓</span>
                  <span>Setup 2 menit</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-shadow duration-300">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Input Brief:</p>
                    <p className="text-gray-800 italic">&quot;Saya butuh website company profile dengan admin panel...&quot;</p>
                  </div>
                  <div className="flex justify-center py-2">
                    <div className="w-8 h-8 border-4 border-[#FE5B00] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border-l-4 border-[#FE5B00]">
                    <p className="text-sm text-gray-600 mb-2 font-medium">✨ Proposal Siap:</p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>• Scope: 5 halaman</p>
                      <p>• Durasi: 21 hari</p>
                      <p>• Harga: Rp 7.500.000</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 top-10 right-10 w-72 h-72 bg-[#FE5B00] rounded-full opacity-10 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white fade-in-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center fade-in-scroll">
              <div className="text-4xl font-bold text-[#FE5B00]">30 min</div>
              <div className="text-gray-600 mt-2">→ 3 menit</div>
              <div className="text-sm text-gray-500 mt-1">Hemat waktu</div>
            </div>
            <div className="text-center fade-in-scroll">
              <div className="text-4xl font-bold text-[#FE5B00]">90%</div>
              <div className="text-gray-600 mt-2">Akurasi</div>
              <div className="text-sm text-gray-500 mt-1">Estimasi harga</div>
            </div>
            <div className="text-center fade-in-scroll">
              <div className="text-4xl font-bold text-[#FE5B00]">100+</div>
              <div className="text-gray-600 mt-2">Freelancer</div>
              <div className="text-sm text-gray-500 mt-1">Sudah percaya</div>
            </div>
            <div className="text-center fade-in-scroll">
              <div className="text-4xl font-bold text-[#FE5B00]">10x</div>
              <div className="text-gray-600 mt-2">Lebih cepat</div>
              <div className="text-sm text-gray-500 mt-1">Bikin proposal</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-orange-50 fade-in-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fitur yang Membantu <span className="text-[#FE5B00]">Produktivitas</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Semua yang kamu butuhkan untuk membuat proposal profesional dengan cepat
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 fade-in-scroll">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analisis Brief Otomatis</h3>
              <p className="text-gray-600 leading-relaxed">
                AI menganalisis brief klien dan mendeteksi ambiguitas. Jika ada yang kurang jelas,
                sistem akan memberikan pertanyaan klarifikasi.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 fade-in-scroll">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Generate Scope Kerja</h3>
              <p className="text-gray-600 leading-relaxed">
                Dapatkan daftar scope pekerjaan yang realistis dan detail berdasarkan
                kebutuhan klien dan skill stack kamu.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 fade-in-scroll">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Estimasi Harga Akurat</h3>
              <p className="text-gray-600 leading-relaxed">
                Sistem menghitung estimasi harga dan timeline berdasarkan kompleksitas
                proyek dan rate standar freelancer.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 fade-in-scroll">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">✍️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Proposal Siap Kirim</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate proposal profesional dalam bahasa Indonesia yang bisa langsung
                dikirim via WhatsApp atau email.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 fade-in-scroll">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Proses Super Cepat</h3>
              <p className="text-gray-600 leading-relaxed">
                Hasil dalam hitungan detik. Tidak perlu menunggu lama untuk mendapatkan
                proposal yang berkualitas.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 fade-in-scroll">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Profil</h3>
              <p className="text-gray-600 leading-relaxed">
                Set skill stack, rate type, dan minimal harga. Semua proposal akan
                disesuaikan dengan profil freelancer kamu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white fade-in-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cara Kerja <span className="text-[#FE5B00]">Sangat Mudah</span>
            </h2>
            <p className="text-xl text-gray-600">Hanya 3 langkah untuk proposal profesional</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative fade-in-scroll">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border-2 border-[#FE5B00] hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#FE5B00] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Input Brief Klien</h3>
                <p className="text-gray-700">
                  Copy-paste brief dari klien atau ketik manual. Bahasa bebas, bisa Indonesia atau campur Inggris.
                </p>
              </div>
            </div>

            <div className="relative fade-in-scroll">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border-2 border-[#FE5B00] hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#FE5B00] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI Proses</h3>
                <p className="text-gray-700">
                  AI menganalisis brief, generate scope kerja, hitung estimasi waktu dan harga secara otomatis.
                </p>
              </div>
            </div>

            <div className="relative fade-in-scroll">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border-2 border-[#FE5B00] hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#FE5B00] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Copy & Kirim</h3>
                <p className="text-gray-700">
                  Review hasil, edit jika perlu, lalu copy dan kirim ke klien. Selesai dalam 3 menit!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#FE5B00] to-[#FF7A33] fade-in-scroll">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Siap Meningkatkan Produktivitas?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Bergabung dengan ratusan freelancer Indonesia yang sudah menghemat waktu dengan Lepas AI
          </p>
          <Link href="/register" className="bg-white text-[#FE5B00] px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-xl inline-block">
            Mulai Gratis Sekarang →
          </Link>
          <p className="text-white/80 mt-4 text-sm">Gratis untuk 5 proposal pertama. Tanpa kartu kredit.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-[#FE5B00] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LA</span>
                </div>
                <span className="font-bold text-xl text-white">Lepas AI</span>
              </div>
              <p className="text-sm">
                Membantu freelancer web developer Indonesia membuat proposal lebih cepat dan profesional.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produk</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#FE5B00] transition-colors">Fitur</a></li>
                <li><a href="#" className="hover:text-[#FE5B00] transition-colors">Harga</a></li>
                <li><a href="#" className="hover:text-[#FE5B00] transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Sumber Daya</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#FE5B00] transition-colors">Dokumentasi</a></li>
                <li><a href="#" className="hover:text-[#FE5B00] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#FE5B00] transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#FE5B00] transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-[#FE5B00] transition-colors">Kontak</a></li>
                <li><a href="#" className="hover:text-[#FE5B00] transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 AI Freelancer Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
