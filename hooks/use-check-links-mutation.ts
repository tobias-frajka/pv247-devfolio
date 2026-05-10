'use client';

import { useMutation } from '@tanstack/react-query';

import { checkLinks } from '@/server-actions/links';

export const useCheckLinksMutation = () =>
  useMutation({
    mutationFn: () => checkLinks(),
    retry: false
  });
