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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const students_service_1 = require("./students.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const documents_service_1 = require("../documents/documents.service");
let StudentsController = class StudentsController {
    studentsService;
    documentsService;
    constructor(studentsService, documentsService) {
        this.studentsService = studentsService;
        this.documentsService = documentsService;
    }
    create(createStudentDto) {
        return this.studentsService.create(createStudentDto);
    }
    findAll() {
        return this.studentsService.findAll();
    }
    findOne(id) {
        return this.studentsService.findOne(id);
    }
    update(id, updateStudentDto) {
        return this.studentsService.update(id, updateStudentDto);
    }
    remove(id) {
        return this.studentsService.remove(id);
    }
    enrollCourse(id, body) {
        return this.studentsService.enrollCourse(id, body);
    }
    unenrollCourse(id, courseId) {
        return this.studentsService.unenrollCourse(id, courseId);
    }
    async getPdf(id, res) {
        const buffer = await this.documentsService.generateStudentIdCard(id);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="student-${id}.pdf"`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'HR'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'HR', 'OPERATOR'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'HR', 'OPERATOR'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'HR'),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "remove", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'HR'),
    (0, common_1.Post)(':id/enroll'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "enrollCourse", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'HR'),
    (0, common_1.Delete)(':id/enroll/:courseId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "unenrollCourse", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'HR', 'OPERATOR'),
    (0, common_1.Get)(':id/pdf'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "getPdf", null);
exports.StudentsController = StudentsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/v1/students'),
    __metadata("design:paramtypes", [students_service_1.StudentsService,
        documents_service_1.DocumentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map