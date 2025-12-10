import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { VStack, Text, HStack, Spinner, Button, Tag } from '@chakra-ui/react'
import PageHeader from '../../components/PageHeader'
import { RiListCheck } from 'react-icons/ri'
import { useHubGovernanceOffchain } from '../../hooks/useHubGovernanceOffchain'
import { useWalletContext } from '../../hooks/useWalletConnect'
import { AbiCoder, getAddress } from 'ethers'

type Proposal = {
  actionType: number
  data: string
  executed: boolean
}

const actionTypeLabels: Record<number, string> = {
  0: 'AssignSigner',
  1: 'RevokeSigner',
  2: 'TransferOwnership',
  3: 'SetContractRole',
}

export default function ProposalDetailPage() {
  const { proposalId } = useParams<{ proposalId: string }>()
  const governanceAddress = import.meta.env.VITE_GOVERNANCE_CONTRACT as string | undefined
  const { getProposal, getQuorum, isAdmin } = useHubGovernanceOffchain(governanceAddress)
  const { account } = useWalletContext()

  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [quorum, setQuorum] = useState<bigint | null>(null)
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    let ignore = false
    async function load() {
      if (!proposalId || !governanceAddress) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const [p, q] = await Promise.all([getProposal(proposalId), getQuorum()])
        if (!ignore) {
          setProposal({
            actionType: Number(p.actionType),
            data: p.data,
            executed: p.executed,
          })
          setQuorum(q)
        }
      } catch {
        if (!ignore) {
          setProposal(null)
          setQuorum(null)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    void load()
    return () => {
      ignore = true
    }
  }, [getProposal, getQuorum, governanceAddress, proposalId])

  useEffect(() => {
    let ignore = false
    async function check() {
      if (!account || !governanceAddress) {
        setAdmin(false)
        return
      }
      try {
        const ok = await isAdmin(account)
        if (!ignore) setAdmin(ok)
      } catch {
        if (!ignore) setAdmin(false)
      }
    }
    void check()
    return () => {
      ignore = true
    }
  }, [account, governanceAddress, isAdmin])

  const signaturesInfo = useMemo(() => {
    const required = quorum ? Number(quorum) : 0
    // Off-chain signatures are not tracked on-chain; placeholder count is 0.
    return { collected: 0, required }
  }, [quorum])
  const actionLabel = proposal ? actionTypeLabels[proposal.actionType] ?? 'Unknown' : 'Unknown'
  const assignCandidate = useMemo(() => {
    if (!proposal || proposal.actionType !== 0) return null
    if (!proposal.data || proposal.data === '0x') return null
    try {
      const coder = new AbiCoder()
      const [addr] = coder.decode(['address'], proposal.data) as [string]
      return getAddress(addr)
    } catch {
      return null
    }
  }, [proposal])

  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader
        icon={<RiListCheck color="white" size="2rem" />}
        title="Proposal Details"
        description="Review proposal information."
      />
      <VStack px="8rem" py="2rem" w="100%" align="start" gap="1rem">
        {loading ? (
          <HStack color="black">
            <Spinner size="sm" />
            <Text>Loading proposal...</Text>
          </HStack>
        ) : proposal ? (
          <>
            <HStack>
              <Text color="black" fontWeight="semibold">
                Proposal ID:
              </Text>
              <Text color="black" fontFamily="mono">
                {proposalId}
              </Text>
            </HStack>
            <HStack>
              <Text color="black" fontWeight="semibold">
                Type:
              </Text>
              <Tag.Root colorScheme="blue">
                <Tag.Label>{actionLabel}</Tag.Label>
              </Tag.Root>
            </HStack>
            {assignCandidate && (
              <HStack>
                <Text color="black" fontWeight="semibold">
                  Proposed signer:
                </Text>
                <Text color="black" fontFamily="mono">
                  {assignCandidate}
                </Text>
              </HStack>
            )}
            <HStack>
              <Text color="black" fontWeight="semibold">
                Executed:
              </Text>
              <Tag.Root colorScheme={proposal.executed ? 'green' : 'orange'}>
                <Tag.Label>
                  {proposal.executed ? 'Yes' : 'Pending'}
                </Tag.Label>
              </Tag.Root>
            </HStack>
            <HStack>
              <Text color="black" fontWeight="semibold">
                Signatures:
              </Text>
              <Text color="black">
                {signaturesInfo.collected} / {signaturesInfo.required || 'N/A'}
              </Text>
            </HStack>
            {admin && (
              <Button colorScheme="blue" onClick={() => { /* to be implemented */ }}>
                Sign Proposal
              </Button>
            )}
          </>
        ) : (
          <Text color="black">Proposal not found or unavailable.</Text>
        )}
      </VStack>
    </VStack>
  )
}
