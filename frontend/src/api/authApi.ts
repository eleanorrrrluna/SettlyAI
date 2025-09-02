import httpClient from './httpClient';
import type { IUser, IVerifyEmailRequest } from '@/interfaces/user';

export const registerUser = async (userData: IUser) => {
  const response = await httpClient.post('/auth/register', userData);
  return response.data;
};

export const verifyEmail = async (data: IVerifyEmailRequest) => {
  const response = await httpClient.post('/api/auth/verify-email', data);
  return response.data;
};

export const resendVerificationCode = async (userId: number) => {
  const response = await httpClient.post('/api/auth/resend-verification', { userId });
  return response.data;
};
