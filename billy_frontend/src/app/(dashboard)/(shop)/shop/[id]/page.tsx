"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import { useGetStoreByIdQuery } from "@/data/use-store/use-get-store-by-id";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Package,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const formatAddress = (address: any) => {
  if (!address) return "N/A";
  const parts = [
    address.street,
    address.city,
    address.state,
    address.country,
    address.postal_code,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "N/A";
};

const StoreStats = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center space-x-2">
    <Icon className="w-4 h-4 text-gray-500" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const ShopView = () => {
  const params = useParams();
  const { id } = params;
  const { data: storeData, isLoading } = useGetStoreByIdQuery(id as string);
  const store = storeData?.data;

  if (isLoading) {
    return <StoreLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Shops", href: "/shop" },
          { label: store?.name || "Shop Details" },
        ]}
      />
      {/* Cover Image */}
      <div className="relative h-[200px] md:h-[300px] w-full">
        {store?.attachment?.[0] ? (
          <Image
            src={store.attachment[0]}
            alt={store.name || "Store"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </div>

      {/* Store Info Card */}
      <Card className="mx-auto max-w-5xl -mt-20 relative z-10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo and Basic Info */}
            <div className="flex items-start space-x-4">
              <Avatar className="w-24 h-24 border-4 border-white">
                <AvatarFallback className="text-2xl">
                  {store?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold">{store?.name}</h1>
                  <Badge variant={store?.is_active ? "default" : "destructive"}>
                    {store?.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-gray-500 mt-1">{store?.description}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
              <StoreStats
                icon={Package}
                label="Products"
                value={store?.product_count || 0}
              />
              <StoreStats
                icon={ShoppingCart}
                label="Orders"
                value={store?.orders_count || 0}
              />
              <StoreStats
                icon={MapPin}
                label="Location"
                value={formatAddress(store?.address)}
              />
              <StoreStats
                icon={Mail}
                label="Email"
                value={store?.owner?.email || "N/A"}
              />
              <StoreStats icon={Phone} label="Contact" value={"N/A"} />
              <StoreStats icon={Globe} label="Website" value={"N/A"} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Content */}
      <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Owner Information</h2>
            <div className="space-y-2">
              <p>
                <span className="text-gray-500">Name:</span>{" "}
                {store?.owner?.first_name} {store?.owner?.last_name}
              </p>
              <p>
                <span className="text-gray-500">Email:</span>{" "}
                {store?.owner?.email}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Store Details</h2>
            <div className="space-y-2">
              <p>
                <span className="text-gray-500">Created:</span>{" "}
                {new Date(store?.created_at || "").toLocaleDateString()}
              </p>
              <p>
                <span className="text-gray-500">Last Updated:</span>{" "}
                {new Date(store?.updated_at || "").toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StoreLoadingSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-[300px] w-full" />
    <Card className="mx-auto max-w-5xl -mt-20 relative z-10">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-start space-x-4">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ShopView;
