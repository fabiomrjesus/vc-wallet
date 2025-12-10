import  { Card, HStack, Text } from "@chakra-ui/react";
import type { ReactElement } from "react";
import  { Link } from "react-router-dom";

export function OperationCard({path, label, description, icon}:{path:string, label:string, description?:string, icon:ReactElement})
{
  const Icon = icon;
  return <Link to={path}>
        <Card.Root w="10rem" h="9rem" variant="elevated" bg="#f0f0f0" color="#000000">
          <Card.Body w="100%" gap="1">
            <HStack mx="auto" fontSize="3rem">
              {Icon}
            </HStack>
            <Text my="0" py="0" textWrap="nowrap" mx="auto"  fontSize="0.85rem" fontWeight="500">{label}</Text>
            <Text my="0" py="0" textWrap="nowrap" mx="auto" fontSize="0.65rem" fontWeight="350" color="#666666">{description}</Text>
          </Card.Body>
        </Card.Root>
      </Link>
}