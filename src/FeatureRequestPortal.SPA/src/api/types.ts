// Wire-format DTOs mirroring the ABP backend contracts. Keep these in sync with
// FeatureRequestPortal.Application.Contracts on the server side.

export type FeatureRequestStatus = 0 | 1 | 2 | 3 | 4 | 5;

export const FEATURE_REQUEST_STATUSES: FeatureRequestStatus[] = [0, 1, 2, 3, 4, 5];

export const FEATURE_REQUEST_STATUS_LABELS: Record<FeatureRequestStatus, string> = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
  3: 'Planned',
  4: 'Completed',
  5: 'Cancelled',
};

export interface FeatureRequestDto {
  id: string;
  title: string;
  status: FeatureRequestStatus;
  voteCount: number;
  creationTime: string;
  lastModificationTime: string | null;
}

export interface CommentDto {
  id: string;
  text: string;
  creationTime: string;
  creatorId: string | null;
  creatorName: string | null;
}

export interface FeatureRequestDetailDto extends FeatureRequestDto {
  description: string;
  hasCurrentUserVoted: boolean;
  comments: CommentDto[];
}

export interface CreateFeatureRequestDto {
  title: string;
  description: string;
}

export interface CreateCommentDto {
  text: string;
}

export interface UpdateFeatureRequestStatusDto {
  status: FeatureRequestStatus;
}

export interface PagedResultDto<T> {
  totalCount: number;
  items: T[];
}

export interface AbpErrorDetail {
  code: string | null;
  message: string;
  details: string | null;
}

export interface AbpErrorResponse {
  error: AbpErrorDetail;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_token?: string;
  refresh_token?: string;
}

export interface TokenErrorResponse {
  error: string;
  error_description?: string;
}

export interface CurrentUserDto {
  isAuthenticated: boolean;
  userName: string | null;
  name: string | null;
  roles: string[];
}

export interface ApplicationConfigurationDto {
  currentUser: CurrentUserDto;
  auth: {
    grantedPolicies: Record<string, boolean>;
  };
}

export interface RegisterAccountDto {
  userName: string;
  email: string;
  password: string;
}

export interface RegisterAccountResultDto {
  userId: string;
}

export interface VerifyEmailDto {
  userId: string;
  code: string;
}

export interface PendingUserDto {
  id: string;
  userName: string;
  email: string;
  creationTime: string;
}
