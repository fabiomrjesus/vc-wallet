import  { Button, Text, HStack } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

export function NewButton(){
  return <Button bg="green">
    <HStack>
      <FaPlus/>
      <Text>New</Text>
    </HStack>
  </Button>
}