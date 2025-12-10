import type { ReactElement } from 'react'
import { FaUserPlus, FaUserMinus } from 'react-icons/fa'
import { GiHouseKeys } from 'react-icons/gi'
import { FaNetworkWired } from 'react-icons/fa6'

export function actionTypeLabel(value: number | string): string {
  const num = typeof value === 'string' ? Number(value) : value
  switch (num) {
    case 0:
      return 'Assign Signer'
    case 1:
      return 'Revoke Signer'
    case 2:
      return 'Transfer Ownership'
    case 3:
      return 'Set Contract Role'
    default:
      return String(value)
  }
}

export function actionTypeIcon(value: number | string): ReactElement | null {
  const num = typeof value === 'string' ? Number(value) : value
  switch (num) {
    case 0:
      return <FaUserPlus />
    case 1:
      return <FaUserMinus />
    case 2:
      return <GiHouseKeys />
    case 3:
      return <FaNetworkWired />
    default:
      return null
  }
}

export function actionTypeColor(value: number | string): string {
  const num = typeof value === 'string' ? Number(value) : value
  switch (num) {
    case 0:
      return 'green'
    case 1:
      return 'red'
    case 2:
      return 'purple'
    case 3:
      return 'blue'
    default:
      return 'gray'
  }
}
