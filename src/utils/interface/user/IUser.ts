export interface IUser {
  UserId: BigInt
  UserName: string
  Password: string
  Admin: string
  UserTypeFId: number
  BrancheFId: number
  toke: string
  user: {
    UserName: string
  }
}
export interface IUserAuth {
  UserName: string
  Password: string
}
