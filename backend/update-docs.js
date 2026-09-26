const fs = require('fs');
const path = 'D:/NexPortal/NexOffice/backend/src/documents/documents.service.ts';
let content = fs.readFileSync(path, 'utf8');

const newMethod = 
  async generateStudentIdCard(studentId: string): Promise<Buffer> {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const PDFDocument = require('pdfkit');
    
    return new Promise<Buffer>(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: [250, 400], margin: 0 }); // ID card size
        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Draw header background (Darker Red or Blue for students)
        doc.rect(0, 0, 250, 50).fill('#0B3D91'); 

        // Add Nexview text
        doc.fillColor('white')
           .fontSize(16)
           .text('NEXVIEW CONCEPT', 0, 15, { align: 'center', stroke: false });
        doc.fontSize(10)
           .text('STUDENT ID CARD', 0, 32, { align: 'center' });

        // Add photo placeholder (or actual photo if exists)
        doc.rect(75, 70, 100, 100).lineWidth(2).stroke('#0B3D91');
        doc.fillColor('#000').fontSize(14).text('PHOTO', 75, 110, { width: 100, align: 'center' });

        // Add details
        doc.fillColor('black').fontSize(14).font('Helvetica-Bold');
        doc.text(\\ \\, 0, 190, { align: 'center' });
        
        doc.fontSize(10).font('Helvetica');
        doc.text('ID Number:', 20, 230);
        doc.font('Helvetica-Bold').text(student.studentIdNumber || 'N/A', 90, 230);
        
        doc.font('Helvetica').text('Phone:', 20, 250);
        doc.font('Helvetica-Bold').text(student.phone || 'N/A', 90, 250);

        // QR Code placeholder text
        doc.font('Helvetica').fontSize(8);
        const QRCode = require('qrcode');
        const qrDataUrl = await QRCode.toDataURL(\https://nexviewconcept.com.ng/verify/student/\\);
        doc.image(qrDataUrl, 85, 290, { width: 80 });

        // Footer
        doc.rect(0, 380, 250, 20).fill('#0B3D91');
        doc.fillColor('white').fontSize(8).text('www.nexviewconcept.com.ng', 0, 385, { align: 'center' });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

;

content = content.replace('async verifyStaff(staffId: string) {', newMethod + '  async verifyStaff(staffId: string) {');
fs.writeFileSync(path, content, 'utf8');
