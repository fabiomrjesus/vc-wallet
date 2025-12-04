import { Box, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import type { ReactElement } from 'react'

type PageHeaderProps = {
  icon: ReactElement
  title: string
  description: string
  iconBg?: string
}

export default function PageHeader({ icon, title, description, iconBg = '#9CC6DB' }: PageHeaderProps) {
  return (
    <HStack shadow="md" gap={5} w="100%" bg="#ffffff" color="black" h="6rem" px="7.5%">
      <Box
        w="3rem"
        h="3rem"
        bg={iconBg}
        px="0.5rem"
        py="0.5rem"
        borderRadius="0.75rem"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {icon}
      </Box>
      <VStack align="start" gap={0}>
        <Heading size="md" fontWeight={450}>
          {title}
        </Heading>
        <Text color="#555555" fontSize="0.85rem">
          {description}
        </Text>
      </VStack>
    </HStack>
  )
}
