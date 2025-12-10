import type { Issuer } from '../../../models/issuer'

export const issuerMocks: Issuer[] = [
  { id: 'issuer-1', name: 'Wallet Org Issuer', identifier: 'did:example:wallet', tenantId: 'tenant-1', tenantName: 'Wallet Org' },
  { id: 'issuer-2', name: 'Partner A Issuer', identifier: 'did:example:partner-a', tenantId: 'tenant-2', tenantName: 'Partner A' },
  { id: 'issuer-3', name: 'QA Issuer', identifier: 'did:example:qa', tenantId: 'tenant-3', tenantName: 'Internal QA' },
]
