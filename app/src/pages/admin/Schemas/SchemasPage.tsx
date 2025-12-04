import { Box, VStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { TbSchema } from 'react-icons/tb'
import PageHeader from '../../../components/PageHeader'
import { GenericTable } from '../../../components/vc-wallet/Table'
import { NewButton } from '../../../components/vc-wallet/buttons'
import { schemaColumns } from './SchemasPage.columns'
import { schemaMocks } from './SchemasPage.mocks'

export default function SchemasPage() {
  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader
        icon={<TbSchema color="white" size="2rem" />}
        title="Schemas"
        description="Define and manage credential schemas."
      />
      <VStack w="100%" align="start" px="15%" py="1.5rem" gap={4} color="black">
        <GenericTable
          topActions={<Box><RouterLink to="/admin/schemas/new"><NewButton/></RouterLink></Box>}
          columns={schemaColumns}
          data={schemaMocks}
          onView={schema => console.log('View schema', schema.id)}
          onEdit={schema => console.log('Edit schema', schema.id)}
          onDelete={schema => console.log('Delete schema', schema.id)}
        />
      </VStack>
    </VStack>
  )
}
