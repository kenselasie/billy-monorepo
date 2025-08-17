'use client';

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Truck, Shield, Clock } from "lucide-react";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { useFeaturedProducts, useStore } from "@/lib/hooks/useProducts";
import { getCategoryEmoji, mapBackendCategoriesToFrontend } from "@/lib/api/mappers";
import { DEFAULT_STORE_SLUG } from "@/lib/api/client";

export default function Home() {
  const storeSlug = DEFAULT_STORE_SLUG;
  const { data: store, isLoading: storeLoading, error: storeError } = useStore({ storeSlug });
  const { data: featuredProducts, isLoading: productsLoading } = useFeaturedProducts({ storeSlug });

  // Extract and map categories from store data
  const categories = store?.success && store?.data?.categories && Array.isArray(store.data.categories) 
    ? mapBackendCategoriesToFrontend(store.data.categories) 
    : [];
  const categoriesLoading = storeLoading;
  const categoriesError = storeError;

  // Debug logging
  console.log('Store slug:', storeSlug);
  console.log('Store response:', store);
  console.log('Store data:', store?.data);
  console.log('Categories from store:', categories);

  const features = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Free Delivery",
      description: "Free delivery on orders over $50",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Quality Guarantee",
      description: "100% satisfaction guarantee on all products",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Fast Delivery",
      description: "Same-day delivery available",
    },
  ];

  const storeName = store?.data?.name || 'Fresh Grocery Market';

  return (
    <div className="space-y-12">
      <section className="relative bg-gradient-to-r from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Fresh Groceries
              <span className="text-green-600"> Delivered</span>
            </h1>
            <p className="text-lg text-green-700 mb-2">
              Welcome to {storeName}
            </p>
            <p className="text-xl text-muted-foreground mb-8">
              Shop from the comfort of your home and get fresh, quality groceries delivered to your doorstep in as little as 30 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/products">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Start Shopping
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground">
            Browse our wide selection of fresh, quality products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesLoading ? (
            // Loading skeleton for categories
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardHeader>
              </Card>
            ))
          ) : categoriesError ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-500">Error loading categories. Please try again later.</p>
            </div>
          ) : categories && categories.length > 0 ? (
            categories.slice(0, 6).map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href={`/products?category=${category.slug}`}>
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-2">
                      {category.image && category.image.startsWith('http') ? (
                        <img 
                          src={category.image} 
                          alt={category.name} 
                          className="w-12 h-12 mx-auto object-cover rounded-full" 
                        />
                      ) : category.icon ? (
                        <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">{category.icon}</span>
                        </div>
                      ) : (
                        <span>{getCategoryEmoji(category.name)}</span>
                      )}
                    </div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No categories available for this store.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose GroceryShop?</h2>
            <p className="text-muted-foreground">
              We're committed to providing the best shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground">
            Check out our most popular items
          </p>
        </div>

        <ProductGrid 
          products={featuredProducts?.slice(0, 4) || []} 
          loading={productsLoading}
          variant="grid"
        />
      </section>

      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who trust us for their grocery needs
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/products">
              Shop Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}