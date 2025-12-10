import  { Card, HStack, Text } from "@chakra-ui/react";
import type { ReactElement } from "react";
import  { Link } from "react-router-dom";

export function OperationCard({path, label, description, icon}:{path:string, label:string, description?:string, icon:ReactElement})
{
  const Icon = icon;
  return <Link to={path}>
        <Card.Root w="10rem" h="8rem" variant="elevated">
          <Card.Body w="100%" gap="2">
            <HStack mx="auto" fontSize="2rem">
              {Icon}
            </HStack>
            <Text textWrap="nowrap" mx="auto"  fontSize="0.75rem" fontWeight="medium">{label}</Text>
            <Text textWrap="nowrap" mx="auto" fontSize="0.55rem" fontWeight="light" color="#666666">{description}</Text>
          </Card.Body>
        </Card.Root>
      </Link>
}