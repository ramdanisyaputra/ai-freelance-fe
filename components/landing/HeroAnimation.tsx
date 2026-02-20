'use client';

import React, { useState, useEffect } from 'react';

export default function HeroAnimation() {
    const [step, setStep] = useState(0);

    useEffect(() => {
        let mounted = true;

        const runCycle = async () => {
            while (mounted) {
                // Step 0: Input Brief shown (static)
                setStep(0);
                await new Promise(r => setTimeout(r, 2000));
                if (!mounted) break;

                // Step 1: Processing (spinner)
                setStep(1);
                await new Promise(r => setTimeout(r, 1500));
                if (!mounted) break;

                // Step 2: Result shown
                setStep(2);
                await new Promise(r => setTimeout(r, 5000)); // Show result for 5s
                if (!mounted) break;
            }
        };

        runCycle();

        return () => { mounted = false; };
    }, []);

    return (
        <div className="relative w-full max-w-lg mx-auto transform hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 min-h-[340px] relative z-10 flex flex-col">
                {/* Header Dots */}
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>

                {/* Content Container */}
                <div className="flex-1 flex flex-col justify-center space-y-6">

                    {/* Input Brief Section - Always visible but dims */}
                    <div className={`bg-gray-50 p-4 rounded-lg transform transition-all duration-500 origin-top
            ${step === 2 ? 'opacity-60 scale-95' : 'opacity-100 scale-100'}`}>
                        <p className="text-sm text-gray-600 mb-2 font-medium">Input Brief:</p>
                        <p className="text-gray-800 italic">&quot;Saya butuh website company profile dengan admin panel...&quot;</p>
                    </div>

                    {/* Dynamic Area */}
                    <div className="relative h-[200px] flex items-center justify-center">

                        {/* State 1: Skeleton Loading */}
                        <div className={`absolute inset-0 w-full bg-white p-5 rounded-lg border-l-4 border-gray-200 flex flex-col justify-center transition-all duration-300 
                ${step === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="h-2 w-2 bg-orange-400 rounded-full animate-bounce"></div>
                                <div className="h-2 w-2 bg-orange-400 rounded-full animate-bounce delay-75"></div>
                                <div className="h-2 w-2 bg-orange-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                                <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse delay-75"></div>
                                <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse delay-150"></div>
                            </div>
                        </div>

                        {/* State 2: Result */}
                        <div className={`absolute inset-0 w-full bg-gradient-to-r from-orange-50 to-orange-100 p-5 rounded-lg border-l-4 border-[#FE5B00] flex flex-col justify-center transition-all duration-700 transform
                ${step === 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
                            <p className="text-sm text-gray-600 mb-3 font-medium flex items-center">
                                <span className="text-lg mr-2">✨</span> Proposal Siap:
                            </p>
                            <div className="space-y-2.5 text-sm text-gray-700">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-500 font-bold">✓</span> Scope: 5 halaman
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-500 font-bold">✓</span> Durasi: 21 hari
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-500 font-bold">✓</span> Harga: Rp 7.500.000
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute -z-10 top-10 right-10 w-72 h-72 bg-[#FE5B00] rounded-full opacity-10 blur-3xl animate-pulse"></div>
        </div>
    );
}
