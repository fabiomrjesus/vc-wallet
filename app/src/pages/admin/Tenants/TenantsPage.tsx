import { Box, Card, HStack, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FaHouse } from 'react-icons/fa6'
import PageHeader from '../../../components/PageHeader'
import { GenericTable } from '../../../components/vc-wallet/Table'
import { NewButton } from '../../../components/vc-wallet/buttons'
import { tenantColumns } from './TenantsPage.columns'
import { tenantMocks } from './TenantsPage.mocks'
import { FaHome, FaPlus } from 'react-icons/fa'
import type { ReactElement } from 'react'

export default function TenantsPage() {
  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader
        icon={<FaHouse color="white" size="2rem" />}
        title="Tenants"
        description="Manage wallet tenants and related settings."
      />
      <HStack w="100%" px="4rem" py="2rem">
        <NewTenantCard/>
      </HStack>

      <VStack w="100%" align="start" px="15%" py="1.5rem" gap={4} color ="black">
        <GenericTable
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

export function NewTenantCard()
{
  return <OperationCard path={"new"} label={"New Tenant"} icon={<FaHouse/>}  
  />
}



export function OperationCard({path, label, description, icon}:{path:string, label:string, description?:string, icon:ReactElement})
{
  const Icon = icon;
  return <Link to={path}>
        <Card.Root w="10rem" h="8rem" variant="elevated">
          <Card.Header pb="1rem" fontSize="3rem" alignItems="center" w="100%">
            <HStack>
              {Icon}
            </HStack>
          </Card.Header>
          <Card.Footer w="100%" >
            <Text mx="auto" fontWeight="medium">{label}</Text>
          </Card.Footer>
          {description && <Card.Description>
            {description}
          </Card.Description>}
        </Card.Root>
      </Link>
      
}