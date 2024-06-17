//@ts-ignore
import type { ITransaction } from '@/utils/interface/transaction/ITransaction'
import type { IBranche } from '@/utils/interface/branche/IBranche'
import type { ICurrency } from '@/utils/interface/currency/ICurrency'
import type { IUserType } from '@/utils/interface/userType/IUserType'

export function getTransactions() {
  const transactiontring = localStorage.getItem('transactions')
  return transactiontring ? JSON.parse(transactiontring) : null
}

export function setTransaction(TransactionData: ITransaction): void {
  localStorage.setItem('transactions', JSON.stringify(TransactionData))
}

export function getBranches() {
  const branchetring = localStorage.getItem('branches')
  return branchetring ? JSON.parse(branchetring) : null
}
export function setBranche(BrancheData: IBranche): void {
  localStorage.setItem('branches', JSON.stringify(BrancheData))
}

export function getCurrencies() {
  const currencytring = localStorage.getItem('currencies')
  return currencytring ? JSON.parse(currencytring) : null
}

export function setCurrency(CurrencyData: ICurrency): void {
  localStorage.setItem('currencies', JSON.stringify(CurrencyData))
}

export function getUserType() {
  const userTypetring = localStorage.getItem('userType')
  return userTypetring ? JSON.parse(userTypetring) : null
}

export function setUserType(UserTypeData: IUserType): void {
  localStorage.setItem('UserType', JSON.stringify(UserTypeData))
}
