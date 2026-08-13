import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class StaffProfilesService {
  constructor(private prisma: PrismaService, private documents: DocumentsService) {}

  async createProfile(data: any) {
    const { email, password, firstName, lastName, department, designation } = data;
    const passwordHash = await argon2.hash(password);
    const staffIdNumber = `NEX-${Math.floor(1000 + Math.random() * 9000)}`;

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          roles: {
            create: [{ role: { connect: { name: 'OPERATOR' } } }]
          }
        }
      });

      const profile = await tx.staffProfile.create({
        data: {
          userId: user.id,
          firstName,
          middleName: data.middleName || null,
          lastName,
          department,
          designation,
          staffIdNumber,
          dateJoined: new Date()
        }
      });
      return profile;
    });
  }

  async getAllProfiles() {
    return this.prisma.staffProfile.findMany({
      include: { user: { select: { email: true, status: true } } },
      orderBy: { dateJoined: 'desc' }
    });
  }

  async getProfileByUserId(userId: string) {
    const profile = await this.prisma.staffProfile.findUnique({
      where: { userId },
      include: { user: { select: { email: true, status: true, roles: { include: { role: true } } } } }
    });
    if (!profile) throw new NotFoundException('Profile not found for this user');
    return profile;
  }

  async updateProfileByUserId(userId: string, data: any) {
    const { firstName, middleName, lastName, department, designation } = data;
    const existing = await this.prisma.staffProfile.findUnique({ where: { userId } });
    if (!existing) {
      // Create if doesn't exist
      const staffIdNumber = `NEX-${Math.floor(1000 + Math.random() * 9000)}`;
      return this.prisma.staffProfile.create({
        data: {
          userId,
          firstName,
          middleName: data.middleName || null,
          lastName,
          department,
          designation,
          staffIdNumber,
          dateJoined: new Date()
        }
      });
    }

    return this.prisma.staffProfile.update({
      where: { userId },
      data: { firstName, middleName, lastName, department, designation }
    });
  }
  
  async updateMyPhoto(userId: string, filename: string) {
    const profile = await this.getProfileByUserId(userId);
    return this.prisma.staffProfile.update({
      where: { id: profile.id },
      data: { photoUrl: `/uploads/${filename}` }
    });
  }
  
  async updatePhoto(id: string, filename: string) {
    return this.prisma.staffProfile.update({
      where: { id },
      data: { photoUrl: `/uploads/${filename}` }
    });
  }

  async generateStaffIdCard(id: string) {
    const profile = await this.prisma.staffProfile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Profile not found');
    
    // Fallback logo if not available
    const photoUrl = profile.photoUrl ? `http://localhost:3000${profile.photoUrl}` : '';
    const verifyUrl = `http://localhost:5173/verify/staff/${profile.staffIdNumber}`;
    const qrCode = await this.documents.generateQrCode(verifyUrl);

    const html = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; display: flex; justify-content: center; align-items: center; padding: 20px; background: #fff; }
            .id-card { border: 2px solid #E50914; border-radius: 10px; width: 350px; height: 550px; text-align: center; overflow: hidden; background: #fff; position: relative; }
            .header { background: #E50914; color: white; padding: 15px; font-weight: bold; font-size: 18px; }
            .photo { width: 150px; height: 150px; border-radius: 75px; object-fit: cover; margin: 20px auto; border: 4px solid #E50914; }
            .name { font-size: 24px; font-weight: bold; color: #111827; margin: 10px 0; }
            .designation { font-size: 16px; color: #E50914; font-weight: bold; margin-bottom: 5px; }
            .department { font-size: 14px; color: #6B7280; margin-bottom: 20px; }
            .staff-id { font-size: 16px; font-weight: bold; font-family: monospace; background: #F3F4F6; padding: 5px 15px; border-radius: 20px; display: inline-block; }
            .qr-container { position: absolute; bottom: 20px; left: 0; right: 0; display: flex; justify-content: center; }
            .qr { width: 80px; height: 80px; }
          </style>
        </head>
        <body>
          <div class="id-card">
            <div class="header">NEXVIEW CONCEPT LIMITED</div>
            ${profile.photoUrl ? `<img class="photo" src="${photoUrl}" alt="Photo" />` : `<div class="photo" style="background:#eee; line-height:150px; color:#999; margin: 20px auto; border-radius: 75px; width: 150px; height: 150px;">NO PHOTO</div>`}
            <div class="name">${profile.firstName} ${profile.lastName}</div>
            <div class="designation">${profile.designation || 'Staff Member'}</div>
            <div class="department">${profile.department || 'Operations'}</div>
            <div class="staff-id">${profile.staffIdNumber}</div>
            <div class="qr-container">
              <img class="qr" src="${qrCode}" alt="QR" />
            </div>
          </div>
        </body>
      </html>
    `;
    return this.documents.generatePdf(html);
  }

  async deleteProfile(id: string) {
    return this.prisma.staffProfile.delete({ where: { id } });
  }
}
