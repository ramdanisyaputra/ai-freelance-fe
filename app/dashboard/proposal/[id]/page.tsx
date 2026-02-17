'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import ProposalDetail from '@/features/proposal/components/ProposalDetail'

export default function ProposalDetailPage() {
    const params = useParams()
    const id = params.id as string

    return <ProposalDetail id={id} />
}
