"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAddStoreMutation } from "@/data/use-store/use-add-store";
import { useImageUploadMutation } from "@/data/use-upload";
import { Upload, X } from "lucide-react";
import Image from "next/image";

const ShopFormSchema = z.object({
  shopName: z.string().min(1, "Shop Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  streetAddress: z.string().optional(),
});

type ShopFormData = z.infer<typeof ShopFormSchema>;

interface UploadResponse {
  success: boolean;
  path: string;
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export default function AddShopPage() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShopFormData>({
    resolver: zodResolver(ShopFormSchema),
  });

  const { mutate: addStore, isPending } = useAddStoreMutation();
  const { mutate: uploadImage, isPending: pendingUploadImage } =
    useImageUploadMutation();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
  };

  const onSubmit = async (data: ShopFormData) => {
    try {
      let logoUrl = "";
      let coverImageUrl = "";

      // Upload images (if any) and create shop as one unified process
      // No separate toast messages for individual uploads

      // Upload logo if selected
      if (logoFile) {
        const logoResponse: UploadResponse = await new Promise(
          (resolve, reject) => {
            uploadImage(logoFile, {
              onSuccess: resolve,
              onError: reject,
            });
          }
        );
        logoUrl = logoResponse.url;
      }

      // Upload cover image if selected
      if (coverFile) {
        const coverResponse: UploadResponse = await new Promise(
          (resolve, reject) => {
            uploadImage(coverFile, {
              onSuccess: resolve,
              onError: reject,
            });
          }
        );
        coverImageUrl = coverResponse.url;
      }

      // Create shop with uploaded image URLs
      const shopData = {
        name: data.shopName,
        slug: data.slug,
        description: data.description || "",
        address: {
          country: data.country || "",
          city: data.city || "",
          state: data.state || "",
          zip: data.zip || "",
          streetAddress: data.streetAddress || "",
        },
        logo: logoUrl,
        cover_image: coverImageUrl,
      };

      addStore(shopData, {
        onSuccess: () => {
          toast.success("Shop created successfully!");
          reset();
          setLogoFile(null);
          setCoverFile(null);
          setLogoPreview(null);
          setCoverPreview(null);
        },
        onError: () => {
          toast.error("Failed to create shop");
        },
      });
    } catch (error) {
      toast.error("Failed to process request");
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Shop</CardTitle>
          <p className="text-muted-foreground">
            Add a new shop to your marketplace
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Logo and Cover Image Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-medium">Images</h3>
                <Separator className="flex-1" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Logo Upload */}
                <div className="space-y-3">
                  <Label>Shop Logo</Label>
                  <div className="space-y-3">
                    {logoPreview ? (
                      <div className="relative">
                        <Image
                          src={logoPreview}
                          alt="Logo Preview"
                          width={128}
                          height={128}
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={removeLogo}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 hover:border-muted-foreground/50 transition-colors cursor-pointer">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Upload Logo
                        </span>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Cover Image Upload */}
                <div className="space-y-3">
                  <Label>Cover Image</Label>
                  <div className="space-y-3">
                    {coverPreview ? (
                      <div className="relative">
                        <Image
                          src={coverPreview}
                          width={1170}
                          height={128}
                          alt="Cover Preview"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={removeCover}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 hover:border-muted-foreground/50 transition-colors cursor-pointer">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Upload Cover
                        </span>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended: 1170 x 435px
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <Separator className="flex-1" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name *</Label>
                  <Input
                    id="shopName"
                    placeholder="Enter shop name"
                    {...register("shopName")}
                  />
                  {errors.shopName && (
                    <p className="text-sm text-destructive">
                      {errors.shopName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    placeholder="shop-url-slug"
                    {...register("slug")}
                  />
                  {errors.slug && (
                    <p className="text-sm text-destructive">
                      {errors.slug.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your shop..."
                    rows={4}
                    {...register("description")}
                  />
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-medium">Address Information</h3>
                <Separator className="flex-1" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    {...register("country")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    {...register("city")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="NY" {...register("state")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="10001" {...register("zip")} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="streetAddress">Street Address</Label>
                  <Input
                    id="streetAddress"
                    placeholder="123 Main Street"
                    {...register("streetAddress")}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isPending || pendingUploadImage}
                size="lg"
                className="min-w-32"
              >
                {isPending || pendingUploadImage
                  ? "Processing..."
                  : "Create Shop"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
