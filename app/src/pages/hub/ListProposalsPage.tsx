import { useEffect, useMemo, useState, useCallback } from 'react'
import { VStack, Text, Table, HStack, Button, Spinner, Spacer, Badge } from '@chakra-ui/react'
import PageHeader from '../../components/PageHeader'
import { RiListCheck } from 'react-icons/ri'
import { useHubGovernanceOffchain } from '../../hooks/useHubGovernanceOffchain'
import { useWalletContext } from '../../hooks/useWalletConnect'
import { ZeroHash } from 'ethers'
import { useNavigate } from 'react-router-dom'
import { actionTypeColor, actionTypeIcon, actionTypeLabel } from '../../support/normalize'
import { signProposalId } from '../../support/signatures'
import { useHubApi } from '../../hooks/useHubApi'

type ProposalRow = {
  id: string
  actionType: number
  proposer: string
  createdAt: bigint
  executed: boolean
}

const shortId = (id: string) => {
  if (!id) return ''
  if (id.length <= 10) return id
  return `${id.slice(0, 6)}...${id.slice(-4)}`
}

export default function ListProposalsPage() {
  const governanceAddress = import.meta.env.VITE_GOVERNANCE_CONTRACT as string | undefined
  const { provider, isAdmin, getProposal, getProposalIdByIndex, getProposalNonce } = useHubGovernanceOffchain(governanceAddress)
  const { account } = useWalletContext()
  const navigate = useNavigate()
  const { signProposal } = useHubApi()
  const [proposals, setProposals] = useState<ProposalRow[]>([])
  const [loading, setLoading] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [signingId, setSigningId] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    async function load() {
      if (!provider || !governanceAddress) return
      setLoading(true)
      try {
        const nonce = await getProposalNonce()
        const items: ProposalRow[] = []
        for (let i = 0n; i < nonce; i++) {
          const id = await getProposalIdByIndex(i)
          if (!id || id === ZeroHash) continue
          const p = await getProposal(id)
          items.push({
            id,
            actionType: Number(p.actionType),
            proposer: p.proposer,
            createdAt: p.createdAt,
            executed: p.executed,
          })
        }
        if (!ignore) setProposals(items)
      } catch {
        if (!ignore) setProposals([])
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    void load()
    return () => {
      ignore = true
    }
  }, [getProposal, getProposalIdByIndex, getProposalNonce, governanceAddress, provider])

  useEffect(() => {
    let ignore = false
    async function checkAdmin() {
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
    void checkAdmin()
    return () => {
      ignore = true
    }
  }, [account, governanceAddress, isAdmin])

  const rows = useMemo(() => proposals, [proposals])

  const sign = useCallback(
    async (proposalId: string) => {
      if (!provider) return
      try {
        setSigningId(proposalId)
        const signer = await provider.getSigner()
        const sig = await signProposalId(proposalId, signer)
        await signProposal(proposalId, { signerAddress: sig.signer, signature: sig.signature })
      } finally {
        setSigningId(null)
      }
    },
    [provider, signProposal]
  )

  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader icon={<RiListCheck color="white" size="2rem" />} title="Proposals" description="Review and execute proposals." />
      <VStack px="8rem" py="2rem" w="100%" align="start" gap="1rem">
        {loading ? (
          <HStack color="black">
            <Spinner size="sm" />
            <Text>Loading proposals...</Text>
          </HStack>
        ) : rows.length === 0 ? (
          <Text color="black">No proposals found.</Text>
        ) : (
          <Table.Root>
            <Table.Header>
              <Table.Row bg="transparent" color="#000000">
                <Table.ColumnHeader w="0" color="#000000">ID</Table.ColumnHeader>
                <Table.ColumnHeader w="0" color="#000000">Type</Table.ColumnHeader>
                <Table.ColumnHeader color="#000000">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.map((row, idx) => {
                
                const actionLabel = actionTypeLabel(row.actionType)
                const actionColor = actionTypeColor(row.actionType)
                const actionIcon = actionTypeIcon(row.actionType)

                return <Table.Row key={row.id} bg={(idx % 2 ) == 0 ? "transparent":"#e3e3e3"} color="#000000">
                  <Table.Cell w="0" fontFamily="mono">{shortId(row.id)}</Table.Cell>
                  <Table.Cell w="0" textWrap="nowrap">
                    <Badge py="0.5rem" px="0.5rem" colorPalette={actionColor}>
                        {actionIcon}
                        <Text>{actionLabel}</Text>
                    </Badge>
                  </Table.Cell>
                  <Table.Cell w="100%">
                    <HStack w="100%">
                      <Spacer/>
                      <Button size="sm" variant="subtle" onClick={() => navigate(`/hub/proposals/${row.id}`)}>
                        View
                      </Button>
                      {admin && (
                        <Button
                          size="sm"
                          variant="surface"
                          onClick={() => sign(row.id)}
                        >
                          Sign
                        </Button>
                      )}
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              })}
            </Table.Body>
          </Table.Root>
        )}
      </VStack>
    </VStack>
  )
}
