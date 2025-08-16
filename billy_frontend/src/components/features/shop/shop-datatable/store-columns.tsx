import * as React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Ban, Eye } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/const/routes";

export interface StoreData {
  id: string;
  name?: string;
  address?: any;
  addressId?: string | null;
  attachment?: any[];
  description?: string | null;
  is_active?: boolean;
  orders_count?: number;
  owner?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  ownerId: string;
  product_count?: number;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

const getInitials = (name: string = "") => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

// Define columns for the table
export const storeColumns: ColumnDef<StoreData, any>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-center font-bold">Store Name</div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center space-x-2">
        {row.original.attachment?.[0] ? (
          <Image
            src={row.original.attachment[0]}
            alt={row.original.name || "Store"}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
          </Avatar>
        )}
        <span>{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "product_count",
    header: () => <div className="font-bold">Products Count</div>,
    cell: (info) => <span className="md:ml-8">{info.getValue() || 0}</span>,
  },
  {
    accessorKey: "orders_count",
    header: () => <div className="font-bold">Order Count</div>,
    cell: (info) => <span className="md:ml-8">{info.getValue() || 0}</span>,
  },
  {
    accessorKey: "owner",
    header: () => <div className="text-center font-bold">Owner Name</div>,
    cell: ({ row }) => {
      const fullName = row.original.owner
        ? `${row.original.owner.first_name || ""} ${
            row.original.owner.last_name || ""
          }`
        : "";
      return (
        <div className="flex items-center justify-center  space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
          </Avatar>
          <span>{fullName || "N/A"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: () => <div className="font-bold text-center">Status</div>,
    cell: (info) => (
      <div className="text-center">
        <Badge
          variant={info.getValue() ? "default" : "destructive"}
          className="rounded-full"
        >
          {info.getValue() ? "Active" : "Inactive"}
        </Badge>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center font-bold">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center space-x-2">
        <Dialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Ban className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Disable Store</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This will disable the store "{row.original.name}". This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => console.log("Cancel action", row.original.id)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  console.log("Disable store", row.original.id);
                }}
              >
                Disable Store
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="size-max"
                href={ROUTES.SHOP_VIEW({ id: row.original.id })}
              >
                <Button
                  variant={"ghost"}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Eye className="h-5 w-5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Store Details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
];
