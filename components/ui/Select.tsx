import React from 'react'

interface SelectOption {
    value: string | number
    label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    options?: SelectOption[]
}

export default function Select({ label, error, className = '', options = [], children, ...props }: SelectProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    className={`w-full px-4 py-3 rounded-lg border text-gray-900 bg-white appearance-none ${error
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-[#FE5B00]'
                        } focus:outline-none focus:ring-2 ${error
                            ? 'focus:ring-red-200'
                            : 'focus:ring-orange-200'
                        } transition-colors pr-10 ${className}`}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                    {children}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}
