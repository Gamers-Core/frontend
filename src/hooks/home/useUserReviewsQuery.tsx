import { useQuery } from '@tanstack/react-query';

import { BackendError, UserReview, gamersCore } from '@/api';

const queryKey = ['user-reviews'];

const queryFn = () => gamersCore.get<UserReview[]>('/user-reviews').then((res) => res.data);

export const useUserReviewsQuery = () =>
  useQuery<UserReview[], BackendError>({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

useUserReviewsQuery.queryKey = queryKey;
useUserReviewsQuery.queryFn = queryFn;
