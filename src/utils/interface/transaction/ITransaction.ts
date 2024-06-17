import type { IBranche } from '@/utils/interface/branche/IBranche'

// import type {IUserType} from '@/utils/interface/'
export interface ITransaction {
  TransactionId?: BigInt
  UserFId?: number
  BrancheFId?: number
  UserTypeFId?: number
  CurrencyFId?: number
  FromBranchId?: number
  Number?: string
  Amount?: number
  Note?: Text
  Response?: string
  Send?: string
  DateCreated?: string
  DateMovemented?: string
  branche: IBranche
}

/*

"user_type": {
        "UserTypeId": 2,
        "UserTypeName": "Dealer"
      },
      "currency": {
        "CurrencyId": 1,
        "CurrencyName": "Francs-Congolais",
        "CurrencyCode": "CDF"
      },
      "user": {
        "UserId": 3,
        "BrancheFId": "3",
        "UserTypeFId": "2",
        "UserName": "Noella jambo",
        "Admin": "0"
      },
      "branche": {
        "BrancheId": 3,
        "BrancheName": "Bandal"
      }


*/
