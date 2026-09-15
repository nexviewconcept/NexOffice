"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StudentsService = class StudentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        if (!data.studentIdNumber) {
            const count = await this.prisma.studentProfile.count();
            data.studentIdNumber = 'NEX-STU-' + (1000 + count + 1);
        }
        return this.prisma.studentProfile.create({ data });
    }
    async findAll() {
        return this.prisma.studentProfile.findMany({
            orderBy: { createdAt: 'desc' },
            include: { enrollments: { include: { course: true } } }
        });
    }
    async findOne(id) {
        const student = await this.prisma.studentProfile.findUnique({
            where: { id },
            include: { enrollments: { include: { course: true } } }
        });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        return student;
    }
    async update(id, data) {
        return this.prisma.studentProfile.update({ where: { id }, data });
    }
    async remove(id) {
        return this.prisma.studentProfile.delete({ where: { id } });
    }
    async enrollCourse(studentId, data) {
        return this.prisma.enrollment.create({
            data: {
                studentId,
                courseId: data.courseId,
                status: data.status || 'ENROLLED'
            }
        });
    }
    async unenrollCourse(studentId, courseId) {
        return this.prisma.enrollment.delete({
            where: {
                studentId_courseId: { studentId, courseId }
            }
        });
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map