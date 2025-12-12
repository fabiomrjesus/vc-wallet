
import type { TypedDataSigner } from 'ethers'

const domainName = 'VCWalletHubGovernance'
const domainVersion = '1'
const proposalTypes = {
  Proposal: [{ name: 'proposalId', type: 'bytes32' }],
}

export async function signProposalId(proposalId: string, signer: TypedDataSigner, verifyingContract: string) {
  const network = await signer.provider!.getNetwork()
  const domain = {
    name: domainName,
    version: domainVersion,
    chainId: Number(network.chainId),
    verifyingContract,
  }
  const signature = await signer.signTypedData(domain, proposalTypes, { proposalId })
  const signerAddress = await signer.getAddress()
  return { signature, signer: signerAddress }
}
