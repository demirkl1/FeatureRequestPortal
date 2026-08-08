import { apiDelete, apiGet, apiPost } from './http';
import type {
  CommentDto,
  CreateCommentDto,
  CreateFeatureRequestDto,
  FeatureRequestDetailDto,
  FeatureRequestDto,
  FeatureRequestStatus,
  PagedResultDto,
  UpdateFeatureRequestStatusDto,
} from './types';

export interface ListFeatureRequestsParams {
  status?: FeatureRequestStatus;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}

export function listFeatureRequests(
  params: ListFeatureRequestsParams,
): Promise<PagedResultDto<FeatureRequestDto>> {
  const query = new URLSearchParams();
  if (params.status !== undefined) query.set('Status', String(params.status));
  if (params.sorting) query.set('Sorting', params.sorting);
  if (params.skipCount !== undefined) query.set('SkipCount', String(params.skipCount));
  if (params.maxResultCount !== undefined) query.set('MaxResultCount', String(params.maxResultCount));
  const qs = query.toString();
  return apiGet(`/api/app/feature-request${qs ? `?${qs}` : ''}`);
}

export function getFeatureRequest(id: string): Promise<FeatureRequestDetailDto> {
  return apiGet(`/api/app/feature-request/${id}`);
}

export function createFeatureRequest(dto: CreateFeatureRequestDto): Promise<FeatureRequestDetailDto> {
  return apiPost('/api/app/feature-request', dto);
}

export function deleteFeatureRequest(id: string): Promise<void> {
  return apiDelete(`/api/app/feature-request/${id}`);
}

export function changeFeatureRequestStatus(
  id: string,
  dto: UpdateFeatureRequestStatusDto,
): Promise<void> {
  return apiPost(`/api/app/feature-request/${id}/change-status`, dto);
}

export function addComment(id: string, dto: CreateCommentDto): Promise<CommentDto> {
  return apiPost(`/api/app/feature-request/${id}/comment`, dto);
}

export function voteFeatureRequest(id: string): Promise<void> {
  return apiPost(`/api/app/feature-request/${id}/vote`);
}

export function removeVote(id: string): Promise<void> {
  return apiDelete(`/api/app/feature-request/${id}/vote`);
}
