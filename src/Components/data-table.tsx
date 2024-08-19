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
                <Input placeholder={`Buscar por ${globalFilterColumn}...`}
                value={(table.getColumn(globalFilterColumn)?.getFilterValue() as string)??""}
                onChange={(event)=>
                    table
                        .getColumn(globalFilterColumn)
                        ?.setFilterValue(event.target.value)
                }
                className="max-w-sm mt-3"/>
            )
        }
      <div className="overflow-x-auto w-full rounded-md border">
        <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead 
                    key={header.id}>
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
            <TableBody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    className="hover:cursor-pointer"
                    data-state={row.getIsSelected() && "selected"}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell 
                        key={cell.id}
                        className=" whitespace-nowrap text-sm font-normal text-gray-900 "
                    >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
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
