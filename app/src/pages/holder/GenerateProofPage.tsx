import { VStack } from '@chakra-ui/react'
import { TbPencilCheck } from 'react-icons/tb'
import PageHeader from '../../components/PageHeader'

export default function GenerateProofPage() {
  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader
        icon={<TbPencilCheck color="white" size="2rem" />}
        title="Generate Proof"
        description="Create a proof from available claims."
      />
    </VStack>
  )
}
