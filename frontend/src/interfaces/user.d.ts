export interface IUser {
  fullName: string;
  email: string;
  password: string;
}

export interface IUserResponse {
  id: number;
  fullName: string;
  email: string;
}

export interface IVerifyEmailRequest {
  userId: number;
  code: string;
  verificationType: number; // 或者做成 enum
}
