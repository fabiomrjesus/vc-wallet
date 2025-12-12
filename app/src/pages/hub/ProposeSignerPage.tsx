import { VStack, Text, Input, Field } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserPlus } from 'react-icons/fa'
import PageHeader from '../../components/PageHeader'
import { useHubGovernanceOffchain } from '../../hooks/useHubGovernanceOffchain'
import { isAddress, ZeroAddress } from 'ethers'
import { useWalletContext } from '../../hooks/useWalletConnect'
import { toaster } from '../../components/ui/toaster'
import { LoadingButton } from '../../components/vc-wallet/buttons'

export default function ProposeSignerPage() {
  const [candidate, setCandidate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const governanceAddress = import.meta.env.VITE_GOVERNANCE_CONTRACT as string | undefined
  const { proposeAssignSigner } = useHubGovernanceOffchain(governanceAddress)
  const { account } = useWalletContext()

  const validate = (addr: string) => {
    if (!addr || !isAddress(addr)) return 'Enter a valid Ethereum address.'
    if (addr.toLowerCase() === ZeroAddress) return 'Zero address is not allowed.'
    return null
  }

  const onSubmit = async () => {
    const validation = validate(candidate.trim())
    setError(validation)
    if (validation) return
    if (!account) {
      toaster.create({ type: 'error', title: 'Connect wallet', description: 'Please connect your wallet first.' })
      return
    }
    try {
      setSubmitting(true)
      const proposalId = await proposeAssignSigner(candidate.trim())
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
      <PageHeader icon={<FaUserPlus color="white" size="2rem" />} title="Propose Signer" description="Nominate a new signer proposal." />
      <VStack px="8rem" py="2rem" w="100%" align="start">
        <Field.Root invalid={Boolean(error)} maxW="24rem">
          <Field.Label>Signer address</Field.Label>
          <Input
            value={candidate}
            onChange={e => {
              setCandidate(e.target.value)
              if (error) setError(null)
            }}
            placeholder="0x..."
          />
          {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
        <LoadingButton loading={submitting} mt="1rem" colorScheme="blue" onClick={onSubmit}>
          Submit Proposal
        </LoadingButton>
        <Text color="black" fontSize="sm" mt="0.5rem">
          This will create a proposal requiring quorum approval to add the signer.
        </Text>
      </VStack>
    </VStack>
  )
}
