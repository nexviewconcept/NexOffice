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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffProfilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon2 = __importStar(require("argon2"));
const documents_service_1 = require("../documents/documents.service");
let StaffProfilesService = class StaffProfilesService {
    prisma;
    documents;
    constructor(prisma, documents) {
        this.prisma = prisma;
        this.documents = documents;
    }
    async createProfile(data) {
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
    async getProfileByUserId(userId) {
        const profile = await this.prisma.staffProfile.findUnique({
            where: { userId },
            include: { user: { select: { email: true, status: true, roles: { include: { role: true } } } } }
        });
        if (!profile)
            throw new common_1.NotFoundException('Profile not found for this user');
        return profile;
    }
    async updateProfileByUserId(userId, data) {
        const { firstName, middleName, lastName, department, designation } = data;
        const existing = await this.prisma.staffProfile.findUnique({ where: { userId } });
        if (!existing) {
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
    async updateMyPhoto(userId, filename) {
        const profile = await this.getProfileByUserId(userId);
        return this.prisma.staffProfile.update({
            where: { id: profile.id },
            data: { photoUrl: `/uploads/${filename}` }
        });
    }
    async updatePhoto(id, filename) {
        return this.prisma.staffProfile.update({
            where: { id },
            data: { photoUrl: `/uploads/${filename}` }
        });
    }
    async generateStaffIdCard(id) {
        const profile = await this.prisma.staffProfile.findUnique({ where: { id } });
        if (!profile)
            throw new common_1.NotFoundException('Profile not found');
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
    async deleteProfile(id) {
        return this.prisma.staffProfile.delete({ where: { id } });
    }
};
exports.StaffProfilesService = StaffProfilesService;
exports.StaffProfilesService = StaffProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, documents_service_1.DocumentsService])
], StaffProfilesService);
//# sourceMappingURL=staff-profiles.service.js.map