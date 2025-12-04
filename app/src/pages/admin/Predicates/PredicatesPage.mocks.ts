import type { Predicate } from '@/models/predicate'

export const predicateMocks: Predicate[] = [
  {
    id: 'pred-1',
    schemaId: 'schema-1',
    schemaName: 'Employee ID',
    name: 'Allowed Countries',
    type: 'set-membership',
    fieldName: 'country',
    operator: 'IN',
    value: 'USA, CAN, UK',
  },
  {
    id: 'pred-2',
    schemaId: 'schema-1',
    schemaName: 'Employee ID',
    name: 'Minimum Age',
    type: 'range',
    fieldName: 'age',
    operator: '>=',
    value: '18',
  },
  {
    id: 'pred-3',
    schemaId: 'schema-2',
    schemaName: 'Partner Membership',
    name: 'Status Active',
    type: 'equality',
    fieldName: 'status',
    operator: '=',
    value: 'active',
  },
]
