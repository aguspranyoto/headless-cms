'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { experiencesApi } from '@/lib/api';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { useIsDemo } from '@/hooks/useIsDemo';
import type { Experience } from '@/types';

export function ExperiencesClient({
  initialPage = 1,
  initialData,
}: {
  initialPage?: number;
  initialData?: any;
}) {
  const [page, setPage] = useState(initialPage);
  const pageSize = 10;
  const isDemo = useIsDemo();

  const columns = useMemo<ColumnDef<Experience>[]>(() => [
    {
      accessorKey: 'role',
      header: 'Role',
      cell: (info) => (
        <span className="font-medium">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'company',
      header: 'Company',
      cell: (info) => (
        <span>{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'year',
      header: 'Year',
    },
    {
      accessorKey: 'published',
      header: 'Status',
      cell: (info) =>
        info.getValue() ? (
          <span className="text-green-600 text-xs bg-green-100 px-2 py-0.5 rounded">
            Published
          </span>
        ) : (
          <span className="text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded">
            Draft
          </span>
        ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: '',
      cell: (info) => (
        <div className="flex justify-end">
          {isDemo ? (
            <span className="text-gray-400 cursor-not-allowed opacity-50 text-sm">Edit</span>
          ) : (
            <Link href={`/admin/experiences/${info.row.original.id}/edit`} className="text-primary hover:underline text-sm">
              Edit
            </Link>
          )}
        </div>
      ),
    },
  ], [isDemo]);

  const { data, isLoading } = useQuery({
    queryKey: ['experiences', page, pageSize],
    queryFn: () => experiencesApi.list({ page, limit: pageSize }),
    initialData: page === initialPage ? initialData : undefined,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Experiences</h1>
        {isDemo ? (
          <Button disabled className="cursor-not-allowed opacity-50">
            + Add Experience
          </Button>
        ) : (
          <Button asChild>
            <Link href="/admin/experiences/new">
              + Add Experience
            </Link>
          </Button>
        )}
      </div>
      <div className="bg-card rounded-lg shadow-sm border">
        <DataTable<Experience>
          data={data?.data ?? []}
          columns={columns}
          total={data?.meta.total ?? 0}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
