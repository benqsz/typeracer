'use client'

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  type OnChangeFn,
} from '@tanstack/react-table'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

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
import useColumns from '@/hooks/useCollumns'
import { useGame } from '@/hooks/useGame'

export default function Lobby() {
  const { sessionId, lobby } = useGame()
  const searchParams = useSearchParams()
  const router = useRouter()
  const columns = useColumns(sessionId)

  const sorting: SortingState = useMemo(() => {
    const id = searchParams.get('sort')
    const desc = searchParams.get('dir') === 'desc'
    return id ? [{ id, desc }] : []
  }, [searchParams])

  const data = useMemo(
    () =>
      [...(lobby ?? [])].sort((a, b) =>
        a.sessionId === sessionId ? -1 : b.sessionId === sessionId ? 1 : 0,
      ),
    [lobby, sessionId],
  )

  const setSorting: OnChangeFn<SortingState> = updater => {
    const next = typeof updater === 'function' ? updater(sorting) : updater
    const params = new URLSearchParams(searchParams.toString())

    if (next.length > 0) {
      params.set('sort', next[0].id)
      params.set('dir', next[0].desc ? 'desc' : 'asc')
    } else {
      params.delete('sort')
      params.delete('dir')
    }

    router.replace(`?${params.toString()}`, { scroll: false })
  }

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
