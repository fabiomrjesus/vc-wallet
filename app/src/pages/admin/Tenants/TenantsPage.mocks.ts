import type { Tenant } from '../../../models/tenant'

export const tenantMocks: Tenant[] = [
  { id: 'tenant-1', name: 'Wallet Org', description: 'Primary production tenant' },
  { id: 'tenant-2', name: 'Partner A', description: 'Sandbox for partner A integrations' },
  { id: 'tenant-3', name: 'Internal QA', description: 'Testing environment for QA' },
  { id: 'tenant-4', name: 'Demo Tenant', description: 'Used for sales demos' },
  { id: 'tenant-5', name: 'Compliance', description: 'Audit and compliance workloads' },
]
