import { Button, Field, Fieldset, Input, Textarea, VStack } from '@chakra-ui/react'
import { FaHouse } from 'react-icons/fa6'
import { useState} from 'react'
import PageHeader from '../../../components/PageHeader'

export default function NewTenantPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader
        icon={<FaHouse color="white" size="2rem" />}
        title="New Tenant"
        description="Register a new tenant."
      />
        <Fieldset.Root >
          <Fieldset.Content>
            <Field.Root>
              <Field.Label>Name</Field.Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Tenant name" />
            </Field.Root>
            <Field.Root>
              <Field.Label>Description</Field.Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" />
            </Field.Root>
          </Fieldset.Content>
        </Fieldset.Root>
        <Button colorScheme="blue">Create Tenant</Button>
        <Button colorScheme="red">Back</Button>
    </VStack>
  )
}
