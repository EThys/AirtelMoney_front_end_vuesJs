export interface IUser {
  UserId: BigInt
  UserName: string
  Password: string
  Admin: number
  UserTypeFId: number
  BrancheFId: number
  toke: string
  user: {
    UserName: string
    Admin: number
    branche: {
      BrancheId: Number
      BrancheName: string
    }
  }
}
export interface IUserAuth {
  UserName: string
  Password: string
}
