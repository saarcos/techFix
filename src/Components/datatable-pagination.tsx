import { Table } from "@tanstack/react-table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTablePaginationProps<TData>{
    table: Table<TData>;
}
export default function DatatablePagination<TData>({
    table,
  }: DataTablePaginationProps<TData>) {
    const pageSizes = Array.from(
      new Set([5, 10, 15, table.getFilteredRowModel().rows.length])
    );
  
    return (
        <div className="flex items-center justify-between px-1">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
        </div> */}
        <div className="flex items-center space-x-4 lg:space-x-6"> {/* Ajusta el espacio aquí */}
          <div className="flex items-center space-x-2"> {/* Ajusta el espacio aquí */}
            <p className="text-sm font-medium">Número de filas</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizes.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[40px] items-center justify-center text-sm ">
            {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              className="h-6 w-6 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a la página anterior</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: table.getPageCount() }).map((_, pageIndex) => (
              <Button
                key={pageIndex}
                variant="outline"
                className="h-6 w-6 p-0"
                onClick={() => table.setPageIndex(pageIndex)}
                disabled={table.getState().pagination.pageIndex === pageIndex}
              >
                {pageIndex + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              className="h-6 w-6 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir a la siguiente página</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }