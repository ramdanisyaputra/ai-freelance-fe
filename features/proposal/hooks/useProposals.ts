import useSWR from 'swr'
import axios from '@/lib/axios'
import { Proposal } from '../types/proposal'

export const useProposals = () => {
    const { data, error, mutate } = useSWR<Proposal[]>('/api/proposals', async (url: string) => {
        const res = await axios.get(url)
        return res.data.data?.proposals || []
    })

    return {
        proposals: data || [],
        isLoading: !error && !data,
        isError: error,
        mutate,
    }
}
