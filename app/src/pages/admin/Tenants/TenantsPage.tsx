import { Card, HStack, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FaHouse, FaHouseChimneyUser, FaHouseCircleExclamation, FaHouseCircleXmark } from 'react-icons/fa6'
import PageHeader from '../../../components/PageHeader'
import { GenericTable } from '../../../components/vc-wallet/Table'
import { tenantColumns } from './TenantsPage.columns'
import { tenantMocks } from './TenantsPage.mocks'
import type { ReactElement } from 'react'

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

export function OperationCard({path, label, description, icon}:{path:string, label:string, description?:string, icon:ReactElement})
{
  const Icon = icon;
  return <Link to={path}>
        <Card.Root w="8rem" h="7rem" variant="elevated">
          <Card.Body w="100%" gap="1">
            <HStack mx="auto" fontSize="2rem">
              {Icon}
            </HStack>
            <Text textWrap="nowrap" mx="auto"  fontSize="0.75rem" fontWeight="medium">{label}</Text>
            <Text textWrap="nowrap" mx="auto" fontSize="0.55rem" fontWeight="light" color="#666666">{description}</Text>
          </Card.Body>
        </Card.Root>
      </Link>
      
}