import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, description: 'URL to store logo' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ required: false, description: 'URL to store cover image' })
  @IsOptional()
  @IsString()
  cover_image?: string;

  @ApiProperty({
    required: false,
    type: [String],
    description: 'Array of store image URLs',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty()
  @IsOptional()
  addressId?: string;
}
