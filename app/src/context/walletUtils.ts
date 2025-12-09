// Helper utilities for wallet interactions.
export function getEthereum() {
  return (window as typeof window & { ethereum?: any }).ethereum
}
