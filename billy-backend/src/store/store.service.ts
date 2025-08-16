import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, Store } from '@prisma/client';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  private async checkForRecordOrThrowError(id: string): Promise<Store> {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: {
        address: true,
        owner: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async createStore(
    reqUser: Partial<Prisma.UserGetPayload<{}>>,
    createStoreDto: CreateStoreDto,
  ) {
    const storeExists = await this.prisma.store.findUnique({
      where: { slug: createStoreDto.slug },
    });
    if (storeExists) throw new BadRequestException('Store slug already exists');

    return this.prisma.store.create({
      data: {
        ...createStoreDto,
        ownerId: reqUser.id as string,
      },
      include: {
        address: true,
        owner: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
  }

  async getStores(params: {
    skip?: number;
    take?: number;
    where?: Prisma.StoreWhereInput;
    orderBy?: Prisma.StoreOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    const [stores, total] = await Promise.all([
      this.prisma.store.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          address: true,
          owner: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      }),
      this.prisma.store.count({ where }),
    ]);

    return [stores, total];
  }

  async findOne(id: string) {
    return this.checkForRecordOrThrowError(id);
  }

  async getStoreBySlug(slug: string): Promise<Store> {
    const store = await this.prisma.store.findUnique({
      where: { slug },
      include: {
        address: true,
        categories: true,
        owner: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto, reqUserId: string) {
    const store = await this.checkForRecordOrThrowError(id);
    if (store.ownerId !== reqUserId) {
      throw new BadRequestException('You can only update your own store');
    }

    return this.prisma.store.update({
      where: { id },
      data: updateStoreDto,
      include: {
        address: true,
        owner: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
  }

  async remove(id: string, reqUserId: string) {
    const store = await this.checkForRecordOrThrowError(id);
    if (store.ownerId !== reqUserId) {
      throw new BadRequestException('You can only delete your own store');
    }

    return this.prisma.store.delete({
      where: { id },
      include: {
        address: true,
        owner: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
  }
}
