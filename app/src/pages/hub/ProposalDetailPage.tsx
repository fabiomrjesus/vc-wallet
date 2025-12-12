import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { VStack, Text, HStack, Spinner, DataList, Badge } from '@chakra-ui/react'
import PageHeader from '../../components/PageHeader'
import { RiListCheck } from 'react-icons/ri'
import { useHubGovernanceOffchain } from '../../hooks/useHubGovernanceOffchain'
import { useWalletContext } from '../../hooks/useWalletConnect'
import { AbiCoder, getAddress, getBytes } from 'ethers'
import { actionTypeColor, actionTypeIcon, actionTypeLabel } from '../../support/normalize'
import { useHubApi, type ProposalSignatureDto } from '../../hooks/useHubApi'
import { toaster } from '../../components/ui/toaster'
import { LoadingButton } from '../../components/vc-wallet/buttons'
import { signProposalId } from '../../support/signatures'

type Proposal = {
  actionType: number
  data: string
  executed: boolean
}

export default function ProposalDetailPage() {
  const { proposalId } = useParams<{ proposalId: string }>()
  const governanceAddress = import.meta.env.VITE_GOVERNANCE_CONTRACT as string | undefined
  const { provider, acceptAssignSigner, getAssignCandidateAccepted, getProposal, getQuorum, isAdmin, executeProposal: executeOnChain } =
    useHubGovernanceOffchain(governanceAddress)
  const { account } = useWalletContext()
  const { getSignatures, signProposal } = useHubApi()

  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [quorum, setQuorum] = useState<bigint | null>(null)
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)
  const [signatures, setSignatures] = useState<ProposalSignatureDto[]>([])
  const [signing, setSigning] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [accepting, setAccepting] = useState(false)
  const [candidateAccepted, setCandidateAccepted] = useState(false)

  useEffect(() => {
    let ignore = false
    async function load() {
      if (!proposalId || !governanceAddress) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const [p, q, accepted] = await Promise.all([
          getProposal(proposalId),
          getQuorum(),
          getAssignCandidateAccepted(proposalId),
        ])
        if (!ignore) {
          setProposal({
            actionType: Number(p.actionType),
            data: p.data,
            executed: p.executed,
          })
          setQuorum(q)
          setCandidateAccepted(Boolean(accepted))
          const sigs = await getSignatures(proposalId)
          setSignatures(sigs)
        }
      } catch {
        if (!ignore) {
          setProposal(null)
          setQuorum(null)
          setCandidateAccepted(false)
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
  }, [getProposal, getQuorum, getSignatures, governanceAddress, proposalId])

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
    const collected = signatures.length
    return { collected, required }
  }, [quorum, signatures])
  const hasSigned = useMemo(() => {
    if (!account) return false
    return signatures.some(s => s.signerAddress?.toLowerCase() === account.toLowerCase())
  }, [account, signatures])
  const actionLabel = proposal ? actionTypeLabel(proposal.actionType) : 'Unknown'
  const actionColor = proposal ? actionTypeColor(proposal.actionType) : 'gray'
  const actionIcon = proposal ? actionTypeIcon(proposal.actionType) : null
  const assignCandidate = useMemo(() => {
    if (!proposal || proposal.actionType < 0 || proposal.actionType > 4) return null
    if (!proposal.data || proposal.data === '0x') return null
    try {
      const coder = new AbiCoder()
      const [addr] = coder.decode(['address'], proposal.data) as Array<string>
      console.log(addr)
      return getAddress(addr)
    } catch {
      return null
    }
  }, [proposal])

  const isCandidate = useMemo(() => {
    if (!assignCandidate || !account) return false
    return assignCandidate.toLowerCase() === account.toLowerCase()
  }, [assignCandidate, account])

  const handleSign = async () => {
    if (!proposalId || !account || !provider || !governanceAddress) return
    try {
      setSigning(true)
      const signer = await provider.getSigner()
      const { signature, signer: signerAddress } = await signProposalId(proposalId, signer, governanceAddress)
      const sig = await signProposal(proposalId, { signerAddress, signature })
      console.log(sig);
      setSignatures(prev => [...prev, sig])
      toaster.create({ title: 'Signature submitted', description: 'Your signature has been recorded.', type:"success" })
    } catch (err) {
      console.log(err)
      toaster.create({ title: 'Failed to sign', description: err instanceof Error ? err.message : 'Unknown error', type:'error' })
    } finally {
      setSigning(false)
    }
  }

  const handleExecute = async () => {
    if (!proposalId) return
    try {
      setExecuting(true)
      const latest = await getSignatures(proposalId)
      console.log(latest)
      const signaturesBytes = latest.map(s => getBytes(s.signature))
      // Debug: log payload before executing on-chain
      console.log('Executing proposal', { proposalId, signatures: latest, signaturesBytes })
      await executeOnChain(proposalId, signaturesBytes)
      toaster.create({ title: 'Execution submitted', description: 'The proposal execution was triggered.', type:"success" })
      // Reload proposal state after execution
      const refreshed = await getProposal(proposalId)
      setProposal({
        actionType: Number(refreshed.actionType),
        data: refreshed.data,
        executed: refreshed.executed,
      })
    } catch (err) {
      toaster.create({ title: 'Failed to execute', description: err instanceof Error ? err.message : 'Unknown error', type:'error' })
    } finally {
      setExecuting(false)
    }
  }

  const handleAcceptCandidate = async () => {
    if (!proposalId) return
    try {
      setAccepting(true)
      await acceptAssignSigner(proposalId)
      toaster.create({ title: 'Candidacy accepted', description: 'You accepted the signer candidacy.', type: 'success' })
    } catch (err) {
      toaster.create({ title: 'Failed to accept', description: err instanceof Error ? err.message : 'Unknown error', type: 'error' })
    } finally {
      setAccepting(false)
    }
  }
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
              <DataList.ItemLabel w="12rem">
                <Text w="100%"  textAlign="end" color="black">
                  ID
                </Text>
              </DataList.ItemLabel>
              <DataList.ItemValue color="black" textAlign="end" fontWeight={200} fontSize="0.85rem">{proposalId}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel w="12rem" color="black" textAlign="end">
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
                <DataList.ItemLabel w="12rem" color="black" textAlign="end">
                  <Text w="100%" textAlign="end" color="black">
                    Proposed signer to {proposal.actionType === 0 ? 'assign' : proposal.actionType === 1 ? 'remove':"transfer ownership to"}
                  </Text>
                </DataList.ItemLabel>
                <DataList.ItemValue color="black" textAlign="end" fontWeight={200} fontSize="0.85rem">{assignCandidate}</DataList.ItemValue>
              </DataList.Item>
            )}
            <DataList.Item>
              <DataList.ItemLabel w="12rem" color="black" textAlign="end">
                <Text w="100%" textAlign="end" color="black">
                Executed
                </Text>
              </DataList.ItemLabel>
              <DataList.ItemValue color="black" textAlign="end" fontWeight={200} fontSize="0.85rem">{proposal.executed ? 'Yes' : 'Pending'}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel w="12rem" color="black" textAlign="end">
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
                <DataList.ItemLabel w="12rem" color="black" textAlign="end">
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
            {admin && !hasSigned && (
              <DataList.Item>
                <DataList.ItemLabel w="12rem" color="black" textAlign="end" />
                <DataList.ItemValue>
                  <LoadingButton variant="surface" onClick={handleSign} loading={signing}>
                    Sign Proposal
                  </LoadingButton>
                </DataList.ItemValue>
              </DataList.Item>
            )}
            {isCandidate && !proposal?.executed && !candidateAccepted && (
              <DataList.Item>
                <DataList.ItemLabel w="12rem" color="black" textAlign="end" />
                <DataList.ItemValue>
                  <LoadingButton variant="surface" colorPalette="blue" onClick={handleAcceptCandidate} loading={accepting}>
                    Accept Candidacy
                  </LoadingButton>
                </DataList.ItemValue>
              </DataList.Item>
            )}
            {admin && !proposal?.executed && signaturesInfo.required > 0 && signaturesInfo.collected >= signaturesInfo.required && (
              <DataList.Item>
                <DataList.ItemLabel w="12rem" color="black" textAlign="end" />
                <DataList.ItemValue>
                  <LoadingButton variant="solid" colorPalette="green" onClick={handleExecute} loading={executing}>
                    Execute Proposal
                  </LoadingButton>
                </DataList.ItemValue>
              </DataList.Item>
            )}
          </DataList.Root>
        ) : (
          <Text color="black">Proposal not found or unavailable.</Text>
        )}
      </VStack>
    </VStack>
  )
}
