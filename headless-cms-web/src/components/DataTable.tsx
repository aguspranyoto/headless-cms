'use client';

import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  OnChangeFn,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  isLoading?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  total,
  page,
  pageSize,
  onPageChange,
  onSortChange,
  isLoading,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const totalPages = Math.ceil(total / pageSize);

  const handleSortChange: OnChangeFn<SortingState> = (updater) => {
    const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(newSorting);
    if (onSortChange && newSorting.length > 0) {
      onSortChange(newSorting[0].id, newSorting[0].desc ? 'desc' : 'asc');
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: handleSortChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Page {page} of {totalPages} ({total} items)
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
