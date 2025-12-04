import { VStack } from '@chakra-ui/react'
import { TbMessage2Plus } from 'react-icons/tb'
import PageHeader from '../../components/PageHeader'

export default function IssueClaimPage() {
  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader
        icon={<TbMessage2Plus color="white" size="2rem" />}
        title="Issue Claim"
        description="Issue a new claim to a holder."
      />
    </VStack>
  )
}
