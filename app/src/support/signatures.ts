import { getBytes, isHexString, type Signer } from 'ethers'

export type ProposalSignature = {
  signer: string
  signature: string
}

/**
 * Signs a proposal id (bytes32) with the provided signer and returns the signature payload.
 */
export async function signProposalId(proposalId: string, signer: Signer): Promise<ProposalSignature> {
  if (!isHexString(proposalId, 32)) {
    throw new Error('proposalId must be a 32-byte hex string')
  }
  const digest = getBytes(proposalId)
  const signature = await signer.signMessage(digest)
  const signerAddress = await signer.getAddress()
  return { signer: signerAddress, signature }
}
