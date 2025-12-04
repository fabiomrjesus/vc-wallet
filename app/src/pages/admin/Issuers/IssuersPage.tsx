import { Box, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { TbCertificate } from 'react-icons/tb'
import PageHeader from '../../../components/PageHeader'
import { GenericTable } from '../../../components/vc-wallet/Table'
import { NewButton } from '../../../components/vc-wallet/buttons'
import { issuerColumns } from './IssuersPage.columns'
import { issuerMocks } from './IssuersPage.mocks'

export default function IssuersPage() {
  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader
        icon={<TbCertificate color="white" size="2rem" />}
        title="Issuers"
        description="Manage issuers and related configuration."
      />
      <VStack w="100%" align="start" px="15%" py="1.5rem" gap={4} color="black">
        <GenericTable
          topActions={<Box><Link to="/admin/issuers/new"><NewButton/></Link></Box>}
          columns={issuerColumns}
          data={issuerMocks}
          onView={issuer => console.log('View issuer', issuer.id)}
          onEdit={issuer => console.log('Edit issuer', issuer.id)}
          onDelete={issuer => console.log('Delete issuer', issuer.id)}
        />
      </VStack>
    </VStack>
  )
}
