import { VStack, Text, Input, Field  } from '@chakra-ui/react'
import { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import { GiHouseKeys } from 'react-icons/gi'
import { useHubGovernanceOffchain } from '../../hooks/useHubGovernanceOffchain'
import { useWalletContext } from '../../hooks/useWalletConnect'
import { isAddress, ZeroAddress } from 'ethers'
import { useNavigate } from 'react-router-dom'
import { toaster } from '../../components/ui/toaster'
import { LoadingButton } from '../../components/vc-wallet/buttons'

export default function TransferOwnershipPage() {
  const [target, setTarget] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const governanceAddress = import.meta.env.VITE_GOVERNANCE_CONTRACT as string | undefined
  const { proposeTransferOwnership } = useHubGovernanceOffchain(governanceAddress)
  const { account } = useWalletContext()

  const validate = (addr: string) => {
    if (!addr || !isAddress(addr)) return 'Enter a valid Ethereum address.'
    if (addr.toLowerCase() === ZeroAddress.toLowerCase()) return 'Zero address is not allowed.'
    return null
  }

  const onSubmit = async () => {
    const validation = validate(target.trim())
    setError(validation)
    if (validation) return
    if (!account) {
      toaster.create({ type: 'error', title: 'Connect wallet', description: 'Please connect your wallet first.' })
      return
    }
    try {
      setSubmitting(true)
      const proposalId = await proposeTransferOwnership(target.trim())
      toaster.create({ type: 'success', title: 'Proposal submitted', description: `Proposal ID: ${proposalId}` })
      navigate(`/hub/proposals/${proposalId}`)
    } catch (err: any) {
      toaster.create({ type: 'error', title: 'Transaction failed', description: err?.message ?? 'Failed to submit proposal' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader icon={<GiHouseKeys color="white" size="2rem" />} title="Transfer Ownership" description="Propose ownership transfer." />
      <VStack px="8rem" py="2rem" w="100%" align="start">
        <Field.Root invalid={Boolean(error)} maxW="24rem">
          <Field.Label>New owner address</Field.Label>
          <Input
            value={target}
            onChange={e => {
              setTarget(e.target.value)
              if (error) setError(null)
            }}
            placeholder="0x..."
          />
          {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
        <LoadingButton mt="1rem" colorScheme="blue" onClick={onSubmit} loading={submitting}>
          Submit Proposal
        </LoadingButton>
        <Text color="black" fontSize="sm" mt="0.5rem">
          This will create a proposal to transfer contract ownership.
        </Text>
      </VStack>
    </VStack>
  )
}
