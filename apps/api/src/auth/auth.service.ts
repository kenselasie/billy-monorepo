import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/register-users.dto';

type UserWithRoles = Prisma.UserGetPayload<{
  include: { roles: true };
}>;
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  AUTH_ERROR_MSG = 'An error occurred, please contact help';

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        roles: true,
      },
    });
    if (!user) throw new BadRequestException(this.AUTH_ERROR_MSG); // User not found
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException(this.AUTH_ERROR_MSG); // Wrong password

    // const { password: _, ...result } = user;
    return user;
  }

  async login(user: UserWithRoles): Promise<{
    message: string;
    data: { user: Partial<User>; accessToken: string };
    success: boolean;
  }> {
    const payload = {
      email: user.email,
      id: user.id,
      roles: user.roles.map((role) => role.name),
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Successfully logged in',
      data: { user: user, accessToken },
      success: true,
    };
  }

  async register(userData: CreateUserDto): Promise<{
    message: string;
    data: { user: Partial<User>; accessToken: string };
    success: boolean;
  }> {
    const { firstName, lastName, password, email, permission } = userData;

    const userExist = await this.prisma.user.findMany({
      where: { email },
    });
    if (userExist.length > 0) {
      throw new BadRequestException(this.AUTH_ERROR_MSG); //User with email/username already exists
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = {
      first_name: firstName,
      last_name: lastName,
      other_names: lastName,
      password: hash,
      email: email,
      permission: permission,
    } as Prisma.UserCreateInput;

    const { password: _, ...createdUser } = await this.prisma.user.create({
      data: newUser,
    });
    const payload = {
      email: createdUser.email,
      id: createdUser.id,
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      message: 'Successfully registered',
      data: { user: createdUser, accessToken },
      success: true,
    };
  }
}
