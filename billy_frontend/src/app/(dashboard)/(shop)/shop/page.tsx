"use client";
import * as React from "react";
import { DataTable } from "@/components/features/shop/shop-datatable/data-table";
import { useGetStoresQuery } from "@/data/use-store/use-get-store";
import { PaginationState } from "@tanstack/react-table";
import { storeColumns } from "@/components/features/shop/shop-datatable/store-columns";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

const Shop = () => {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: storesData,
    refetch,
    isLoading,
  } = useGetStoresQuery({
    page: (pagination.pageIndex + 1).toString(),
    limit: pagination.pageSize.toString(),
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={storeColumns}
        data={storesData?.data || []}
        pageCount={parseInt(storesData?.meta?.total?.toString() || "0")}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading}
        onPageChange={refetch}
      />
    </div>
  );
};

export default Shop;
