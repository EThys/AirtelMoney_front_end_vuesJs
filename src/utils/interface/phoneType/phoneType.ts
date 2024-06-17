export interface IPhoneType {
  PhoneTypeId: BigInt
  PhoneNumber: string
  UserTypeFId: number
  Note: string
  user_type: {
    UserTypeId: number
    UserTypeName: string
  }
}
