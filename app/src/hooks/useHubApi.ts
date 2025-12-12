import { useCallback } from 'react'

export type ProposalSignatureDto = {
  id: string
  signerAddress: string | null
  signature: string
  createdAt: string
}

const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

export function useHubApi(baseUrl = `${apiBase}/api/hub/offchain`) {
  const signProposal = useCallback(
    async (proposalId: string, payload: { signerAddress: string; signature: string }) => {
      const res = await fetch(`${baseUrl}/proposals/${proposalId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      console.log(res)
      if (!res.ok) throw new Error('Failed to sign proposal')
      return res.json() as Promise<ProposalSignatureDto>
    },
    [baseUrl]
  )

  const getSignatures = useCallback(
    async (proposalId: string) => {
      const res = await fetch(`${baseUrl}/proposals/${proposalId}/signatures`)
      if (!res.ok) throw new Error('Failed to load signatures')
      return res.json() as Promise<ProposalSignatureDto[]>
    },
    [baseUrl]
  )

  return { signProposal, getSignatures }
}
