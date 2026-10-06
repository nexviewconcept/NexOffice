const fs = require('fs');
let code = fs.readFileSync('src/pages/MergePdf.tsx', 'utf8');

const logicRegex = /for \\(const file of files\\) \\{[\\s\\S]*?mergedPdf\\.addPage\\(page\\);\\n\\s*\\}\\n\\s*\\}/;

const newLogic = \or (const file of files) {
        const fileArrayBuffer = await file.arrayBuffer();
        if (file.type === 'application/pdf') {
          const pdf = await PDFDocument.load(fileArrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } else if (file.type.startsWith('image/')) {
          let image;
          if (file.type === 'image/jpeg') {
            image = await mergedPdf.embedJpg(fileArrayBuffer);
          } else if (file.type === 'image/png') {
            image = await mergedPdf.embedPng(fileArrayBuffer);
          }
          
          if (image) {
            const page = mergedPdf.addPage([image.width, image.height]);
            page.drawImage(image, {
              x: 0,
              y: 0,
              width: image.width,
              height: image.height,
            });
          }
        }
      }\;

code = code.replace(logicRegex, newLogic);
fs.writeFileSync('src/pages/MergePdf.tsx', code);
