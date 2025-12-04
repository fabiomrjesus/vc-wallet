import { Box, VStack } from '@chakra-ui/react'
import { MdFactCheck } from 'react-icons/md'
import PageHeader from '../../../components/PageHeader'
import { GenericTable } from '../../../components/vc-wallet/Table'
import { predicateColumns } from './PredicatesPage.columns'
import { predicateMocks } from './PredicatesPage.mocks'
import { NewButton } from '../../../components/vc-wallet/buttons'
import { Link } from 'react-router-dom'

export default function PredicatesPage() {
  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader
        icon={<MdFactCheck color="white" size="2rem" />}
        title="Predicates"
        description="Configure predicates for proof requests."
      />
      <VStack w="100%" align="start" px="15%" py="1.5rem" gap={4} color="black">
        <GenericTable
          topActions={<Box><Link to="/admin/predicates/new"><NewButton/></Link></Box>}
          columns={predicateColumns}
          data={predicateMocks}
          onView={predicate => console.log('View predicate', predicate.id)}
          onEdit={predicate => console.log('Edit predicate', predicate.id)}
          onDelete={predicate => console.log('Delete predicate', predicate.id)}
        />
      </VStack>
    </VStack>
  )
}
