import { useCallback, useMemo } from 'react'
import { BrowserProvider, Contract, JsonRpcSigner, type Provider } from 'ethers'
import { getEthereum } from '../context/walletUtils'

export const HUB_GOV_ABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  { inputs: [], name: 'CannotRemoveLastSigner', type: 'error' },
  { inputs: [], name: 'CannotRemoveOwner', type: 'error' },
  { inputs: [], name: 'InvalidActionType', type: 'error' },
  { inputs: [], name: 'InvalidSignatureLength', type: 'error' },
  { inputs: [], name: 'InvalidSignatureS', type: 'error' },
  { inputs: [], name: 'InvalidSignatureV', type: 'error' },
  { inputs: [{ internalType: 'address', name: 'signer', type: 'address' }], name: 'InvalidSigner', type: 'error' },
  { inputs: [], name: 'NotCandidate', type: 'error' },
  { inputs: [], name: 'NotSigner', type: 'error' },
  { inputs: [], name: 'OnlyOwner', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'requested', type: 'uint256' },
      { internalType: 'uint256', name: 'available', type: 'uint256' },
    ],
    name: 'QuorumTooHigh',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'proposalId', type: 'bytes32' },
      { indexed: false, internalType: 'uint8', name: 'actionType', type: 'uint8' },
      { indexed: true, internalType: 'address', name: 'proposer', type: 'address' },
    ],
    name: 'GlobalProposalCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'bytes32', name: 'proposalId', type: 'bytes32' }],
    name: 'GlobalProposalExecuted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'nonce', type: 'uint256' },
      { indexed: true, internalType: 'bytes32', name: 'proposalId', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'proposer', type: 'address' },
    ],
    name: 'GlobalProposalIndexed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'oldOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnerChanged',
    type: 'event',
  },
  { anonymous: false, inputs: [{ indexed: false, internalType: 'uint256', name: 'quorum', type: 'uint256' }], name: 'QuorumEnforced', type: 'event' },
  { anonymous: false, inputs: [{ indexed: false, internalType: 'uint256', name: 'quorum', type: 'uint256' }], name: 'QuorumUpdated', type: 'event' },
  { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'signer', type: 'address' }], name: 'SignerAdded', type: 'event' },
  { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'signer', type: 'address' }], name: 'SignerRemoved', type: 'event' },
  {
    inputs: [{ internalType: 'bytes32', name: 'proposalId', type: 'bytes32' }],
    name: 'acceptAssignSigner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'signer', type: 'address' }],
    name: 'addSigner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'assignCandidateAccepted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'proposalId', type: 'bytes32' },
      { internalType: 'bytes[]', name: 'signatures', type: 'bytes[]' },
    ],
    name: 'executeProposal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'proposalId', type: 'bytes32' }],
    name: 'hashProposal',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'signer', type: 'address' }],
    name: 'isSigner',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'proposalIds',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proposalNonce',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'proposals',
    outputs: [
      { internalType: 'uint8', name: 'actionType', type: 'uint8' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
      { internalType: 'address', name: 'proposer', type: 'address' },
      { internalType: 'uint64', name: 'createdAt', type: 'uint64' },
      { internalType: 'uint64', name: 'executedAt', type: 'uint64' },
      { internalType: 'bool', name: 'executed', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'candidate', type: 'address' }],
    name: 'proposeAssignSigner',
    outputs: [{ internalType: 'bytes32', name: 'proposalId', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'signerToRevoke', type: 'address' }],
    name: 'proposeRevokeSigner',
    outputs: [{ internalType: 'bytes32', name: 'proposalId', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'targetContract', type: 'address' },
      { internalType: 'bytes32', name: 'roleId', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'bool', name: 'enabled', type: 'bool' },
    ],
    name: 'proposeSetContractRole',
    outputs: [{ internalType: 'bytes32', name: 'proposalId', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwnerCandidate', type: 'address' }],
    name: 'proposeTransferOwnership',
    outputs: [{ internalType: 'bytes32', name: 'proposalId', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'quorum',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'signer', type: 'address' }],
    name: 'removeSigner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'newQuorum', type: 'uint256' }],
    name: 'setQuorum',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'signerCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'proposalId', type: 'bytes32' },
      { internalType: 'bytes[]', name: 'signatures', type: 'bytes[]' },
    ],
    name: 'verifyOffchainApproval',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export function useHubGovernanceOffchain(contractAddress?: string) {
  const ethereum = getEthereum()

  const provider = useMemo(() => {
    if (!ethereum) return null
    return new BrowserProvider(ethereum)
  }, [ethereum])

  const getContract = useCallback(
    async (withSigner: boolean) => {
      if (!contractAddress) throw new Error('HubGovernanceOffchain address not set')
      if (!provider) throw new Error('Ethereum provider not available')
      const signerOrProvider: JsonRpcSigner | Provider = withSigner ? await provider.getSigner() : provider
      return new Contract(contractAddress, HUB_GOV_ABI, signerOrProvider)
    },
    [contractAddress, provider]
  )

  // Reads
  const getOwner = useCallback(async () => {
    const contract = await getContract(false)
    return contract.owner() as Promise<string>
  }, [getContract])

  const getQuorum = useCallback(async () => {
    const contract = await getContract(false)
    return contract.quorum() as Promise<bigint>
  }, [getContract])

  const getSignerCount = useCallback(async () => {
    const contract = await getContract(false)
    return contract.signerCount() as Promise<bigint>
  }, [getContract])

  const checkIsSigner = useCallback(
    async (signer: string) => {
      const contract = await getContract(false)
      return contract.isSigner(signer) as Promise<boolean>
    },
    [getContract]
  )

  const getProposal = useCallback(
    async (proposalId: string) => {
      const contract = await getContract(false)
      return contract.proposals(proposalId)
    },
    [getContract]
  )

  const getProposalIdByIndex = useCallback(
    async (index: bigint | number) => {
      const contract = await getContract(false)
      return contract.proposalIds(index)
    },
    [getContract]
  )

  const getProposalNonce = useCallback(async () => {
    const contract = await getContract(false)
    return contract.proposalNonce() as Promise<bigint>
  }, [getContract])

  const verifyOffchainApproval = useCallback(
    async (proposalId: string, signatures: string[]) => {
      const contract = await getContract(false)
      return contract.verifyOffchainApproval(proposalId, signatures) as Promise<boolean>
    },
    [getContract]
  )

  const isAdmin = useCallback(
    async (user: string) => {
      const contract = await getContract(false)
      const [owner, signer] = await Promise.all([contract.owner(), contract.isSigner(user)])
      return owner.toLowerCase() === user.toLowerCase() || signer
    },
    [getContract]
  )

  // Writes
  const proposeAssignSigner = useCallback(
    async (candidate: string) => {
      const contract = await getContract(true)
      // Precompute proposalId via static call to capture return value
      const proposalId = await contract.proposeAssignSigner.staticCall(candidate)
      const tx = await contract.proposeAssignSigner(candidate)
      const receipt = await tx.wait()
      return proposalId as string
    },
    [getContract]
  )

  const proposeRevokeSigner = useCallback(
    async (signer: string) => {
      const contract = await getContract(true)
      const proposalId = await contract.proposeRevokeSigner.staticCall(signer)
      const tx = await contract.proposeRevokeSigner(signer)
      const receipt = await tx.wait()
      return proposalId as string
    },
    [getContract]
  )

  const proposeSetContractRole = useCallback(
    async (targetContract: string, roleId: string, account: string, enabled: boolean) => {
      const contract = await getContract(true)
      const tx = await contract.proposeSetContractRole(targetContract, roleId, account, enabled)
      return tx.wait()
    },
    [getContract]
  )

  const proposeTransferOwnership = useCallback(
    async (newOwnerCandidate: string) => {
      const contract = await getContract(true)
      const proposalId = await contract.proposeTransferOwnership.staticCall(newOwnerCandidate)
      const tx = await contract.proposeTransferOwnership(newOwnerCandidate)
      const receipt = await tx.wait()
      return proposalId as string
    },
    [getContract]
  )

  const addSigner = useCallback(
    async (signer: string) => {
      const contract = await getContract(true)
      const tx = await contract.addSigner(signer)
      return tx.wait()
    },
    [getContract]
  )

  const removeSigner = useCallback(
    async (signer: string) => {
      const contract = await getContract(true)
      const tx = await contract.removeSigner(signer)
      return tx.wait()
    },
    [getContract]
  )

  const setQuorum = useCallback(
    async (newQuorum: bigint) => {
      const contract = await getContract(true)
      const tx = await contract.setQuorum(newQuorum)
      const receipt = await tx.wait()
      return receipt
    },
    [getContract]
  )

  const executeProposal = useCallback(
    async (proposalId: string, signatures: string[]) => {
      const contract = await getContract(true)
      const tx = await contract.executeProposal(proposalId, signatures)
      return tx.wait()
    },
    [getContract]
  )

  const acceptAssignSigner = useCallback(
    async (proposalId: string) => {
      const contract = await getContract(true)
      const tx = await contract.acceptAssignSigner(proposalId)
      return tx.wait()
    },
    [getContract]
  )

  const proposeSetRole = proposeSetContractRole

  return {
    provider,
    getOwner,
    getQuorum,
    getSignerCount,
    checkIsSigner,
    getProposal,
    getProposalIdByIndex,
    getProposalNonce,
    verifyOffchainApproval,
    isAdmin,
    proposeAssignSigner,
    proposeRevokeSigner,
    proposeSetRole,
    proposeTransferOwnership,
    addSigner,
    removeSigner,
    setQuorum,
    executeProposal,
    acceptAssignSigner,
  }
}
