const fs = require('fs');
let code = fs.readFileSync('src/documents/documents.service.ts', 'utf8');

// The code starts at "const htmlContent = " and is a broken string
// It's at the end of the file, let's just replace the entire generateCustomLetter method using regex

const methodRegex = /async generateCustomLetter\([\s\S]*?this\.generatePdf\(htmlContent\);\n  \}/g;

const correctMethod = sync generateCustomLetter(recipient: string, subject: string, content: string): Promise<Buffer> {
    const lh = await this.prisma.systemSetting.findUnique({ where: { key: 'letterhead' } });
    const sig = await this.prisma.systemSetting.findUnique({ where: { key: 'signature' } });
    const letterheadUrl = lh?.value;
    const signatureUrl = sig?.value;

    if (!letterheadUrl || !signatureUrl) {
      throw new BadRequestException('System letterhead or signature not configured.');
    }

    const htmlContent = \\\
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; color: #333; }
        .container { padding: 40px; position: relative; }
        .header { text-align: center; margin-bottom: 40px; }
        .header img { max-width: 100%; height: auto; max-height: 150px; }
        .date { text-align: right; margin-bottom: 20px; font-weight: bold; }
        .recipient { margin-bottom: 30px; white-space: pre-line; font-weight: bold; }
        .title { text-align: center; font-size: 18px; font-weight: bold; text-decoration: underline; margin-bottom: 30px; text-transform: uppercase; }
        .content { line-height: 1.6; text-align: justify; }
        .footer { margin-top: 50px; }
        .signature { max-width: 150px; max-height: 80px; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="\" alt="Letterhead" />
        </div>
        
        <div class="date">
          Date: \
        </div>

        <div class="recipient">
          \
        </div>

        <div class="title">
          \
        </div>

        <div class="content">
          \
        </div>

        <div class="footer">
          <p>Yours faithfully,</p>
          <img class="signature" src="\" alt="Signature" />
          <p><b>MD/CEO</b><br/>Nexview Concept</p>
        </div>
      </div>
    </body>
    </html>
    \\\;

    return this.generatePdf(htmlContent);
  };

code = code.replace(methodRegex, correctMethod);
fs.writeFileSync('src/documents/documents.service.ts', code);
