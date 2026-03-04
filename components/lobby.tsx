'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGame } from '@/hooks/useGame'

type Player = {
  sessionId: string
  username: string
  progress?: string
  wpm?: number
  accuracy?: number
}

function SortIcon({ isSorted }: { isSorted: false | 'asc' | 'desc' }) {
  if (isSorted === 'asc') return <ArrowUp className="ml-1 size-3" />
  if (isSorted === 'desc') return <ArrowDown className="ml-1 size-3" />
  return <ArrowUpDown className="ml-1 opacity-40 size-3" />
}

export default function Lobby() {
  const { sessionId, lobby } = useGame()
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<Player>[]>(
    () => [
      {
        accessorKey: 'username',
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Username <SortIcon isSorted={column.getIsSorted()} />
          </Button>
        ),
        cell: ({ row }) => (
          <>
            {row.original.username}
            {row.original.sessionId === sessionId && (
              <span className="ml-1 text-muted-foreground">(You)</span>
            )}
          </>
        ),
      },
      {
        accessorKey: 'progress',
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Live progress <SortIcon isSorted={column.getIsSorted()} />
          </Button>
        ),
      },
      {
        accessorKey: 'wpm',
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            WPM <SortIcon isSorted={column.getIsSorted()} />
          </Button>
        ),
      },
      {
        accessorKey: 'accuracy',
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Accuracy <SortIcon isSorted={column.getIsSorted()} />
          </Button>
        ),
        cell: ({ getValue }) =>
          getValue<number>() ? `${getValue<number>()}%` : '-',
      },
    ],
    [sessionId],
  )

  const data = useMemo(
    () =>
      [...(lobby ?? [])].sort((a, b) =>
        a.sessionId === sessionId ? -1 : b.sessionId === sessionId ? 1 : 0,
      ),
    [lobby, sessionId],
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (!lobby) return <Spinner className="mx-auto size-8" />

  return (
    <Table>
      <TableCaption>Current players</TableCaption>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map(row => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map(cell => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
