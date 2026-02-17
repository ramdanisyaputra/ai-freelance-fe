export interface ProposalRequest {
    brief: string
    user_brief?: string
    freelancer_profile: {
        stack: string[]
        rate_type: string
        min_price: number
        currency: string
    }
}

export interface ProposalResponse {
    id: number
    status: string
    need_clarification: boolean
    summary: string | null
    scope: string[]
    estimation: {
        duration_days: number
        price: number
    }
    proposal: string
    content: string
    created_at: string
}
