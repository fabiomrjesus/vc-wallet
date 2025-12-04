import { Box, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FaHouse } from 'react-icons/fa6'
import PageHeader from '../../../components/PageHeader'
import { GenericTable } from '../../../components/vc-wallet/Table'
import { NewButton } from '../../../components/vc-wallet/buttons'
import { tenantColumns } from './TenantsPage.columns'
import { tenantMocks } from './TenantsPage.mocks'

export default function TenantsPage() {
  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader
        icon={<FaHouse color="white" size="2rem" />}
        title="Tenants"
        description="Manage wallet tenants and related settings."
      />
      <VStack w="100%" align="start" px="15%" py="1.5rem" gap={4} color ="black">
        <GenericTable
          topActions={<Box><Link to="/admin/tenants/new"><NewButton/></Link></Box>}
          columns={tenantColumns}
          data={tenantMocks}
          onView={tenant => console.log('View tenant', tenant.id)}
          onEdit={tenant => console.log('Edit tenant', tenant.id)}
          onDelete={tenant => console.log('Delete tenant', tenant.id)}
        />
      </VStack>
    </VStack>
  )
}
