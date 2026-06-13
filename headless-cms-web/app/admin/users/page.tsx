'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import type { User } from '@/types';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'username',
    header: 'Username',
    cell: (info) => (
      <span className="font-medium">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'displayName',
    header: 'Display Name',
    cell: (info) => (info.getValue() as string) ?? '—',
  },
  {
    accessorKey: 'isActive',
    header: 'Active',
    cell: (info) =>
      info.getValue() ? (
        <span className="text-green-600">✅</span>
      ) : (
        <span className="text-red-500">❌</span>
      ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
  },
];

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, pageSize],
    queryFn: () => usersApi.list({ page, limit: pageSize }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button asChild>
          <Link href="/admin/users/new">
            + Add User
          </Link>
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow">
        <DataTable<User>
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
