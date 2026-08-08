import { apiPost } from './http';
import type { RegisterAccountDto, RegisterAccountResultDto, VerifyEmailDto } from './types';

export function registerAccount(dto: RegisterAccountDto): Promise<RegisterAccountResultDto> {
  return apiPost('/api/app/account-registration/register', dto);
}

export function verifyEmail(dto: VerifyEmailDto): Promise<void> {
  return apiPost('/api/app/account-registration/verify-email', dto);
}

export function resendVerificationCode(userId: string): Promise<void> {
  return apiPost(`/api/app/account-registration/resend-verification-code/${userId}`);
}
