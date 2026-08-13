import { Injectable, Logger, NotFoundException, BadRequestException, StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as zlib from 'zlib';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'files');

  constructor(private prisma: PrismaService) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(
    file: Express.Multer.File, 
    folder: string, 
    description?: string, 
    userId?: string, 
    sharedWith?: string, 
    shouldCompress?: string | boolean
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    let fileBuffer = file.buffer;
    let originalName = file.originalname;
    let mimeType = file.mimetype;

    // Check if compression is requested
    if (shouldCompress === 'true' || shouldCompress === true) {
      this.logger.log(`Compressing file: ${originalName}`);
      fileBuffer = zlib.gzipSync(file.buffer);
      if (!originalName.endsWith('.gz')) {
        originalName = `${originalName}.gz`;
      }
      mimeType = 'application/gzip';
    }

    const ext = path.extname(originalName);
    const filename = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(this.uploadDir, filename);

    // Save to disk
    fs.writeFileSync(filePath, fileBuffer);

    // Save to DB
    const fileRecord = await this.prisma.file.create({
      data: {
        filename,
        originalName,
        mimeType,
        size: fileBuffer.length,
        folder: folder || 'General',
        description,
        sharedWith: sharedWith || 'ALL',
        uploadedById: userId,
      }
    });

    this.logger.log(`File uploaded: ${originalName} (Size: ${fileBuffer.length} bytes, SharedWith: ${sharedWith || 'ALL'})`);
    return fileRecord;
  }

  async listFiles(folder?: string, userId?: string, userEmail?: string, isSuperAdmin?: boolean) {
    const whereClause: any = {};
    if (folder && folder !== 'All') {
      whereClause.folder = folder;
    }

    const allFiles = await this.prisma.file.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    if (isSuperAdmin) {
      return allFiles;
    }

    // Filter by permissions / sharing
    return allFiles.filter(file => {
      if (!file.sharedWith || file.sharedWith === 'ALL') return true;
      if (file.uploadedById === userId) return true; // Can always see own files
      if (file.sharedWith === 'SELF') return file.uploadedById === userId;
      if (userEmail && file.sharedWith.includes(userEmail)) return true;
      return false;
    });
  }

  async getFileStream(id: string) {
    const fileRecord = await this.prisma.file.findUnique({ where: { id } });
    if (!fileRecord) throw new NotFoundException('File not found');

    const filePath = path.join(this.uploadDir, fileRecord.filename);
    if (!fs.existsSync(filePath)) throw new NotFoundException('File physical not found on disk');

    const fileStream = fs.createReadStream(filePath);
    return {
      stream: new StreamableFile(fileStream),
      mimeType: fileRecord.mimeType,
      originalName: fileRecord.originalName
    };
  }

  async deleteFile(id: string) {
    const fileRecord = await this.prisma.file.findUnique({ where: { id } });
    if (!fileRecord) throw new NotFoundException('File not found');

    const filePath = path.join(this.uploadDir, fileRecord.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.prisma.file.delete({ where: { id } });
    return { success: true };
  }
}
