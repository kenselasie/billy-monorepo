"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react"; // Import icons from lucide-react
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { StoreData } from "./store-columns";

interface DataTableProps<TData extends StoreData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  isLoading?: boolean;
  onPageChange?: () => void; // Add this prop
}

export function DataTable<TData extends StoreData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  setPagination,
  isLoading,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter((store) =>
    (store as StoreData).name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    pageCount,
    state: {
      pagination,
    },
    onPaginationChange: (updater) => {
      setPagination(updater);
      onPageChange?.(); // Trigger refetch when page changes
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  // Add helper function for pagination
  const generatePaginationNumbers = (
    currentPage: number,
    totalPages: number
  ) => {
    const delta = 1; // Number of pages to show before and after current page
    const pages: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // First page
        i === totalPages || // Last page
        (i >= currentPage - delta && i <= currentPage + delta) // Pages around current
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  const totalPages = Math.ceil(pageCount / pagination.pageSize);
  const currentPage = pagination.pageIndex + 1;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stores</h2>
          <p className="text-muted-foreground">
            Manage and monitor all your stores in one place
          </p>
        </div>

        {/* Search with better styling */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-white"
          />
        </div>
      </div>

      {/* Table with better styling */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-xs font-bold py-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-16 text-center"
                >
                  No stores found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination with better styling */}
      <div className="flex flex-col gap-2 sm:flex-row items-center justify-between px-2 py-4">
        <span className="text-sm text-muted-foreground order-2 sm:order-1">
          Showing {(currentPage - 1) * pagination.pageSize + 1} to{" "}
          {Math.min(currentPage * pagination.pageSize, pageCount)} of{" "}
          {pageCount} stores
        </span>

        <div className="flex items-center gap-2 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {generatePaginationNumbers(currentPage, totalPages).map(
              (pageNum, idx) => (
                <Button
                  key={idx}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 w-8",
                    pageNum === "..." && "pointer-events-none"
                  )}
                  disabled={pageNum === "..."}
                  onClick={() => {
                    if (typeof pageNum === "number") {
                      table.setPageIndex(pageNum - 1);
                    }
                  }}
                >
                  {pageNum}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={currentPage >= totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
