'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/lib/api';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import type { Post } from '@/types';

const columns: ColumnDef<Post>[] = [
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
];

export function PostsClient({
  initialPage = 1,
  initialData,
}: {
  initialPage?: number;
  initialData?: any;
}) {
  const [page, setPage] = useState(initialPage);
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['posts', page, pageSize],
    queryFn: () => postsApi.list({ page, limit: pageSize }),
    initialData: page === initialPage ? initialData : undefined,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          + Add Post
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow">
        <DataTable<Post>
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
