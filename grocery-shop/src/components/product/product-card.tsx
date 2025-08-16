"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/stores/cart-store";

interface ProductCardProps {
  product: Product;
  variant?: "grid" | "list";
}

export function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  const { addItem, getItemCount, updateQuantity } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const currentQuantity = getItemCount(product.id, selectedVariant?.id);

  const handleAddToCart = () => {
    addItem(product, selectedVariant, 1);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    const itemId = `${product.id}_${selectedVariant?.id || "default"}`;
    updateQuantity(itemId, newQuantity);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getFreshnessColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-yellow-100 text-yellow-800";
      case "fair":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (variant === "list") {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <div className="flex">
          <div className="flex-shrink-0 p-6">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={96}
              height={96}
              className="text-6xl"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Link href={`/product/${product.slug}`}>
                  <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-2">
                  {product.brand}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(selectedVariant?.price || product.price)}
                </p>
                {product.variants.length > 1 && (
                  <p className="text-sm text-muted-foreground">
                    {selectedVariant?.name}
                  </p>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating || 0)}
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>
                {product.freshness && (
                  <Badge
                    variant="secondary"
                    className={getFreshnessColor(
                      product.freshness.quality ?? ""
                    )}
                  >
                    {product.freshness.quality}
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {currentQuantity > 0 ? (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(currentQuantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-medium min-w-[2rem] text-center">
                      {currentQuantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(currentQuantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleAddToCart} disabled={!product.inStock}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow group">
      <CardHeader className="text-center relative">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={96}
            height={96}
            className="mb-4 cursor-pointer group-hover:scale-105 transition-transform object-contain mx-auto"
          />
        </Link>

        {product.freshness && (
          <Badge
            variant="secondary"
            className={`absolute top-2 right-2 ${getFreshnessColor(
              product.freshness.quality ?? ""
            )}`}
          >
            {product.freshness.quality}
          </Badge>
        )}

        <div className="space-y-2">
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-lg font-semibold hover:text-primary cursor-pointer line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-center space-x-1 mt-2">
          {renderStars(product.rating || 0)}
          <span className="text-sm text-muted-foreground ml-1">
            ({product.reviewCount})
          </span>
        </div>

        <div className="mt-4">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(selectedVariant?.price || product.price)}
          </p>
          {product.variants.length > 1 && (
            <p className="text-sm text-muted-foreground">
              {selectedVariant?.name}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {product.variants.length > 1 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Size:</label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <Button
                  key={variant.id}
                  variant={
                    selectedVariant?.id === variant.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedVariant(variant)}
                  className="text-xs"
                >
                  {variant.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          {currentQuantity > 0 ? (
            <div className="flex items-center space-x-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateQuantity(currentQuantity - 1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-medium min-w-[2rem] text-center">
                {currentQuantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateQuantity(currentQuantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
