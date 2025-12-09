import { useCallback, useMemo } from 'react'
import { BrowserProvider, Contract, JsonRpcSigner, type Provider } from 'ethers'

export type Profile = {
  name: string
  recordId: string
  photoId: string
}

const PROFILE_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'photoId', type: 'string' },
      { internalType: 'string', name: 'recordId', type: 'string' },
    ],
    name: 'addProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getProfile',
    outputs: [
      {
        components: [
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'recordId', type: 'string' },
          { internalType: 'string', name: 'photoId', type: 'string' },
        ],
        internalType: 'struct ProfileContract.Profile',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

function getEthereum() {
  return (window as typeof window & { ethereum?: unknown }).ethereum as
    | {
        request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      }
    | undefined
}

export function useEthUserBadge(contractAddress: string | undefined) {
  const ethereum = getEthereum()

  const provider = useMemo(() => {
    if (!ethereum) return null
    return new BrowserProvider(ethereum)
  }, [ethereum])

  const getContract = useCallback(
    async (withSigner: boolean) => {
      if (!contractAddress) throw new Error('Profile contract address not set')
      if (!provider) throw new Error('Ethereum provider not available')
      const signerOrProvider: JsonRpcSigner | Provider = withSigner ? await provider.getSigner() : provider
      return new Contract(contractAddress, PROFILE_ABI, signerOrProvider)
    },
    [contractAddress, provider]
  )

  const registerUser = useCallback(
    async (user: string, name: string, photoId: string, recordId: string) => {
      const contract = await getContract(true)
      const tx = await contract.addProfile(user, name, photoId, recordId)
      return tx.wait()
    },
    [getContract]
  )

  const getBadge = useCallback(
    async (user: string): Promise<Profile> => {
      const contract = await getContract(false)
      const profile = await contract.getProfile(user)
      return {
        name: profile.name,
        recordId: profile.recordId,
        photoId: profile.photoId,
      } as Profile
    },
    [getContract]
  )

  return { registerUser, getBadge, provider }
}
