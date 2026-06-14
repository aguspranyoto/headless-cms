'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/lib/api';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import type { Project } from '@/types';

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'coverImage',
    header: 'Cover',
    cell: (info) => {
      const url = info.getValue() as string;
      return url ? (
        <img src={url} alt="Cover" className="w-16 h-10 object-cover rounded border" />
      ) : (
        <div className="w-16 h-10 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">None</div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: (info) => (
      <span className="font-medium">{info.getValue() as string}</span>
    ),
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
        <Link href={`/admin/projects/${info.row.original.id}/edit`} className="text-primary hover:underline text-sm">
          Edit
        </Link>
      </div>
    ),
  },
];

export function ProjectsClient({
  initialPage = 1,
  initialData,
}: {
  initialPage?: number;
  initialData?: any;
}) {
  const [page, setPage] = useState(initialPage);
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['projects', page, pageSize],
    queryFn: () => projectsApi.list({ page, limit: pageSize }),
    initialData: page === initialPage ? initialData : undefined,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/new">
            + Add Project
          </Link>
        </Button>
      </div>
      <div className="bg-card rounded-lg shadow-sm border">
        <DataTable<Project>
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
