import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  private async checkForRecordOrThrowError(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        store: true,
      },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    // Check if store exists
    const store = await this.prisma.store.findUnique({
      where: { id: createCategoryDto.storeId },
    });
    if (!store) throw new NotFoundException('Store not found');

    // Check if category slug already exists for this store
    const categoryExists = await this.prisma.category.findUnique({
      where: { 
        slug_storeId: {
          slug: createCategoryDto.slug,
          storeId: createCategoryDto.storeId,
        }
      },
    });
    if (categoryExists)
      throw new BadRequestException('Category slug already exists for this store');

    return this.prisma.category.create({
      data: createCategoryDto,
      include: {
        parent: true,
        children: true,
        store: true,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          parent: true,
          children: true,
          store: true,
        },
      }),
      this.prisma.category.count({ where }),
    ]);

    return [categories, total];
  }

  async findOne(id: string) {
    return this.checkForRecordOrThrowError(id);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.checkForRecordOrThrowError(id);

    if (updateCategoryDto.slug) {
      const categoryExists = await this.prisma.category.findFirst({
        where: {
          slug: updateCategoryDto.slug,
          storeId: category.storeId,
          id: { not: id },
        },
      });
      if (categoryExists)
        throw new BadRequestException('Category slug already exists for this store');
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        parent: true,
        children: true,
        store: true,
      },
    });
  }

  async remove(id: string) {
    await this.checkForRecordOrThrowError(id);
    return this.prisma.category.delete({
      where: { id },
      include: {
        parent: true,
        children: true,
        store: true,
      },
    });
  }

  async getCategoriesByStoreSlug(storeSlug: string) {
    const store = await this.prisma.store.findUnique({
      where: { slug: storeSlug },
    });
    if (!store) throw new NotFoundException('Store not found');

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where: { storeId: store.id },
        include: {
          parent: true,
          children: true,
          store: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.category.count({ 
        where: { storeId: store.id } 
      }),
    ]);

    return [categories, total];
  }
}
