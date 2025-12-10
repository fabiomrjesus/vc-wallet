import { Button, HStack, Text } from '@chakra-ui/react'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import type { TableColumn } from '../../../components/vc-wallet/Table'
import type { CredentialSchema } from '../../../models/schema'

export const schemaColumns: TableColumn<CredentialSchema>[] = [
  {
    id: 'name',
    header: 'Name',
    accessor: s => s.name,
    dataType: 'string',
    isOrderable: true,
    isFilterable: true,
  },
  {
    id: 'version',
    header: 'Version',
    accessor: s => s.version,
    dataType: 'string',
    isOrderable: true,
    isFilterable: true,
  },
  {
    id: 'tenant',
    header: 'Tenant',
    accessor: s => s.tenantName,
    dataType: 'string',
    isFilterable: true,
    render: (_, row) => <Link to={`/admin/tenants/${row.tenantId}`}>{row.tenantName}</Link>,
  },
  {
    id: 'fields',
    header: '# Fields',
    accessor: s => s.fieldCount,
    dataType: 'number',
    isOrderable: true,
    render: value => <Text>{value as number}</Text>,
  },
  {
    id: 'actions',
    header: 'Actions',
    accessor: () => '',
    isActionColumn: true,
    showViewAction: true,
    showEditAction: true,
    showDeleteAction: true,
    renderCustomActions: row => (
      <HStack gap={1}>
        <Button
          size="xs"
          title="Add Field"
          variant="ghost"
          colorScheme="blue"
          onClick={() => console.log('Add field to schema', row.id)}
        >
          <FaPlusCircle />
        </Button>
        <Button
          size="xs"
          title="Remove Field"
          variant="ghost"
          colorScheme="red"
          onClick={() => console.log('Remove field from schema', row.id)}
        >
          <FaMinusCircle />
        </Button>
      </HStack>
    ),
  },
]
