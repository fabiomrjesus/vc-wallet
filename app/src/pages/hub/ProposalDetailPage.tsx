import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { VStack, Text, HStack, Spinner, Button, Tag, DataList, Badge } from '@chakra-ui/react'
import PageHeader from '../../components/PageHeader'
import { RiListCheck } from 'react-icons/ri'
import { useHubGovernanceOffchain } from '../../hooks/useHubGovernanceOffchain'
import { useWalletContext } from '../../hooks/useWalletConnect'
import { AbiCoder, getAddress } from 'ethers'
import { actionTypeColor, actionTypeIcon, actionTypeLabel } from '../../support/normalize'
import { useHubApi, type ProposalSignatureDto } from '../../hooks/useHubApi'

type Proposal = {
  actionType: number
  data: string
  executed: boolean
}

export default function ProposalDetailPage() {
  const { proposalId } = useParams<{ proposalId: string }>()
  const governanceAddress = import.meta.env.VITE_GOVERNANCE_CONTRACT as string | undefined
  const { getProposal, getQuorum, isAdmin } = useHubGovernanceOffchain(governanceAddress)
  const { account } = useWalletContext()
  const { getSignatures } = useHubApi()

  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [quorum, setQuorum] = useState<bigint | null>(null)
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)
  const [signatures, setSignatures] = useState<ProposalSignatureDto[]>([])

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
          const sigs = await getSignatures(proposalId)
          setSignatures(sigs)
        }
      } catch {
        if (!ignore) {
          setProposal(null)
          setQuorum(null)
          setSignatures([])
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
    return { collected: 0, required }
  }, [quorum])
  const actionLabel = proposal ? actionTypeLabel(proposal.actionType) : 'Unknown'
  const actionColor = proposal ? actionTypeColor(proposal.actionType) : 'gray'
  const actionIcon = proposal ? actionTypeIcon(proposal.actionType) : null
  const assignCandidate = useMemo(() => {
    if (!proposal || proposal.actionType !== 0) return null
    if (!proposal.data || proposal.data === '0x') return null
    try {
      const coder = new AbiCoder()
      const [addr] = coder.decode(['address'], proposal.data) as Array<string>
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
      <VStack px="8rem" py="4rem" w="100%" align="start" gap="1rem">
        {loading ? (
          <HStack color="black">
            <Spinner size="sm" />
            <Text>Loading proposal...</Text>
          </HStack>
        ) : proposal ? (
          <DataList.Root orientation="horizontal" variant="bold">
            <DataList.Item>
              <DataList.ItemLabel w="7rem">
                <Text w="100%"  textAlign="end" color="black">
                  ID
                </Text>
              </DataList.ItemLabel>
              <DataList.ItemValue color="black" textAlign="end" fontWeight={200} fontSize="0.85rem">{proposalId}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel w="7rem" color="black" textAlign="end">
                <Text w="100%" textAlign="end" color="black">
                  Type
                </Text>
              </DataList.ItemLabel>
              <DataList.ItemValue color="black" textAlign="end" fontWeight={200} fontSize="0.85rem">
                <Badge py="0.5rem" px="0.5rem" colorPalette={actionColor}>
                      {actionIcon}
                      <Text>{actionLabel}</Text>
                </Badge>
              </DataList.ItemValue>
            </DataList.Item>
            {assignCandidate && (
              <DataList.Item>
                <DataList.ItemLabel w="7rem" color="black" textAlign="end">
                  <Text w="100%" textAlign="end" color="black">
                    Proposed signer
                  </Text>
                </DataList.ItemLabel>
                <DataList.ItemValue color="black" textAlign="end" fontWeight={200} fontSize="0.85rem">{assignCandidate}</DataList.ItemValue>
              </DataList.Item>
            )}
            <DataList.Item>
              <DataList.ItemLabel w="7rem" color="black" textAlign="end">
                <Text w="100%" textAlign="end" color="black">
                Executed
                </Text>
              </DataList.ItemLabel>
              <DataList.ItemValue color="black" textAlign="end" fontWeight={200} fontSize="0.85rem">{proposal.executed ? 'Yes' : 'Pending'}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel w="7rem" color="black" textAlign="end">
                <Text w="100%" textAlign="end" color="black">
                  Signatures    
                </Text>
              </DataList.ItemLabel>
              <DataList.ItemValue color="black" textAlign="end" fontWeight={200} fontSize="0.85rem">
                {signatures.length} / {signaturesInfo.required || 'N/A'}
              </DataList.ItemValue>
            </DataList.Item>
            {signatures.map(sig => (
              <DataList.Item key={sig.id}>
                <DataList.ItemLabel w="7rem" color="black" textAlign="end">
                  <Text w="100%" textAlign="end" color="black">
                    Voter
                  </Text>
                </DataList.ItemLabel>
                <DataList.ItemValue color="black" textAlign="end" fontWeight={200} fontSize="0.85rem">
                  <Text fontFamily="mono">{sig.signerAddress ?? 'Unknown'}</Text>
                  <Text fontSize="0.75rem" color="gray.600">{new Date(sig.createdAt).toLocaleString()}</Text>
                </DataList.ItemValue>
              </DataList.Item>
            ))}
            {admin && <DataList.Item>
              <DataList.ItemLabel w="7rem" color="black" textAlign="end" />
              <DataList.ItemValue>
                <Button variant="surface">
                  Sign Proposal
              </Button>
              </DataList.ItemValue>
            </DataList.Item>}
          </DataList.Root>
        ) : (
          <Text color="black">Proposal not found or unavailable.</Text>
        )}
      </VStack>
    </VStack>
  )
}
