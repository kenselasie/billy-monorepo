import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/role.decorator';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { Prisma } from '@prisma/client';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Roles(['super_admin', 'store_owner'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new product',
    description:
      'Create a new product in the specified store. Only store owners can create products for their stores.',
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Product created successfully' },
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          description: 'Created product with all relationships',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or duplicate SKU/slug',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not authorized to create products for this store',
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async create(
    @Req() requestData: Request,
    @Body() createProductDto: CreateProductDto,
  ) {
    const reqUser = requestData['user'] as Prisma.UserGetPayload<
      Record<string, never>
    >;
    const data = await this.productsService.create(reqUser, createProductDto);
    return {
      message: 'Product created successfully',
      success: true,
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findAll(@Query() query: GetProductsDto) {
    const result = await this.productsService.findAll(query);
    return {
      message: 'Products retrieved successfully',
      success: true,
      data: result.products,
      meta: result.meta,
    };
  }

  @Get('store/:storeId')
  @ApiOperation({ summary: 'Get products by store ID' })
  @ApiResponse({
    status: 200,
    description: 'Store products retrieved successfully',
  })
  async findByStore(
    @Param('storeId') storeId: string,
    @Query() query: GetProductsDto,
  ) {
    const result = await this.productsService.findByStore(storeId, query);
    return {
      message: 'Store products retrieved successfully',
      success: true,
      data: result.products,
      meta: result.meta,
    };
  }

  @Get('store/slug/:storeSlug')
  @ApiOperation({ summary: 'Get products by store slug (public endpoint for frontend)' })
  @ApiResponse({
    status: 200,
    description: 'Store products retrieved successfully',
  })
  async findByStoreSlug(
    @Param('storeSlug') storeSlug: string,
    @Query() query: GetProductsDto,
  ) {
    const result = await this.productsService.findByStoreSlug(storeSlug, query);
    return result.products;
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug (public endpoint for frontend)' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findBySlug(@Param('slug') slug: string) {
    const data = await this.productsService.findBySlug(slug);
    return data;
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({
    status: 200,
    description: 'Category products retrieved successfully',
  })
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: GetProductsDto,
  ) {
    const result = await this.productsService.findByCategory(categoryId, query);
    return {
      message: 'Category products retrieved successfully',
      success: true,
      data: result.products,
      meta: result.meta,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string) {
    const data = await this.productsService.findOne(id);
    return {
      message: 'Product retrieved successfully',
      success: true,
      data,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(['super_admin', 'store_owner'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - not product owner' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Req() requestData: Request,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const reqUser = requestData['user'] as Prisma.UserGetPayload<
      Record<string, never>
    >;
    const data = await this.productsService.update(
      id,
      updateProductDto,
      reqUser,
    );
    return {
      message: 'Product updated successfully',
      success: true,
      data,
    };
  }

  @Patch(':id/stock')
  @UseGuards(AuthGuard('jwt'))
  @Roles(['super_admin', 'store_owner'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product stock quantity' })
  @ApiResponse({
    status: 200,
    description: 'Product stock updated successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not product owner' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateStock(
    @Req() requestData: Request,
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    const reqUser = requestData['user'] as Prisma.UserGetPayload<
      Record<string, never>
    >;
    const data = await this.productsService.updateStock(id, quantity, reqUser);
    return {
      message: 'Product stock updated successfully',
      success: true,
      data,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(['super_admin', 'store_owner'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not product owner' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Req() requestData: Request, @Param('id') id: string) {
    const reqUser = requestData['user'] as Prisma.UserGetPayload<
      Record<string, never>
    >;
    const data = await this.productsService.remove(id, reqUser);
    return {
      message: 'Product deleted successfully',
      success: true,
      data,
    };
  }
}
