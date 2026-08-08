import { apiGet, apiPost } from './http';
import type { PendingUserDto } from './types';

export function getPendingUsers(): Promise<PendingUserDto[]> {
  return apiGet('/api/app/user-approval/pending');
}

export function approveUser(userId: string): Promise<void> {
  return apiPost(`/api/app/user-approval/approve/${userId}`);
}

export function rejectUser(userId: string): Promise<void> {
  return apiPost(`/api/app/user-approval/reject/${userId}`);
}
