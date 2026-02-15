import React from 'react'

interface CardProps {
    children: React.ReactNode
    className?: string
    title?: string
    description?: string
}

export default function Card({ children, className = '', title, description }: CardProps) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md ${className}`}>
            {(title || description) && (
                <div className="mb-4">
                    {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                </div>
            )}
            {children}
        </div>
    )
}
