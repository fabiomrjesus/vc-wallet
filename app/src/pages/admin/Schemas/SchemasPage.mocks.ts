import type { CredentialSchema } from '@/models/schema'

export const schemaMocks: CredentialSchema[] = [
  { id: 'schema-1', tenantId: 'tenant-1', tenantName: 'Wallet Org', name: 'Employee ID', version: '1.0.0', fieldCount: 5 },
  { id: 'schema-2', tenantId: 'tenant-2', tenantName: 'Partner A', name: 'Partner Membership', version: '0.9.1', fieldCount: 3 },
  { id: 'schema-3', tenantId: 'tenant-3', tenantName: 'Internal QA', name: 'Test Credential', version: '0.1.0', fieldCount: 4 },
  { id: 'schema-4', tenantId: 'tenant-4', tenantName: 'Demo Tenant', name: 'Demo Badge', version: '2.0.0', fieldCount: 2 },
]
