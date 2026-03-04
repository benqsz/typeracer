'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'

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

export default function useColumns(sessionId: string | undefined) {
  return useMemo<ColumnDef<Player>[]>(
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
}
