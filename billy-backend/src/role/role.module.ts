import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { RoleGuard } from './role.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [],
  providers: [PrismaService, JwtService, RoleGuard],
})
export class RoleModule {}
