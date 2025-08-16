import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Products, User } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private async checkForRecordOrThrowError(id: string): Promise<Products> {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            ownerId: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        attributes: {
          include: {
            attributeValue: {
              include: {
                attributes: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  private async validateStoreOwnership(
    storeId: string,
    userId: string,
  ): Promise<void> {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { ownerId: true },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (store.ownerId !== userId) {
      throw new ForbiddenException(
        'You can only manage products for your own store',
      );
    }
  }

  private async validateProductOwnership(
    productId: string,
    userId: string,
  ): Promise<Products> {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
      include: {
        store: {
          select: { ownerId: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.store.ownerId !== userId) {
      throw new ForbiddenException('You can only manage your own products');
    }

    return product;
  }

  async create(reqUser: Partial<User>, createProductDto: CreateProductDto) {
    if (!reqUser.id) {
      throw new BadRequestException('User ID is required');
    }
    await this.validateStoreOwnership(createProductDto.storeId, reqUser.id);

    // Check if SKU already exists
    const existingSku = await this.prisma.products.findUnique({
      where: { sku: createProductDto.sku },
    });
    if (existingSku) {
      throw new BadRequestException('SKU already exists');
    }

    // Check if slug already exists
    const existingSlug = await this.prisma.products.findUnique({
      where: { slug: createProductDto.slug },
    });
    if (existingSlug) {
      throw new BadRequestException('Slug already exists');
    }

    const { categoryIds, attributeValueIds, images, ...productData } =
      createProductDto;

    // Create product with relations
    const product = await this.prisma.products.create({
      data: {
        ...productData,
        // Connect categories if provided
        ...(categoryIds &&
          categoryIds.length > 0 && {
            categories: {
              create: categoryIds.map((categoryId) => ({
                categoryId,
              })),
            },
          }),
        // Connect attribute values if provided
        ...(attributeValueIds &&
          attributeValueIds.length > 0 && {
            attributes: {
              create: attributeValueIds.map((attributeValueId) => ({
                attributeValueId,
              })),
            },
          }),
        // Set images array if provided
        ...(images && images.length > 0 && { images }),
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        attributes: {
          include: {
            attributeValue: {
              include: {
                attributes: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Update store product count
    await this.prisma.store.update({
      where: { id: createProductDto.storeId },
      data: {
        product_count: {
          increment: 1,
        },
      },
    });

    return product;
  }

  async findAll(query: GetProductsDto) {
    const {
      page = 1,
      limit = 10,
      search,
      storeId,
      status,
      categoryId,
      category,
      in_stock,
      min_price,
      max_price,
      sort_by = 'created_at',
      sort_order = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Handle category filtering by slug if provided
    let categoryFilter = {};
    if (categoryId) {
      categoryFilter = {
        categories: {
          some: {
            categoryId,
          },
        },
      };
    } else if (category) {
      categoryFilter = {
        categories: {
          some: {
            category: {
              slug: category,
            },
          },
        },
      };
    }

    // Build where clause
    const where: Prisma.ProductsWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
          { tags: { has: search } },
        ],
      }),
      ...(storeId && { storeId }),
      ...(status && { status }),
      ...(in_stock !== undefined && { in_stock }),
      ...categoryFilter,
      ...((min_price !== undefined || max_price !== undefined) && {
        price: {
          ...(min_price !== undefined && { gte: min_price }),
          ...(max_price !== undefined && { lte: max_price }),
        },
      }),
    };

    // Build order by
    const orderBy: Prisma.ProductsOrderByWithRelationInput = {
      [sort_by]: sort_order,
    };

    const [products, total] = await Promise.all([
      this.prisma.products.findMany({
        skip,
        take: limit,
        where,
        orderBy,
        include: {
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          attributes: {
            include: {
              attributeValue: {
                include: {
                  attributes: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.products.count({ where }),
    ]);

    return {
      products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.checkForRecordOrThrowError(id);
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.products.findUnique({
      where: { slug },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            ownerId: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        attributes: {
          include: {
            attributeValue: {
              include: {
                attributes: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    reqUser: Partial<User>,
  ) {
    if (!reqUser.id) {
      throw new BadRequestException('User ID is required');
    }
    await this.validateProductOwnership(id, reqUser.id);

    // Check if SKU is being updated and if it conflicts
    if (updateProductDto.sku) {
      const existingSku = await this.prisma.products.findFirst({
        where: {
          sku: updateProductDto.sku,
          NOT: { id },
        },
      });
      if (existingSku) {
        throw new BadRequestException('SKU already exists');
      }
    }

    // Check if slug is being updated and if it conflicts
    if (updateProductDto.slug) {
      const existingSlug = await this.prisma.products.findFirst({
        where: {
          slug: updateProductDto.slug,
          NOT: { id },
        },
      });
      if (existingSlug) {
        throw new BadRequestException('Slug already exists');
      }
    }

    const { categoryIds, attributeValueIds, images, ...productData } =
      updateProductDto;

    // Update product with relations
    const product = await this.prisma.products.update({
      where: { id },
      data: {
        ...productData,
        // Update categories if provided
        ...(categoryIds !== undefined && {
          categories: {
            deleteMany: {},
            create: categoryIds.map((categoryId) => ({
              categoryId,
            })),
          },
        }),
        // Update attribute values if provided
        ...(attributeValueIds !== undefined && {
          attributes: {
            deleteMany: {},
            create: attributeValueIds.map((attributeValueId) => ({
              attributeValueId,
            })),
          },
        }),
        // Update images if provided
        ...(images !== undefined && { images }),
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        attributes: {
          include: {
            attributeValue: {
              include: {
                attributes: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return product;
  }

  async remove(id: string, reqUser: Partial<User>) {
    if (!reqUser.id) {
      throw new BadRequestException('User ID is required');
    }
    const product = await this.validateProductOwnership(id, reqUser.id);

    const deletedProduct = await this.prisma.products.delete({
      where: { id },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        attributes: {
          include: {
            attributeValue: {
              include: {
                attributes: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Update store product count
    await this.prisma.store.update({
      where: { id: product.storeId },
      data: {
        product_count: {
          decrement: 1,
        },
      },
    });

    return deletedProduct;
  }

  // Additional utility methods
  async findByStore(storeId: string, query: GetProductsDto) {
    return this.findAll({ ...query, storeId });
  }

  async findByStoreSlug(storeSlug: string, query: GetProductsDto) {
    // First get the store ID from slug
    const store = await this.prisma.store.findUnique({
      where: { slug: storeSlug },
      select: { id: true, is_active: true },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (!store.is_active) {
      throw new NotFoundException('Store is not active');
    }

    return this.findAll({ ...query, storeId: store.id });
  }

  async findByCategory(categoryId: string, query: GetProductsDto) {
    return this.findAll({ ...query, categoryId });
  }

  async updateStock(id: string, quantity: number, reqUser: Partial<User>) {
    if (!reqUser.id) {
      throw new BadRequestException('User ID is required');
    }
    await this.validateProductOwnership(id, reqUser.id);

    return this.prisma.products.update({
      where: { id },
      data: {
        quantity,
        in_stock: quantity > 0,
        status: quantity > 0 ? 'PUBLISHED' : 'OUT_OF_STOCK',
      },
    });
  }
}
