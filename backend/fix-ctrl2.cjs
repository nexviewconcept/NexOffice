const fs = require('fs');
let code = fs.readFileSync('src/documents/documents.controller.ts', 'utf8');

const regex = /async compressPdfFile[\s\S]*?\}\n\s*\}/;
const newCode = sync compressPdfFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const compressedBuffer = await this.documentsService.compressPdf(file.buffer);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=compressed_' + file.originalname,
      'Content-Length': compressedBuffer.length,
    });
    res.end(compressedBuffer);
  }
};

code = code.replace(regex, newCode);
fs.writeFileSync('src/documents/documents.controller.ts', code);
