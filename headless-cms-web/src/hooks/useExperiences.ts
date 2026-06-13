'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { experiencesApi } from '@/lib/api';

export function useCreateExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => experiencesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['experiences'] }),
  });
}

export function useUpdateExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      experiencesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['experiences'] }),
  });
}

export function useDeleteExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => experiencesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['experiences'] }),
  });
}
