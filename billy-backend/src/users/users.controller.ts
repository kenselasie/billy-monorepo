import {
  Controller,
  Get,
  Body,
  Req,
  Param,
  Delete,
  UseGuards,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma, User as UserModel } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/role/role.decorator';
import { CreateUserDto } from './dto/create-users.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  // @Roles(['super_admin', 'store_owner'])
  async getUserById(@Param('id') id: string): Promise<{
    data: Partial<Prisma.UserGetPayload<{}>>;
    success: boolean;
    message: string;
  }> {
    const data = await this.usersService.getUser({ id: id });
    return {
      message: 'Data successfully fetched',
      success: true,
      data,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  @Roles(['super_admin', 'store_owner', 'customer', 'staff'])
  async createUser(
    @Req() requestData: Request,
    @Body() userData: CreateUserDto,
  ): Promise<{
    message: string;
    success: boolean;
    data: Promise<Partial<Prisma.UserGetPayload<{}>>>;
  }> {
    const reqUser = requestData['user'];
    const user = this.usersService.createUser(reqUser, userData);
    return {
      data: user,
      message: 'Successfully sent invitation to user',
      success: true,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  @Roles(['super_admin', 'store_owner'])
  async getAllUsers(@Query() query: GetUsersDto): Promise<{
    message: string;
    success: boolean;
    data: Partial<Prisma.UserGetPayload<{}>>[];
    meta: {
      total: number;
      page: number;
      limit: number;
    };
  }> {
    const { page = 1, limit = 10, ...filters } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      AND: [
        filters.search
          ? {
              OR: [
                { email: { contains: filters.search, mode: 'insensitive' } },
                {
                  first_name: { contains: filters.search, mode: 'insensitive' },
                },
                {
                  last_name: { contains: filters.search, mode: 'insensitive' },
                },
              ],
            }
          : {},
        filters.role ? { roles: { some: { name: filters.role } } } : {},
        filters.is_active !== undefined ? { is_active: filters.is_active } : {},
        filters.created_at ? { created_at: { gte: filters.created_at } } : {},
      ],
    };

    const orderBy: Prisma.UserOrderByWithRelationInput = {
      created_at: 'desc',
    };

    const [data, total] = await this.usersService.getUsers({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return {
      message: 'Successfully retrieved users',
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @Roles(['super_admin', 'store_owner'])
  async deleteUser(
    @Req() requestData: Request,
    @Param('id') id: string,
  ): Promise<UserModel> {
    const reqUser = requestData['user'];
    return this.usersService.deleteUser(id, reqUser);
  }
}
