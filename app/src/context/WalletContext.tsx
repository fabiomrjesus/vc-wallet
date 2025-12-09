import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useEthUserBadge, type Profile } from '../hooks/useEthUserBadge'
import { getEthereum } from './walletUtils'
import { WalletContext, type WalletContextValue } from '../hooks/useWalletConnect'




export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string>('')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const contractAddress = import.meta.env.VITE_PROFILE_CONTRACT as string | undefined
  const { getBadge } = useEthUserBadge(contractAddress ?? '')

  const ethereum = getEthereum()

  const refreshProfile = useCallback(async () => {
    if (!account || !contractAddress) {
      setProfile(null)
      return
    }
    setProfileLoading(true)
    try {
      const data = await getBadge(account)
      setProfile(data)
    } catch {
      setProfile(null)
    } finally {
      setProfileLoading(false)
    }
  }, [account, contractAddress, getBadge])

  const connectWallet = useCallback(async () => {
    if (!ethereum?.request) return
    try {
      const accounts: string[] = await ethereum.request({ method: 'eth_requestAccounts' })
      const first = accounts?.[0] ?? ''
      setAccount(first)
    } catch (err) {
      console.error('MetaMask connection failed', err)
    }
  }, [ethereum])

  useEffect(() => {
    if (!ethereum?.on) return
    const handler = (accounts: string[]) => {
      const next = accounts && accounts.length > 0 ? accounts[0] : ''
      setAccount(next)
    }
    ethereum.on('accountsChanged', handler)
    // Prime with current selection if available
    ;(async () => {
      try {
        const current: string[] = await ethereum.request({ method: 'eth_accounts' })
        const next = current && current.length > 0 ? current[0] : ''
        setAccount(next)
      } catch {
        /* ignore */
      }
    })()
    return () => {
      if (ethereum.removeListener) {
        ethereum.removeListener('accountsChanged', handler)
      }
    }
  }, [ethereum])

  useEffect(() => {
    void refreshProfile()
  }, [account, refreshProfile])

  const value = useMemo<WalletContextValue>(
    () => ({
      account,
      profile,
      profileLoading,
      connectWallet,
      refreshProfile,
    }),
    [account, profile, profileLoading, connectWallet, refreshProfile]
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

