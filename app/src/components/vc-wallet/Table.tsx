import {
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  Spacer,
  Table,
  Text,
} from '@chakra-ui/react'
import type { ReactElement, ReactNode } from 'react'
import { isValidElement, useCallback, useMemo, useState } from 'react'
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md'

type DataType = 'string' | 'number' | 'date' | 'boolean'
type SortDirection = 'asc' | 'desc'

export type TableColumn<T> = {
  id: string
  header: string
  accessor: (row: T) => unknown
  render?: (value: unknown, row: T) => ReactNode
  format?: (value: unknown, row: T) => ReactNode
  dataType?: DataType
  isOrderable?: boolean
  isFilterable?: boolean
  isActionColumn?: boolean
  showViewAction?: boolean
  showEditAction?: boolean
  showDeleteAction?: boolean
  renderCustomActions?: (row: T) => ReactElement | null
}

type GenericTableProps<T> = {
  columns: TableColumn<T>[]
  data: T[]
  topActions?:ReactElement
  pageSize?: number
  onView?: (row: T) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
}

export function GenericTable<T>({
  columns,
  data,
  pageSize = 10,
  topActions,
  onView,
  onEdit,
  onDelete,
}: GenericTableProps<T>) {
  const [sortColumnId, setSortColumnId] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [filterTerm, setFilterTerm] = useState<string>('')
  const [page, setPage] = useState(0)

  const orderable = useMemo(() => new Set(columns.filter(c => c.isOrderable).map(c => c.id)), [columns])
  const filterable = useMemo(() => new Set(columns.filter(c => c.isFilterable).map(c => c.id)), [columns])

  const applyFilters = useCallback(
    (rows: T[]) => {
      if (!rows.length || filterable.size === 0 || !filterTerm) return rows
      return rows.filter(row =>
        columns.some(col => {
          if (!filterable.has(col.id)) return false
          const raw = col.accessor(row)
          return matchesFilter(raw, filterTerm, col.dataType)
        })
      )
    },
    [columns, filterable, filterTerm]
  )

  const applySort = useCallback(
    (rows: T[]) => {
      if (!sortColumnId) return rows
      const col = columns.find(c => c.id === sortColumnId)
      if (!col) return rows
      const sorted = [...rows].sort((a, b) => {
        const va = col.accessor(a)
        const vb = col.accessor(b)
        return compareValues(va, vb, col.dataType)
      })
      return sortDirection === 'asc' ? sorted : sorted.reverse()
    },
    [columns, sortColumnId, sortDirection]
  )

  const filteredData = useMemo(() => applyFilters(data), [applyFilters, data])
  const sortedData = useMemo(() => applySort(filteredData), [applySort, filteredData])

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const currentPage = Math.min(page, totalPages - 1)
  const pagedData = useMemo(() => {
    const start = currentPage * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const toggleSort = (columnId: string) => {
    if (!orderable.has(columnId)) return
    if (sortColumnId === columnId) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumnId(columnId)
      setSortDirection('asc')
    }
  }

  const updateFilter = (value: string) => {
    setFilterTerm(value)
    setPage(0)
  }

  return (
    <Box w="100%">
      {filterable.size > 0 && (
        <HStack mb={3}>
          {topActions}
          <Spacer/>
          <Input
          w="30%"
            size="sm"
            placeholder="Filter..."
            value={filterTerm}
            onChange={e => updateFilter(e.target.value)}
          />
        </HStack>
      )}
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            {columns.map(col => (
              <Table.ColumnHeader
                key={col.id}
                onClick={() => toggleSort(col.id)}
                cursor={orderable.has(col.id) ? 'pointer' : 'default'}
                userSelect="none"
                textAlign={col.isActionColumn ? 'right' : 'left'}
              >
                <HStack justify={col.isActionColumn ? 'flex-end' : 'space-between'}>
                  <Text>{col.header}</Text>
                  {sortColumnId === col.id && (
                    sortDirection === 'asc' ? <MdArrowUpward /> : <MdArrowDownward />
                  )}
                </HStack>
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {pagedData.map((row, rowIndex) => (
            <Table.Row key={rowIndex}>
              {columns.map(col => {
                if (col.isActionColumn) {
                  return (
                    <Table.Cell key={`${col.id}-${rowIndex}`} textAlign="right">
                      <HStack gap={2} justify="flex-end">
                        {col.showViewAction && (
                          <IconButton
                            aria-label="View"
                            size="sm"
                            variant="ghost"
                            onClick={() => onView?.(row)}
                          >
                            <FaEye />
                          </IconButton>
                        )}
                        {col.showEditAction && (
                          <IconButton
                            aria-label="Edit"
                            size="sm"
                            variant="ghost"
                            onClick={() => onEdit?.(row)}
                          >
                            <FaEdit />
                          </IconButton>
                        )}
                        {col.showDeleteAction && (
                          <IconButton
                            aria-label="Delete"
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete?.(row)}
                          >
                            <FaTrash />
                          </IconButton>
                        )}
                        {col.renderCustomActions?.(row)}
                      </HStack>
                    </Table.Cell>
                  )
                }

                const value = col.accessor(row)
                const formatted = col.format ? col.format(value, row) : value
                const displayValue = toDisplayNode(formatted)
                const content: ReactNode = col.render ? col.render(displayValue, row) : displayValue
                return <Table.Cell key={`${col.id}-${rowIndex}`}>{content}</Table.Cell>
              })}
            </Table.Row>
          ))}
          {pagedData.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={columns.length}>
                <Text textAlign="center" color="gray.500" py={4}>
                  No data to display.
                </Text>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
      <Flex mt={3} align="center" justify="space-between">
        <Text fontSize="sm" color="gray.600">
          Page {currentPage + 1} of {totalPages} • {sortedData.length} item(s)
        </Text>
        <HStack>
          <IconButton
            aria-label="First page"
            size="xs"
            onClick={() => setPage(0)}
            disabled={currentPage === 0}
          >
            <Text>|&lt;</Text>
          </IconButton>
          <IconButton
            aria-label="Previous page"
            size="xs"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            <Text>&lt;</Text>
          </IconButton>
          <Text fontWeight="semibold">{currentPage + 1}</Text>
          <IconButton
            aria-label="Next page"
            size="xs"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            <Text>&gt;</Text>
          </IconButton>
          <IconButton
            aria-label="Last page"
            size="xs"
            onClick={() => setPage(totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
          >
            <Text>&gt;|</Text>
          </IconButton>
        </HStack>
      </Flex>
    </Box>
  )
}

function matchesFilter(value: unknown, filterValue: string, type: DataType = 'string') {
  if (value === null || value === undefined) return false
  const needle = filterValue.toLowerCase()
  switch (type) {
    case 'number':
      return String(value).includes(filterValue)
    case 'date':
      return new Date(value as any).toLocaleDateString().toLowerCase().includes(needle)
    case 'boolean':
      return String(value).toLowerCase().startsWith(needle)
    default:
      return String(value).toLowerCase().includes(needle)
  }
}

function compareValues(a: unknown, b: unknown, type: DataType = 'string') {
  const aVal = normalizeValue(a, type)
  const bVal = normalizeValue(b, type)
  if (aVal === bVal) return 0
  return aVal > bVal ? 1 : -1
}

function normalizeValue(value: unknown, type: DataType): number | string | boolean {
  if (value === null || value === undefined) return ''
  switch (type) {
    case 'number':
      return Number(value)
    case 'date':
      return new Date(value as any).getTime()
    case 'boolean':
      return Boolean(value)
    default:
      return String(value).toLowerCase()
  }
}

function toDisplayNode(value: unknown): ReactNode {
  if (isValidElement(value) || value === null || value === undefined) return value as ReactNode
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'bigint' || typeof value === 'boolean') return String(value)
  return JSON.stringify(value)
}
