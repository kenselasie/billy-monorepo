import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({ description: 'Upload operation success status' })
  success: boolean;

  @ApiProperty({ description: 'Relative path to the uploaded file' })
  path: string;

  @ApiProperty({ description: 'Full URL to access the uploaded file' })
  url: string;

  @ApiProperty({ description: 'Generated filename of the uploaded file' })
  filename: string;

  @ApiProperty({ description: 'File size in bytes' })
  size: number;

  @ApiProperty({ description: 'MIME type of the uploaded file' })
  mimetype: string;
}
