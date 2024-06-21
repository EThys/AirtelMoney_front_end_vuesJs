//@ts-ignore
import type { ITransaction } from '@/utils/interface/transaction/ITransaction'
import type { IBranche } from '@/utils/interface/branche/IBranche'
import type { ICurrency } from '@/utils/interface/currency/ICurrency'
import type { IUserType } from '@/utils/interface/userType/IUserType'
import type { IPhoneType } from '@/utils/interface/phoneType/phoneType'

export function getTransactions(currency: any) {
  const transactionString = localStorage.getItem(`transactions_${currency}`)
  return transactionString ? JSON.parse(transactionString) : null
}
export function setTransaction(currency: any, TransactionData: any) {
  localStorage.setItem(`transactions_${currency}`, JSON.stringify(TransactionData))
}
export function clearAllTransactions() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('transactions_')) {
      localStorage.removeItem(key)
    }
  })
}
export function getBranches() {
  const branchetring = localStorage.getItem('branches')
  return branchetring ? JSON.parse(branchetring) : null
}
export function setBranche(BrancheData: IBranche): void {
  localStorage.setItem('branches', JSON.stringify(BrancheData))
}
export function clearBranche(): void {
  localStorage.removeItem('branches')
}

export function getCurrencies() {
  const currencytring = localStorage.getItem('currencies')
  return currencytring ? JSON.parse(currencytring) : null
}

export function setCurrency(CurrencyData: ICurrency): void {
  localStorage.setItem('currencies', JSON.stringify(CurrencyData))
}
export function clearCurrency(): void {
  localStorage.removeItem('currencies')
}

export function getUserType() {
  const userTypetring = localStorage.getItem('userType')
  return userTypetring ? JSON.parse(userTypetring) : null
}

export function setUserType(UserTypeData: IUserType): void {
  localStorage.setItem('UserType', JSON.stringify(UserTypeData))
}
export function clearUserType(): void {
  localStorage.removeItem('UserType')
}

export function getPhoneType() {
  const phoneTypetring = localStorage.getItem('phoneType')
  return phoneTypetring ? JSON.parse(phoneTypetring) : null
}

export function setPhoneType(PhoneTypeData: IPhoneType): void {
  localStorage.setItem('phoneType', JSON.stringify(PhoneTypeData))
}
export function clearPhoneType(): void {
  localStorage.removeItem('phoneType')
}
