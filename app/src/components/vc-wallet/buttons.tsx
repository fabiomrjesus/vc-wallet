import  { Button, type ButtonProps, Text, HStack, Spinner } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

export function NewButton(){
  return <Button bg="green">
    <HStack>
      <FaPlus/>
      <Text>New</Text>
    </HStack>
  </Button>
}

export function LoadingButton({loading, children, ...props}:ButtonProps&{loading:boolean}) {
  return (
    <Button {...props} disabled={loading || props.disabled}>
      {loading && <Spinner size="sm" mr="0.5rem" />}
      {children}
    </Button>
  );
}
