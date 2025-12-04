import { VStack } from '@chakra-ui/react'
import { FaCheckDouble } from 'react-icons/fa'
import PageHeader from '../../components/PageHeader'

export default function VerifyProofPage() {
  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader
        icon={<FaCheckDouble color="white" size="2rem" />}
        title="Verify Proof"
        description="Validate proofs received from holders."
      />
    </VStack>
  )
}
