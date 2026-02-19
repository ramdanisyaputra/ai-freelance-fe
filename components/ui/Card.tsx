import React from 'react'

interface CardProps {
    children: React.ReactNode
    className?: string
    title?: string
    description?: string
    action?: React.ReactNode
}

export default function Card({ children, className = '', title, description, action }: CardProps) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md ${className}`}>
            {(title || description || action) && (
                <div className="mb-4 flex justify-between items-start">
                    <div>
                        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    )
}
