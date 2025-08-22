import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/role/role.decorator';
import { Prisma } from '@prisma/client';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Roles(['super_admin', 'store_owner'])
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const data = await this.categoryService.create(createCategoryDto);
    return {
      message: 'Category created successfully',
      success: true,
      data,
    };
  }

  @Get()
  async findAll(@Query() query: any) {
    const { page = 1, limit = 10, search, root_only } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Prisma.CategoryWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        root_only === 'true' ? { parent_id: null } : {},
      ],
    };

    const [data, total] = await this.categoryService.findAll({
      skip,
      take: Number(limit),
      where,
      orderBy: { created_at: 'desc' },
    });

    return {
      message: 'Categories retrieved successfully',
      success: true,
      data,
      meta: { total, page: Number(page), limit: Number(limit) },
    };
  }

  @Get('store/:storeSlug')
  @ApiOperation({
    summary: 'Get categories by store slug (public endpoint for frontend)',
    description:
      'Retrieve all categories belonging to a specific store using the store slug.',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async getCategoriesByStoreSlug(@Param('storeSlug') storeSlug: string) {
    const [data] =
      await this.categoryService.getCategoriesByStoreSlug(storeSlug);
    return data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.categoryService.findOne(id);
    return {
      message: 'Category retrieved successfully',
      success: true,
      data,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(['super_admin', 'store_owner'])
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const data = await this.categoryService.update(id, updateCategoryDto);
    return {
      message: 'Category updated successfully',
      success: true,
      data,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(['super_admin', 'store_owner'])
  async remove(@Param('id') id: string) {
    const data = await this.categoryService.remove(id);
    return {
      message: 'Category deleted successfully',
      success: true,
      data,
    };
  }
}
