import { Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import type { TableColumn } from '../../../components/vc-wallet/Table'
import type { Predicate } from '../../../models/predicate'

export const predicateColumns: TableColumn<Predicate>[] = [
  {
    id: 'name',
    header: 'Name',
    accessor: p => p.name,
    dataType: 'string',
    isOrderable: true,
    isFilterable: true,
  },
  {
    id: 'schema',
    header: 'Schema',
    accessor: p => p.schemaName,
    dataType: 'string',
    isFilterable: true,
    render: (_, row) => <Link to={`/admin/schemas/${row.schemaId}`}>{row.schemaName}</Link>,
  },
  {
    id: 'type',
    header: 'Type',
    accessor: p => p.type,
    dataType: 'string',
    isOrderable: true,
    isFilterable: true,
    render: value => <Text textTransform="capitalize">{(value as string).replace('-', ' ')}</Text>,
  },
  {
    id: 'field',
    header: 'Field Name',
    accessor: p => p.fieldName,
    dataType: 'string',
    isOrderable: true,
    isFilterable: true,
  },
  {
    id: 'operator',
    header: 'Operator',
    accessor: p => p.operator,
    dataType: 'string',
    isOrderable: true,
    isFilterable: true,
    render: value => <Text fontFamily="mono">{value as string}</Text>,
  },
  {
    id: 'value',
    header: 'Value',
    accessor: p => p.value,
    dataType: 'string',
    isFilterable: true,
    render: value => <Text>{value as string}</Text>,
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
