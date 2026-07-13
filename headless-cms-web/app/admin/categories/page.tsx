'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { useIsDemo } from '@/hooks/useIsDemo';
import type { Category } from '@/types';

const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => (
      <span className="font-medium">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: (info) => (info.getValue() as string) ?? '—',
  },
  {
    accessorKey: 'sortOrder',
    header: 'Order',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => (
      <Link href={`/admin/categories/${row.original.id}/edit`} className="text-primary hover:underline text-sm">
        Edit
      </Link>
    ),
  },
];

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const isDemo = useIsDemo();

  const { data, isLoading } = useQuery({
    queryKey: ['categories', page, pageSize],
    queryFn: () => categoriesApi.list({ page, limit: pageSize }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        {isDemo ? (
          <Button disabled className="cursor-not-allowed opacity-50">
            + Add Category
          </Button>
        ) : (
          <Button asChild>
            <Link href="/admin/categories/new">
              + Add Category
            </Link>
          </Button>
        )}
      </div>
      <div className="bg-card rounded-lg shadow-sm border">
        <DataTable<Category>
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
