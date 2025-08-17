import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { GetStoresDto } from './dto/get-stores.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/role/role.decorator';
import { Prisma } from '@prisma/client';

@ApiTags('Stores')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Roles(['super_admin', 'store_owner'])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new store',
    description:
      'Create a new store. Only authenticated users with store_owner or super_admin roles can create stores.',
  })
  @ApiResponse({ status: 201, description: 'Store created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or duplicate slug',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async create(
    @Req() requestData: Request,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    const reqUser = requestData['user'] as Prisma.UserGetPayload<{}>;
    const data = await this.storeService.createStore(reqUser, createStoreDto);
    return {
      message: 'Store created successfully',
      success: true,
      data,
    };
  }

  @Get()
  // @UseGuards(AuthGuard('jwt'))
  async findAll(@Query() query: GetStoresDto) {
    const { page = 1, limit = 10, ...filters } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.StoreWhereInput = {
      AND: [
        filters.search
          ? {
              OR: [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { slug: { contains: filters.search, mode: 'insensitive' } },
              ],
            }
          : {},
        filters.is_active !== undefined
          ? { is_active: Boolean(filters.is_active) }
          : {},
      ],
    };

    const orderBy: Prisma.StoreOrderByWithRelationInput = {
      created_at: 'desc',
    };

    const [data, total] = await this.storeService.getStores({
      where,
      orderBy,
      skip,
      take: Number(limit),
    });

    return {
      message: 'Stores retrieved successfully',
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get store by slug',
    description: 'Retrieve store details using the store slug.',
  })
  @ApiResponse({ status: 200, description: 'Store retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async getStoreBySlug(@Param('slug') slug: string) {
    const data = await this.storeService.getStoreBySlug(slug);
    return {
      message: 'Store retrieved successfully',
      success: true,
      data,
    };
  }

  @Get(':id')
  // @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string) {
    const data = await this.storeService.findOne(id);
    return {
      message: 'Store retrieved successfully',
      success: true,
      data,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(['super_admin', 'store_owner'])
  async update(
    @Req() requestData: Request,
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    const reqUser = requestData['user'] as Prisma.UserGetPayload<{}>;
    const data = await this.storeService.update(id, updateStoreDto, reqUser.id);
    return {
      message: 'Store updated successfully',
      success: true,
      data,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(['super_admin', 'store_owner'])
  async remove(@Req() requestData: Request, @Param('id') id: string) {
    const reqUser = requestData['user'] as Prisma.UserGetPayload<{}>;
    const data = await this.storeService.remove(id, reqUser.id);
    return {
      message: 'Store deleted successfully',
      success: true,
      data,
    };
  }
}
