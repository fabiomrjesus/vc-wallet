import { Button, Field, Fieldset, Input, Select, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { TbCertificate } from 'react-icons/tb'
import PageHeader from '../../../components/PageHeader'

const tenantOptions = [
  { id: 'tenant-1', name: 'Wallet Org' },
  { id: 'tenant-2', name: 'Partner A' },
  { id: 'tenant-3', name: 'Internal QA' },
]

export default function NewIssuerPage() {
  const [name, setName] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [tenantId, setTenantId] = useState(tenantOptions[0]?.id ?? '')

  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader
        icon={<TbCertificate color="white" size="2rem" />}
        title="New Issuer"
        description="Register a new issuer."
      />
      <Fieldset.Root>
        <Fieldset.Content>
          <Field.Root>
            <Field.Label>Name</Field.Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Issuer name" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Identifier</Field.Label>
            <Input value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="did:example:issuer" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Tenant</Field.Label>
            <Select.Root value={tenantId} onValueChange={setTenantId}>
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select tenant" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                  <Select.ClearTrigger />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {tenantOptions.map(t => (
                    <Select.Item key={t.id} item={{ value: t.id, label: t.name }} />
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Field.Root>
        </Fieldset.Content>
      </Fieldset.Root>
      <Button colorScheme="blue">Create Issuer</Button>
      <Button colorScheme="red">Back</Button>
    </VStack>
  )
}
