import { Text } from '@chakra-ui/react'
import type { TableColumn } from '@/components/vc-wallet/Table'
import type { Tenant } from '@/models/tenant'

export const tenantColumns: TableColumn<Tenant>[] = [
  {
    id: 'name',
    header: 'Name',
    accessor: t => t.name,
    dataType: 'string',
    isOrderable: true,
    isFilterable: true,
    format: (value, row) => <Text title={row.description ?? ''}>{value as string}</Text>,
  },
  {
    id: 'actions',
    header: 'Actions',
    accessor: () => '',
    isActionColumn: true,
    showViewAction: true,
    showEditAction: true,
    showDeleteAction: true,
  },
]
