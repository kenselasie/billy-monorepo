import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, IsIn } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  organizationId?: string;

  @ApiProperty({ required: false, enum: ['Admin', 'Full Access', 'Read Only'] })
  @IsOptional()
  @IsIn(['Admin', 'Full Access', 'Read Only'])
  role?: 'Admin' | 'Full Access' | 'Read Only';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isContactPerson?: boolean;
}

export class CompleteUserRegistrationDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  organizationId?: string;
}

export class UpdatePasswordDto {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;
}
