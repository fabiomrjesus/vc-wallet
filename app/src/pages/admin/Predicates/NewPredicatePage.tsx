import { Button, Field, Fieldset, Input, Select, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { MdFactCheck } from 'react-icons/md'
import PageHeader from '../../../components/PageHeader'

const schemaOptions = [
  { id: 'schema-1', name: 'Employee ID' },
  { id: 'schema-2', name: 'Partner Membership' },
]

const predicateTypes = [
  { value: 'set-membership', label: 'Set Membership' },
  { value: 'equality', label: 'Equality' },
  { value: 'range', label: 'Range' },
]

export default function NewPredicatePage() {
  const [schemaId, setSchemaId] = useState(schemaOptions[0]?.id ?? '')
  const [name, setName] = useState('')
  const [type, setType] = useState(predicateTypes[0]?.value ?? '')
  const [fieldName, setFieldName] = useState('')
  const [operator, setOperator] = useState('')
  const [value, setValue] = useState('')

  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader
        icon={<MdFactCheck color="white" size="2rem" />}
        title="New Predicate"
        description="Configure a new predicate for proof requests."
      />
      <Fieldset.Root>
        <Fieldset.Content>
          <Field.Root>
            <Field.Label>Schema</Field.Label>
            <Select.Root value={schemaId} onValueChange={setSchemaId}>
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select schema" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                  <Select.ClearTrigger />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {schemaOptions.map(s => (
                    <Select.Item key={s.id} item={{ value: s.id, label: s.name }} />
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Field.Root>
          <Field.Root>
            <Field.Label>Name</Field.Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Predicate name" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Type</Field.Label>
            <Select.Root value={type} onValueChange={setType}>
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select type" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                  <Select.ClearTrigger />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {predicateTypes.map(t => (
                    <Select.Item key={t.value} item={{ value: t.value, label: t.label }} />
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Field.Root>
          <Field.Root>
            <Field.Label>Field Name</Field.Label>
            <Input value={fieldName} onChange={e => setFieldName(e.target.value)} placeholder="Field name" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Operator</Field.Label>
            <Input value={operator} onChange={e => setOperator(e.target.value)} placeholder="IN, =, >=, etc." />
          </Field.Root>
          <Field.Root>
            <Field.Label>Value</Field.Label>
            <Input value={value} onChange={e => setValue(e.target.value)} placeholder="Comma-separated for sets" />
          </Field.Root>
        </Fieldset.Content>
      </Fieldset.Root>
      <Button colorScheme="blue">Create Predicate</Button>
      <Button colorScheme="red">Back</Button>
    </VStack>
  )
}
