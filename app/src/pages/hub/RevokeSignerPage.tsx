import { VStack, Text, Input, Field } from '@chakra-ui/react'
import { useState } from 'react'
import { FaUserMinus } from 'react-icons/fa'
import PageHeader from '../../components/PageHeader'
import { useHubGovernanceOffchain } from '../../hooks/useHubGovernanceOffchain'
import { useWalletContext } from '../../hooks/useWalletConnect'
import { isAddress, ZeroAddress } from 'ethers'
import { useNavigate } from 'react-router-dom'
import { toaster } from '../../components/ui/toaster'
import { LoadingButton } from '../../components/vc-wallet/buttons'

export default function RevokeSignerPage() {
  const [target, setTarget] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const governanceAddress = import.meta.env.VITE_GOVERNANCE_CONTRACT as string | undefined
  const { proposeRevokeSigner } = useHubGovernanceOffchain(governanceAddress)
  const { account } = useWalletContext()

  const validate = (addr: string) => {
    if (!addr || !isAddress(addr)) return 'Enter a valid Ethereum address.'
    if (addr.toLowerCase() === ZeroAddress.toLowerCase()) return 'Zero address is not allowed.'
    if (account && addr.toLowerCase() === account.toLowerCase()) return 'You cannot revoke yourself.'
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
      const proposalId = await proposeRevokeSigner(target.trim())
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
      <PageHeader icon={<FaUserMinus color="white" size="2rem" />} title="Revoke Signer" description="Propose to revoke signer access." />
      <VStack color="black" px="8rem" py="2rem" w="100%" align="start">
        <Field.Root invalid={Boolean(error)} maxW="24rem">
          <Field.Label>Signer address to revoke</Field.Label>
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
        <LoadingButton loading={submitting} mt="1rem" colorScheme="blue" onClick={onSubmit}>
          Submit Proposal
        </LoadingButton>
        <Text color="black" fontSize="sm" mt="0.5rem">
          This will create a proposal to remove the signer.
        </Text>
      </VStack>
    </VStack>
  )
}
