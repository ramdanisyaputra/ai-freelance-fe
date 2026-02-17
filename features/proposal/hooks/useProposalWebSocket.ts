import { useEffect, useState } from 'react'
import { initializeEcho, getEcho } from '@/lib/echo'

interface ProposalUpdate {
    proposal_id: number
    status: string
    content: string
    scope: string[]
    estimation: {
        duration_days: number
        price: number
    }
}

export const useProposalWebSocket = (userId: number | null) => {
    const [updates, setUpdates] = useState<ProposalUpdate | null>(null)

    useEffect(() => {
        if (!userId) return

        // Get token from localStorage
        const token = localStorage.getItem('token')
        if (!token) return

        // Initialize Echo
        const echo = initializeEcho(token)

        // Listen to private user channel
        const channel = echo.private(`user.${userId}`)

        channel.listen('.ProposalGenerated', (data: ProposalUpdate) => {
            console.log('Proposal update received:', data)
            setUpdates(data)
        })

        return () => {
            channel.stopListening('.ProposalGenerated')
            echo.leave(`user.${userId}`)
        }
    }, [userId])

    return { updates, clearUpdates: () => setUpdates(null) }
}
