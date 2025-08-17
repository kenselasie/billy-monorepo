"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";
import { useState } from "react";
import * as React from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
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
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CategoryData } from "./category-columns";

interface DataTableProps<TData extends CategoryData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  isLoading?: boolean;
  onPageChange?: () => void;
}

export function CategoryDataTable<TData extends CategoryData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  setPagination,
  isLoading,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter((category) =>
    (category as CategoryData).name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const generatePaginationNumbers = (
    currentPage: number,
    totalPages: number
  ) => {
    const delta = 1;
    const pages: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    pageCount,
    state: {
      pagination,
    },
    onPaginationChange: (updater) => {
      setPagination(updater);
      onPageChange?.();
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const totalPages = Math.ceil(pageCount / pagination.pageSize);
  const currentPage = pagination.pageIndex + 1;

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage your product categories and subcategories
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-white"
          />
        </div>
      </div>

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
                  {data.length === 0 ? "No categories found." : `No results for "${searchQuery}"`}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col gap-2 sm:flex-row items-center justify-between px-2 py-4">
        <span className="text-sm text-muted-foreground order-2 sm:order-1">
          Showing {(currentPage - 1) * pagination.pageSize + 1} to{" "}
          {Math.min(currentPage * pagination.pageSize, pageCount)} of{" "}
          {pageCount} categories
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
    </Card>
  );
}
