"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCategoriesQuery } from "@/data/use-category/use-get-categories";
import { useAddCategoryMutation } from "@/data/use-category/use-add-category";
import { toast } from "sonner";

const CategoryFormSchema = z.object({
  image: z.any().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  details: z.string().optional(),
  parent_id: z.string().optional(),
});

type CategoryFormData = z.infer<typeof CategoryFormSchema>;

const AddCategory = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data: parentCategories } = useGetCategoriesQuery({
    root_only: "true",
    limit: "100", // Fetch all possible parent categories
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(CategoryFormSchema),
  });

  const { mutate: addCategory, isPending } = useAddCategoryMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    addCategory(data, {
      onSuccess: () => {
        toast.success("Category added successfully");
        // Optional: redirect to categories list
      },
      onError: () => {
        toast.error("Failed to add category");
      },
    });
  };

  return (
    <div className="container mx-auto py-10">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Categories", href: "/category" },
          { label: "Add Category" },
        ]}
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image">Category Image</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register("slug")} />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Details</Label>
              <Textarea id="details" {...register("details")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_id">Parent Category</Label>
              <Select onValueChange={(value) => setValue("parent_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category..." />
                </SelectTrigger>
                <SelectContent>
                  {parentCategories?.data.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Category"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;
