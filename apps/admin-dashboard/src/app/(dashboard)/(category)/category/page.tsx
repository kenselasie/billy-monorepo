"use client";
import * as React from "react";
import { CategoryDataTable } from "@/components/features/category/category-datatable/data-table";
import { useGetCategoriesQuery } from "@/data/use-category/use-get-categories";
import { PaginationState } from "@tanstack/react-table";
import { categoryColumns } from "@/components/features/category/category-datatable/category-columns";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const Category = () => {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: categoriesData,
    refetch,
    isLoading,
    error,
  } = useGetCategoriesQuery({
    page: (pagination.pageIndex + 1).toString(),
    limit: pagination.pageSize.toString(),
  });


  if (isLoading) return <TableSkeleton />;

  // Show error state if there's an error
  if (error) {
    return (
      <div className="space-y-4">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Categories" },
          ]}
        />
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold">
            Error loading categories
          </h3>
          <p className="text-red-600 mt-2">
            {(error as Error)?.message || "Failed to fetch categories"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Categories" },
        ]}
      />


      <CategoryDataTable
        columns={categoryColumns}
        data={categoriesData?.data || []}
        pageCount={parseInt(categoriesData?.meta?.total?.toString() || "0")}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading}
        onPageChange={refetch}
      />
    </div>
  );
};

export default Category;
