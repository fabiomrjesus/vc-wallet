import { useEffect, useMemo, useState } from 'react'
import { VStack, Text, Table, HStack, Button, Spinner } from '@chakra-ui/react'
import PageHeader from '../../components/PageHeader'
import { RiListCheck } from 'react-icons/ri'
import { useHubGovernanceOffchain } from '../../hooks/useHubGovernanceOffchain'
import { useWalletContext } from '../../hooks/useWalletConnect'
import { ZeroHash } from 'ethers'
import { useNavigate } from 'react-router-dom'

type ProposalRow = {
  id: string
  actionType: number
  proposer: string
  createdAt: bigint
  executed: boolean
}

const actionTypeLabels: Record<number, string> = {
  0: 'AssignSigner',
  1: 'RevokeSigner',
  2: 'TransferOwnership',
  3: 'SetContractRole',
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
  const [proposals, setProposals] = useState<ProposalRow[]>([])
  const [loading, setLoading] = useState(false)
  const [admin, setAdmin] = useState(false)

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
          <Table.Root maxW="48rem" size="md">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>ID</Table.ColumnHeader>
                <Table.ColumnHeader>Type</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.map(row => (
                <Table.Row key={row.id}>
                  <Table.Cell fontFamily="mono">{shortId(row.id)}</Table.Cell>
                  <Table.Cell>{actionTypeLabels[row.actionType] ?? row.actionType}</Table.Cell>
                  <Table.Cell>
                    <HStack>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/hub/proposals/${row.id}`)}>
                        View
                      </Button>
                      {admin && (
                        <Button size="sm" colorScheme="blue" variant="solid">
                          Sign
                        </Button>
                      )}
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </VStack>
    </VStack>
  )
}
