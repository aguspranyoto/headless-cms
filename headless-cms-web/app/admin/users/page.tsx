'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import type { User } from '@/types';
import { EditUserModal } from '@/components/EditUserModal';
import { Pencil } from 'lucide-react';


export default function UsersPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const columns = useMemo<ColumnDef<User>[]>(() => [
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
      accessorKey: 'role',
      header: 'Role',
      cell: (info) => {
        const role = info.getValue() as string;
        return (
          <span className={`px-2 py-1 rounded text-xs font-semibold bg-muted text-muted-foreground`}>
            {role}
          </span>
        );
      },
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
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => setSelectedUser(row.original)} className="h-8 w-8 text-muted-foreground hover:text-primary">
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
  ], []);

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, pageSize],
    queryFn: () => usersApi.list({ page, limit: pageSize }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>
      <div className="bg-card rounded-lg shadow-sm border">
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
      <EditUserModal 
        user={selectedUser} 
        isOpen={!!selectedUser} 
        onClose={() => setSelectedUser(null)} 
      />
    </div>
  );
}
