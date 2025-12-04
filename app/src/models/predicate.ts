export type PredicateType = 'set-membership' | 'equality' | 'range'

export interface Predicate {
  id: string
  schemaId: string
  schemaName: string
  name: string
  type: PredicateType
  fieldName: string
  operator: string
  value: string
}
