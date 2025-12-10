import { Button, HStack } from '@chakra-ui/react'
import { FaCheckCircle, FaPlusCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import type { Issuer } from '../../../models/issuer'
import type { TableColumn } from '../../../components/vc-wallet/Table'

export const issuerColumns: TableColumn<Issuer>[] = [
  {
    id: 'name',
    header: 'Name',
    accessor: i => i.name,
    dataType: 'string',
    isOrderable: true,
    isFilterable: true,
  },
  {
    id: 'identifier',
    header: 'Identifier',
    accessor: i => i.identifier,
    dataType: 'string',
    isOrderable: true,
    isFilterable: true,
  },
  {
    id: 'tenant',
    header: 'Tenant',
    accessor: i => i.tenantName,
    dataType: 'string',
    isFilterable: true,
    render: (_, row) => (
      <Link to={`/admin/tenants/${row.tenantId}`} color="blue.600">
        {row.tenantName}
      </Link>
    ),
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
          variant="ghost"
          title="Allow Schema"
          colorScheme="blue"
          onClick={() => console.log('Allow schema for issuer', row.id)}
        >
          <FaPlusCircle />
        </Button>
        <Button
          size="xs"
          title="Can Issue?"
          variant="ghost"
          colorScheme="green"
          onClick={() => console.log('Check if issuer can issue schema', row.id)}
        >
          <FaCheckCircle />
        </Button>
      </HStack>
    ),
  },
]
