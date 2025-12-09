import { createContext, useContext } from "react"
import type { Profile } from "./useEthUserBadge"

export type WalletContextValue = {
  account: string
  profile: Profile | null
  profileLoading: boolean
  connectWallet: () => Promise<void>
  refreshProfile: () => Promise<void>
}
export const WalletContext = createContext<WalletContextValue | undefined>(undefined)

export function useWalletContext(): WalletContextValue {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWalletContext must be used within WalletProvider')
  return ctx
}
