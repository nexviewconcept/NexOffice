"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FilesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const zlib = __importStar(require("zlib"));
let FilesService = FilesService_1 = class FilesService {
    prisma;
    logger = new common_1.Logger(FilesService_1.name);
    uploadDir = path.join(process.cwd(), 'uploads', 'files');
    constructor(prisma) {
        this.prisma = prisma;
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    async uploadFile(file, folder, description, userId, sharedWith, shouldCompress) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        let fileBuffer = file.buffer;
        let originalName = file.originalname;
        let mimeType = file.mimetype;
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
        fs.writeFileSync(filePath, fileBuffer);
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
    async listFiles(folder, userId, userEmail, isSuperAdmin) {
        const whereClause = {};
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
        return allFiles.filter(file => {
            if (!file.sharedWith || file.sharedWith === 'ALL')
                return true;
            if (file.uploadedById === userId)
                return true;
            if (file.sharedWith === 'SELF')
                return file.uploadedById === userId;
            if (userEmail && file.sharedWith.includes(userEmail))
                return true;
            return false;
        });
    }
    async getFileStream(id) {
        const fileRecord = await this.prisma.file.findUnique({ where: { id } });
        if (!fileRecord)
            throw new common_1.NotFoundException('File not found');
        const filePath = path.join(this.uploadDir, fileRecord.filename);
        if (!fs.existsSync(filePath))
            throw new common_1.NotFoundException('File physical not found on disk');
        const fileStream = fs.createReadStream(filePath);
        return {
            stream: new common_1.StreamableFile(fileStream),
            mimeType: fileRecord.mimeType,
            originalName: fileRecord.originalName
        };
    }
    async deleteFile(id) {
        const fileRecord = await this.prisma.file.findUnique({ where: { id } });
        if (!fileRecord)
            throw new common_1.NotFoundException('File not found');
        const filePath = path.join(this.uploadDir, fileRecord.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        await this.prisma.file.delete({ where: { id } });
        return { success: true };
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = FilesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FilesService);
//# sourceMappingURL=files.service.js.map