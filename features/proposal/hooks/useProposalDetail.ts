import useSWR from 'swr'
import axios from '@/lib/axios'
import { Proposal } from '../types/proposal'

export const useProposalDetail = (id: string | number | undefined) => {
    const { data, error, mutate } = useSWR<Proposal>(
        id ? `/api/proposals/${id}` : null,
        async (url: string) => {
            const res = await axios.get(url)
            return res.data.data?.proposal
        }
    )

    return {
        proposal: data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    }
}
