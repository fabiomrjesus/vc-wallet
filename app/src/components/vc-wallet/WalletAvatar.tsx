import { Image, Box, HStack, Spinner, Text, VStack } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { useEthUserBadge, type Profile } from '../../hooks/useEthUserBadge'

export type WalletAvatarProps = {
  account: string
  contractAddress?: string
}

export function WalletAvatar({ account, contractAddress }: WalletAvatarProps) {
  const { getBadge } = useEthUserBadge(contractAddress ?? '')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)

  const shortAccount = useMemo(() => {
    if (!account) return ''
    return `${account.slice(0, 6)}...${account.slice(-4)}`
  }, [account])

  useEffect(() => {
    let ignore = false
    setProfile(null)
    async function load() {
      if (!contractAddress || !account) return
      setLoading(true)
      try {
        const data = await getBadge(account)
        if (!ignore) setProfile(data)
      } catch {
        if (!ignore) setProfile(null)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [account, contractAddress, getBadge])

  const name = profile?.name??"";
  const photoId = profile?.photoId
  const avatarSrc = photoId ? `/images/${photoId}.png` : `/vite.svg`
  const showConnectWarning = !profile && !loading && !!account
  const showCreateEntity = profile?.recordId === '' && !loading

  if (showConnectWarning) {
    return (
      <HStack w="100%" bg="#ffffff10" borderRadius="md" px="0.75rem" py="0.5rem" color="white">
        <VStack align="start">
          <Text fontWeight="semibold" fontSize="0.85rem">
            Connect the correct wallet
          </Text>
          <Text fontSize="0.7rem" color="#cfd8e3">
            No profile found for {shortAccount || 'this address'}.
          </Text>
        </VStack>
      </HStack>
    )
  }

  return (
    <HStack
      w="100%"
      bg="#ffffff10"
      borderRadius="md"
      px="0.75rem"
      py="0.5rem"
      color="white"
    >
      <Image
        boxSize="2rem"
        borderRadius="full"
        src={avatarSrc}
        alt={name}
      />
      <VStack align="start">
        {showCreateEntity && (
          <Text fontSize="0.7rem" color="#f6d365">
            Create a virtual entity to finish setup.
          </Text>
        )}
        {name && <Text fontWeight="semibold" fontSize="0.85rem">
          {name}
        </Text>}
        <HStack>
          <Text fontSize="0.7rem" color="#cfd8e3">
            {shortAccount}
          </Text>
          {loading && (
            <Box>
              <Spinner size="xs" color="#cfd8e3" />
            </Box>
          )}
        </HStack>
        
      </VStack>
    </HStack>
  )
}
