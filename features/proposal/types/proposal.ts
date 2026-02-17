export interface Proposal {
    id: number
    brief: string
    user_brief: string | null
    summary: string | null
    scope: string[]
    duration_days: number
    price: number
    currency: string
    content: string
    status: string
    created_at: string
}
