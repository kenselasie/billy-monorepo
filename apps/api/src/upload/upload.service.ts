import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';
import * as path from 'path';
import * as fs from 'fs';
import { UploadResponseDto } from './dto/upload-response.dto';

@Injectable()
export class UploadService {
  private readonly uploadPath = path.join(
    process.cwd(),
    'public',
    'images',
    'uploads',
  );
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  constructor(private configService: ConfigService) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadResponseDto> {
    await this.validateFile(file);

    const filename = await this.generateUniqueFilename(file);
    const filePath = path.join(this.uploadPath, filename);

    // Write file to disk
    await fs.promises.writeFile(filePath, file.buffer);

    const publicPath = `/images/uploads/${filename}`;
    const baseUrl = this.getBaseUrl();
    const fullUrl = `${baseUrl}${publicPath}`;

    return {
      success: true,
      path: publicPath,
      url: fullUrl,
      filename: filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  private async validateFile(file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds limit of ${this.maxFileSize / (1024 * 1024)}MB`,
      );
    }

    // Verify file type by checking file buffer
    const fileType = await fileTypeFromBuffer(file.buffer);
    if (!fileType || !this.allowedMimeTypes.includes(fileType.mime)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and WebP images are allowed',
      );
    }

    // Double check mime type matches detected type
    if (file.mimetype !== fileType.mime) {
      throw new BadRequestException(
        'File extension does not match file content',
      );
    }
  }

  private async generateUniqueFilename(
    file: Express.Multer.File,
  ): Promise<string> {
    const fileType = await fileTypeFromBuffer(file.buffer);
    const extension = fileType?.ext || 'jpg';
    const timestamp = Date.now();
    const uuid = uuidv4();

    return `${uuid}-${timestamp}.${extension}`;
  }

  private getBaseUrl(): string {
    const port = this.configService.get<string>('PORT') || '3000';
    const host = this.configService.get<string>('HOST') || 'localhost';
    const protocol = this.configService.get<string>('PROTOCOL') || 'http';

    return `${protocol}://${host}:${port}`;
  }
}
