import { HStack, VStack } from '@chakra-ui/react'
import { FaHouse, FaHouseChimneyUser, FaHouseCircleExclamation, FaHouseCircleXmark } from 'react-icons/fa6'
import PageHeader from '../../../components/PageHeader'
import { GenericTable } from '../../../components/vc-wallet/Table'
import { tenantColumns } from './TenantsPage.columns'
import { tenantMocks } from './TenantsPage.mocks'
import { OperationCard } from '../../../components/vc-wallet/cards'

export default function TenantsPage() {
  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader
        icon={<FaHouse color="white" size="2rem" />}
        title="Tenants"
        description="Manage wallet tenants and related settings."
      />
      <VStack px="8rem" w="100%" color="black">
        <HStack w="100%" py="2rem" gap="3rem">
          <NewTenantCard/>
          <InProgressCard/>
          <ReplaceTenantCard/>
          <RevokeTenantCard/>
        </HStack>

        <GenericTable
          columns={tenantColumns}
          data={tenantMocks}
          onView={tenant => console.log('View tenant', tenant.id)}
        />
      </VStack>
     
    </VStack>
  )
}

export function NewTenantCard()
{
  return <OperationCard path={"new"} label={"New Tenant"} description='Register a new Tenant' icon={<FaHouse/>}  
  />
}

export function InProgressCard()
{
  return <OperationCard path={"handshakes"} label={"In Progress"} description='Complete registrations' icon={<FaHouseCircleExclamation/>}  
  />
}

export function ReplaceTenantCard()
{
  return <OperationCard path={"replace"} label={"Replace Tenant"} description='Replace Tenant Account' icon={<FaHouseChimneyUser/>}  
  />
}

export function RevokeTenantCard()
{
  return <OperationCard path={"revoke"} label={"Revoke Tenant"} description='Revoke Tenant Account' icon={<FaHouseCircleXmark/>}  
  />
}

