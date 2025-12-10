import { VStack, Text, Input, Button, Field } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import { FaNetworkWired } from 'react-icons/fa'
import { useHubGovernanceOffchain } from '../../hooks/useHubGovernanceOffchain'
import { useWalletContext } from '../../hooks/useWalletConnect'
import { useNavigate } from 'react-router-dom'
import { toaster } from '../../components/ui/toaster'

export default function SetQuorumPage() {
  const [value, setValue] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [signerCount, setSignerCount] = useState<bigint | null>(null)
  const navigate = useNavigate()
  const governanceAddress = import.meta.env.VITE_GOVERNANCE_CONTRACT as string | undefined
  const { setQuorum, getSignerCount } = useHubGovernanceOffchain(governanceAddress)
  const { account } = useWalletContext()

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const count = await getSignerCount()
        if (!ignore) setSignerCount(count)
      } catch {
        if (!ignore) setSignerCount(null)
      }
    }
    void load()
    return () => {
      ignore = true
    }
  }, [getSignerCount])

  const validate = (val: string) => {
    if (!val) return 'Enter a quorum value.'
    const num = Number(val)
    if (!Number.isFinite(num) || num <= 0) return 'Quorum must be greater than 0.'
    if (signerCount !== null && num >= Number(signerCount)) return 'Quorum must be less than signer count.'
    return null
  }

  const onSubmit = async () => {
    const validation = validate(value.trim())
    setError(validation)
    if (validation) return
    if (!account) {
      toaster.create({ type: 'error', title: 'Connect wallet', description: 'Please connect your wallet first.' })
      return
    }
    try {
      setSubmitting(true)
      const quorumVal = BigInt(value.trim())
      await setQuorum(quorumVal)
      toaster.create({ type: 'success', title: 'Quorum proposal submitted', description: `New quorum: ${value.trim()}` })
      navigate('/hub')
    } catch (err: any) {
      toaster.create({ type: 'error', title: 'Transaction failed', description: err?.message ?? 'Failed to submit proposal' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader icon={<FaNetworkWired color="white" size="2rem" />} title="Set Quorum" description="Propose new approval threshold." />
      <VStack px="8rem" py="2rem" w="100%" align="start">
        <Field.Root invalid={Boolean(error)} maxW="20rem">
          <Field.Label>New quorum value</Field.Label>
          <Input
            type="number"
            min={1}
            value={value}
            onChange={e => {
              setValue(e.target.value)
              if (error) setError(null)
            }}
            placeholder="e.g., 2"
          />
          {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
        {signerCount !== null && (
          <Text color="black" fontSize="sm">Signer count: {Number(signerCount)}</Text>
        )}
        <Button mt="1rem" colorScheme="blue" onClick={onSubmit} isLoading={submitting}>
          Submit Quorum Proposal
        </Button>
        <Text color="black" fontSize="sm" mt="0.5rem">
          Quorum must be greater than 0 and less than the total signer count.
        </Text>
      </VStack>
    </VStack>
  )
}
