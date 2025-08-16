import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, UserRole, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-users.dto';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

interface IUserGetQueryData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  other_names: string | null;
  is_active: boolean;
  profile_id: string | null;
  created_at: Date;
  updated_at: Date;
  roles: Array<{
    id: string;
    name: string;
  }>;
  profile: Record<string, any> | null;
}
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  AUTH_ERROR_MSG =
    'Please double check the data entered or contact your organization owner.';

  private async checkForRecordOrThrowError(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<Partial<Prisma.UserGetPayload<{}>>> {
    const result = await this.prisma.user.findUnique({
      where,
      include: {
        profile: true,
        roles: true,
      },
    });
    if (!result) throw new NotFoundException(this.AUTH_ERROR_MSG); // User not found
    const { password: _, ...payload } = result;
    return payload;
  }

  async createUser(
    reqUser: Partial<User>,
    data: CreateUserDto,
  ): Promise<Partial<Prisma.UserGetPayload<{}>>> {
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(reqUser.password, salt);
    const userAlreadyExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (userAlreadyExists) throw new BadRequestException('User Already Exists');
    const newUser = {
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      other_names: data.lastName,
      verified: false,
      password: passwordHash,
      mustResetPassword: true,
    } as Prisma.UserCreateInput;

    const { password: _, ...createdUser } = await this.prisma.user.create({
      data: newUser,
    });
    return createdUser;
  }

  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<Partial<Prisma.UserGetPayload<{}>>> {
    const result = await this.checkForRecordOrThrowError(userWhereUniqueInput);
    return result;
  }

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<[Array<IUserGetQueryData>, number]> {
    const { skip, take, cursor, where, orderBy } = params;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          other_names: true,
          is_active: true,
          profile_id: true,
          created_at: true,
          updated_at: true,
          roles: {
            select: {
              id: true,
              name: true,
            },
          },
          profile: true,
          password: false,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return [users, total];
  }

  async deleteUser(
    id: string,
    reqUser: Partial<User> & {
      role: UserRole;
    },
  ): Promise<Prisma.UserGetPayload<{}>> {
    const userToDelete = await this.checkForRecordOrThrowError({ id });
    if (reqUser.id === id) {
      throw new BadRequestException('You cannot delete yourself.');
    }

    return this.prisma.user.delete({
      where: {
        id: userToDelete.id,
      },
    });
  }
}
