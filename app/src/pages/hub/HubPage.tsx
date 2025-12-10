import {  HStack, VStack } from '@chakra-ui/react'
import { FaNetworkWired, FaUserMinus, FaUserPlus } from 'react-icons/fa'
import { RiListCheck } from 'react-icons/ri'
import PageHeader from '../../components/PageHeader'
import { GiHouseKeys } from 'react-icons/gi'
import { OperationCard } from '../../components/vc-wallet/cards'


export default function HubPage() {
  return (
    <VStack align="start" w="100%" gap="0" m="0" p="0" h="100%">
      <PageHeader icon={<FaNetworkWired color="white" size="2rem" />} title="Hub Governance" description="Proposals and signer management." />
      <VStack px="7.5%" pt="1%" w="100%" color="black" align="start">
        <HStack w="100%" py="2rem" gap="10" flexWrap="wrap">
          <OperationCard path="/hub/propose-signer" label="Propose Signer" description="Nominate a new signer" icon={<FaUserPlus />} />
          <OperationCard path="/hub/revoke-signer" label="Revoke Signer" description="Revoke signer access" icon={<FaUserMinus />} />
          <OperationCard path="/hub/transfer-ownership" label="Transfer Ownership" description="Propose ownership transfer" icon={<GiHouseKeys />} />
          <OperationCard path="/hub/set-quorum" label="Set Quorum" description="Update approval threshold" icon={<FaNetworkWired />} />
          <OperationCard path="/hub/list-proposals" label="List Proposals" description="View existing proposals" icon={<RiListCheck />} />
        </HStack>
      </VStack>
    </VStack>
  )
}
