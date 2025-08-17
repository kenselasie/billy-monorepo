"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAddStoreMutation } from "@/data/use-store/use-add-store";

const SOCIAL_MEDIA_OPTIONS = [
  "Facebook",
  "Twitter",
  "Instagram",
  "LinkedIn",
  "YouTube",
  "Pinterest",
  "Snapchat",
  "TikTok",
  "Reddit",
  "WhatsApp",
];

const ShopFormSchema = z.object({
  logo: z.any().nullable().optional(),
  coverImage: z.any().nullable().optional(),
  shopName: z.string().nonempty("Shop Name is required"),
  slug: z.string().nonempty("Slug is required"),
  description: z.string(),
  accountHolderName: z.string(),
  accountHolderEmail: z.string().email("Invalid email address"),
  bankName: z.string(),
  accountNumber: z.string(),
  country: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  streetAddress: z.string(),
  contactNumber: z.string().nonempty("Contact Number is required"),
  website: z.string().optional().nullable(),
  socialMedia: z
    .array(
      z.object({
        platform: z.string().nonempty("Platform is required"),
        url: z.string().url("Invalid URL"),
      })
    )
    .optional(),
});

type ShopFormData = z.infer<typeof ShopFormSchema>;

export default function AddShopPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ShopFormData>({
    resolver: zodResolver(ShopFormSchema),
    defaultValues: {
      logo: null,
      coverImage: null,
      socialMedia: [{ platform: "", url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialMedia",
  });

  const { mutate: addStore, isPending } = useAddStoreMutation();

  const onSubmit = async (data: ShopFormData) => {
    // (TODO: in future): For logo and cover image, we need to append them to FormData
    // and send them as files to the server. For now, we are just sending the payload regularly
    const formData = new FormData();
    if (data.logo) formData.append("logo", data.logo);
    if (data.coverImage) formData.append("coverImage", data.coverImage);
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "logo" && key !== "coverImage") {
        formData.append(key, JSON.stringify(value));
      }
    });

    addStore(
      {
        name: "addStore",
        slug: data.slug,
        description: data.description,
      },
      {
        onSuccess: () => {
          toast.success("Shop added successfully!");
          reset();
          setLogoPreview(null);
          setCoverImagePreview(null);
        },
        onError: () => {
          toast.error("Failed to add shop");
        },
      }
    );
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Shop</CardTitle>
            {Object.keys(errors).length > 0 && (
              <p className="text-sm text-red-400 mt-2">
                Please fix the errors below before submitting.
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Section 1: Logo and Cover Image */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Logo and Cover Image</h3>
                  <Separator className="flex-1 mx-4" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Shop Logo</Label>
                    <div className="flex items-center gap-4">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-24 h-24 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-md border-2 border-dashed border-gray-200 flex items-center justify-center">
                          <span className="text-sm text-gray-500">No logo</span>
                        </div>
                      )}
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        {...register("logo")}
                        onChange={(e) => {
                          handleLogoChange(e);
                          register("logo").onChange(e);
                        }}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Image</Label>
                    <div className="space-y-2">
                      {coverImagePreview ? (
                        <img
                          src={coverImagePreview}
                          alt="Cover Image Preview"
                          className="w-full h-32 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="w-full h-32 rounded-md border-2 border-dashed border-gray-200 flex items-center justify-center">
                          <span className="text-sm text-gray-500">
                            No cover image
                          </span>
                        </div>
                      )}
                      <Input
                        id="coverImage"
                        type="file"
                        accept="image/*"
                        {...register("coverImage")}
                        onChange={(e) => {
                          handleCoverImageChange(e);
                          register("coverImage").onChange(e);
                        }}
                      />
                      <p className="text-xs text-gray-500">
                        Recommended: 1170 x 435px
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <Separator className="flex-1 mx-4" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Shop Name</Label>
                    <Input id="shopName" {...register("shopName")} />
                    {errors.shopName && (
                      <p className="text-sm text-red-400">
                        {errors.shopName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" {...register("slug")} />
                    {errors.slug && (
                      <p className="text-sm text-red-400">
                        {errors.slug.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register("description")} />
                    {errors.description && (
                      <p className="text-sm text-red-400">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Payment Information */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Payment Information</h3>
                  <Separator className="flex-1 mx-4" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">
                      Account Holder Name
                    </Label>
                    <Input
                      id="accountHolderName"
                      {...register("accountHolderName")}
                    />
                    {errors.accountHolderName && (
                      <p className="text-sm text-red-400">
                        {errors.accountHolderName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderEmail">
                      Account Holder Email
                    </Label>
                    <Input
                      id="accountHolderEmail"
                      {...register("accountHolderEmail")}
                    />
                    {errors.accountHolderEmail && (
                      <p className="text-sm text-red-400">
                        {errors.accountHolderEmail.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" {...register("bankName")} />
                    {errors.bankName && (
                      <p className="text-sm text-red-400">
                        {errors.bankName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" {...register("accountNumber")} />
                    {errors.accountNumber && (
                      <p className="text-sm text-red-400">
                        {errors.accountNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: Shop Address */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Shop Address</h3>
                  <Separator className="flex-1 mx-4" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" {...register("country")} />
                    {errors.country && (
                      <p className="text-sm text-red-400">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} />
                    {errors.city && (
                      <p className="text-sm text-red-400">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" {...register("state")} />
                    {errors.state && (
                      <p className="text-sm text-red-400">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP</Label>
                    <Input id="zip" {...register("zip")} />
                    {errors.zip && (
                      <p className="text-sm text-red-400">
                        {errors.zip.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="streetAddress">Street Address</Label>
                    <Input id="streetAddress" {...register("streetAddress")} />
                    {errors.streetAddress && (
                      <p className="text-sm text-red-400">
                        {errors.streetAddress.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 5: Shop Settings */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Shop Settings</h3>
                  <Separator className="flex-1 mx-4" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input id="contactNumber" {...register("contactNumber")} />
                    {errors.contactNumber && (
                      <p className="text-sm text-red-400">
                        {errors.contactNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" {...register("website")} />
                    {errors.website && (
                      <p className="text-sm text-red-400">
                        {errors.website.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 6: Social Media Information */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Social Media</h3>
                  <Separator className="flex-1 mx-4" />
                </div>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-gray-50"
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-48 flex justify-between items-center"
                          >
                            {SOCIAL_MEDIA_OPTIONS.find(
                              (option) => option === field.platform
                            ) || "Select..."}
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {SOCIAL_MEDIA_OPTIONS.map((option) => (
                            <DropdownMenuItem
                              key={option}
                              onClick={() => {
                                const updatedFields = [...fields];
                                updatedFields[index].platform = option;
                                setValue("socialMedia", updatedFields);
                              }}
                            >
                              {option}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Input
                        placeholder="URL"
                        {...register(`socialMedia.${index}.url`)}
                      />
                      <small className="text-red-400">
                        {errors.socialMedia?.[index]?.url?.message}
                      </small>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ platform: "", url: "" })}
                    className="w-full"
                  >
                    Add Social Media Profile
                  </Button>
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={isPending} size="lg">
                  {isPending ? "Creating Shop..." : "Create Shop"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
