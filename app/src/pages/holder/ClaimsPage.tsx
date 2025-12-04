import { VStack } from '@chakra-ui/react'
import { LuScrollText } from 'react-icons/lu'
import PageHeader from '../../components/PageHeader'

export default function HolderClaimsPage() {
  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader
        icon={<LuScrollText color="white" size="2rem" />}
        title="Holder Claims"
        description="Inspect the claims you currently hold."
      />
    </VStack>
  )
}
