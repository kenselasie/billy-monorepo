import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Package, ChevronRight, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  details?: string | null;
  icon?: string | null;
  products_count: number;
  image?: any[] | null;
  parent_id?: string | null;
  parent?: { id: string; name: string } | null;
  children?: { id: string; name: string }[];
  created_at: string;
  updated_at: string;
}

export const categoryColumns: ColumnDef<CategoryData>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-center font-bold">Name</div>,
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        {row.original.image && row.original.image.length > 0 && row.original.image[0] ? (
          <Image
            src={row.original.image[0]}
            alt={row.original.name}
            width={32}
            height={32}
            className="rounded-md"
          />
        ) : (
          <Avatar className="h-8 w-8">
            <AvatarFallback>{row.original.name[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "details",
    header: () => <div className="text-center font-bold">Details</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm text-gray-600">
        {row.original.details || "No details"}
      </div>
    ),
  },
  {
    accessorKey: "slug",
    header: () => <div className="text-center font-bold">Slug</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm font-mono bg-gray-100 px-2 py-1 rounded">
        {row.original.slug}
      </div>
    ),
  },
  {
    accessorKey: "products_count",
    header: () => <div className="text-center font-bold">Products</div>,
    cell: ({ row }) => (
      <div className="text-center flex items-center justify-center gap-1">
        <Package className="h-4 w-4 text-gray-500" />
        <span>{row.original.products_count}</span>
      </div>
    ),
  },
  {
    accessorKey: "children",
    header: () => <div className="text-center font-bold">Sub Categories</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="secondary">{row.original.children?.length || 0}</Badge>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center font-bold">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
          onClick={() => console.log("Edit category", row.original.id)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          onClick={() => console.log("Delete category", row.original.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
