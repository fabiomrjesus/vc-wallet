import { Button, Field, Fieldset, Input, Select, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { TbSchema } from 'react-icons/tb'
import PageHeader from '../../../components/PageHeader'

const tenantOptions = [
  { id: 'tenant-1', name: 'Wallet Org' },
  { id: 'tenant-2', name: 'Partner A' },
  { id: 'tenant-3', name: 'Internal QA' },
]

export default function NewSchemaPage() {
  const [name, setName] = useState('')
  const [version, setVersion] = useState('')
  const [tenantId, setTenantId] = useState(tenantOptions[0]?.id ?? '')

  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader
        icon={<TbSchema color="white" size="2rem" />}
        title="New Schema"
        description="Define a new credential schema."
      />
      <Fieldset.Root>
        <Fieldset.Content>
          <Field.Root>
            <Field.Label>Name</Field.Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Schema name" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Version</Field.Label>
            <Input value={version} onChange={e => setVersion(e.target.value)} placeholder="1.0.0" />
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
      <Button colorScheme="blue">Create Schema</Button>
      <Button colorScheme="red">Back</Button>
    </VStack>
  )
}
