import { useState } from 'react'
import axios from '@/lib/axios'
import type { ProposalRequest, ProposalResponse } from '../types'
import { useRouter } from 'next/navigation'

export const useProposal = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<ProposalResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const generateProposal = async (brief: string, userBrief?: string, language: string = 'id') => {
        setIsLoading(true)
        setError(null)
        setResult(null)

        try {
            const { data } = await axios.post('/api/generate-proposal', {
                brief,
                user_brief: userBrief,
                language
            })
            // ResponseTrait wraps response in 'data' key
            const payload = data.data || data
            setResult(payload)
            return payload
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to generate proposal')
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return {
        generateProposal,
        isLoading,
        result,
        setResult,
        error
    }
}
