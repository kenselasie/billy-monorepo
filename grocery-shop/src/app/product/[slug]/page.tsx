'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { ShoppingCart, Star, Heart, Plus, Minus, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/lib/stores/cart-store';
import { Product } from '@/lib/types';
import { useProducts } from '@/lib/hooks/useProducts';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { data: products, isLoading } = useProducts();
  const product = products?.find(p => p.slug === params.slug);
  
  const { addItem, getItemCount, updateQuantity } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const currentQuantity = getItemCount(product?.id || '', selectedVariant?.id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    const itemId = `${product.id}_${selectedVariant?.id || 'default'}`;
    updateQuantity(itemId, newQuantity);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getFreshnessColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'fair':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <div className="text-9xl mb-4">
                  {product.images[0].startsWith('http') ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-48 h-48 mx-auto object-cover rounded-lg"
                    />
                  ) : (
                    <span>{product.images[0]}</span>
                  )}
                </div>
                {product.freshness && product.freshness.quality && (
                  <Badge
                    variant="secondary"
                    className={`${getFreshnessColor(product.freshness.quality)} text-sm`}
                  >
                    {product.freshness.quality.toUpperCase()} Quality
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Features */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <Truck className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium">Free Delivery</p>
                  <p className="text-sm text-muted-foreground">On orders over $50</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium">Quality Guarantee</p>
                  <p className="text-sm text-muted-foreground">100% satisfaction</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">{product.brand}</p>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {renderStars(product.rating || 0)}
                <span className="text-sm text-muted-foreground ml-1">
                  ({product.reviewCount} reviews)
                </span>
              </div>
              <Badge variant="outline">SKU: {product.sku}</Badge>
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="text-4xl font-bold text-primary mb-6">
              {formatPrice(selectedVariant?.price || product.price)}
            </div>
          </div>

          {/* Variants */}
          {product.variants.length > 1 && (
            <div className="space-y-3">
              <h3 className="font-medium">Size Options:</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                    onClick={() => setSelectedVariant(variant)}
                    className="flex flex-col h-auto p-3"
                  >
                    <span className="font-medium">{variant.name}</span>
                    <span className="text-sm">{formatPrice(variant.price)}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>

              <Button variant="outline" size="lg">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {currentQuantity > 0 && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">
                  {currentQuantity} in cart
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(currentQuantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="font-medium">{currentQuantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(currentQuantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Freshness Info */}
          {product.freshness && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Freshness Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Quality:</span>
                  <Badge
                    variant="secondary"
                    className={getFreshnessColor(product.freshness.quality || 'good')}
                  >
                    {product.freshness.quality || 'good'}
                  </Badge>
                </div>
                {product.freshness.expiryDate && (
                  <div className="flex justify-between">
                    <span>Best Before:</span>
                    <span>{new Date(product.freshness.expiryDate).toLocaleDateString()}</span>
                  </div>
                )}
                {product.freshness.freshnessDays && (
                  <div className="flex justify-between">
                    <span>Freshness:</span>
                    <span>{product.freshness.freshnessDays} days</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Nutritional Information */}
          {product.nutritionalInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nutritional Information</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Per {product.nutritionalInfo.servingSize}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {product.nutritionalInfo.calories && (
                    <div className="flex justify-between">
                      <span>Calories:</span>
                      <span className="font-medium">{product.nutritionalInfo.calories}</span>
                    </div>
                  )}
                  {product.nutritionalInfo.protein && (
                    <div className="flex justify-between">
                      <span>Protein:</span>
                      <span className="font-medium">{product.nutritionalInfo.protein}g</span>
                    </div>
                  )}
                  {product.nutritionalInfo.carbs && (
                    <div className="flex justify-between">
                      <span>Carbs:</span>
                      <span className="font-medium">{product.nutritionalInfo.carbs}g</span>
                    </div>
                  )}
                  {product.nutritionalInfo.fat && (
                    <div className="flex justify-between">
                      <span>Fat:</span>
                      <span className="font-medium">{product.nutritionalInfo.fat}g</span>
                    </div>
                  )}
                  {product.nutritionalInfo.fiber && (
                    <div className="flex justify-between">
                      <span>Fiber:</span>
                      <span className="font-medium">{product.nutritionalInfo.fiber}g</span>
                    </div>
                  )}
                  {product.nutritionalInfo.sugar && (
                    <div className="flex justify-between">
                      <span>Sugar:</span>
                      <span className="font-medium">{product.nutritionalInfo.sugar}g</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}