import { VStack } from '@chakra-ui/react'
import { TbMessageCancel } from 'react-icons/tb'
import PageHeader from '../../components/PageHeader'

export default function RevokeClaimPage() {
  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader
        icon={<TbMessageCancel color="white" size="2rem" />}
        title="Revoke Claim"
        description="Revoke or invalidate an existing claim."
      />
    </VStack>
  )
}
