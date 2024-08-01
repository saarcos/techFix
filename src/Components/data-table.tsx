import { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"
import { Input } from "./ui/input"
import DatatablePagination from "./datatable-pagination"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  globalFilterColumn?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  globalFilterColumn,
}: DataTableProps<TData, TValue>) {
    const [pagination, setPagination]=useState<PaginationState>({
        pageSize:5,
        pageIndex:0,
        });
    const [sorting, setSorting]=useState<SortingState>([]);
    const [columnFilters, setColumnFilters]=useState<ColumnFiltersState>([]);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state:{
            pagination,
            sorting,
            columnFilters
        },
    })
  

  return (
    <div className="space-y-4">
        {
            globalFilterColumn &&(
                <Input placeholder="Buscar por nombre..."
                value={(table.getColumn(globalFilterColumn)?.getFilterValue() as string)??""}
                onChange={(event)=>
                    table
                        .getColumn(globalFilterColumn)
                        ?.setFilterValue(event.target.value)
                }
                className="max-w-sm mt-3 ml-1"/>
            )
        }
        <div className="rounded-md border">
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                    )
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No hubo resultados.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
        <DatatablePagination table={table}/>
    </div>
    
  )
}
