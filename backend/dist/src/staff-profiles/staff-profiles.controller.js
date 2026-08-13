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
exports.StaffProfilesController = void 0;
const common_1 = require("@nestjs/common");
const staff_profiles_service_1 = require("./staff-profiles.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let StaffProfilesController = class StaffProfilesController {
    staffProfilesService;
    constructor(staffProfilesService) {
        this.staffProfilesService = staffProfilesService;
    }
    create(data) {
        return this.staffProfilesService.createProfile(data);
    }
    getAll() {
        return this.staffProfilesService.getAllProfiles();
    }
    getMyProfile(req) {
        return this.staffProfilesService.getProfileByUserId(req.user.id);
    }
    updateMyProfile(req, data) {
        return this.staffProfilesService.updateProfileByUserId(req.user.id, data);
    }
    uploadMyPhoto(req, file) {
        return this.staffProfilesService.updateMyPhoto(req.user.id, file.filename);
    }
    uploadPhoto(id, file) {
        return this.staffProfilesService.updatePhoto(id, file.filename);
    }
    async downloadIdCard(id, res, action) {
        const pdfBuffer = await this.staffProfilesService.generateStaffIdCard(id);
        const disposition = action === 'preview' ? 'inline' : 'attachment';
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `${disposition}; filename=staff-id.pdf`,
        });
        res.end(pdfBuffer);
    }
    deleteProfile(id) {
        return this.staffProfilesService.deleteProfile(id);
    }
};
exports.StaffProfilesController = StaffProfilesController;
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StaffProfilesController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StaffProfilesController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StaffProfilesController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Put)('me'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StaffProfilesController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Post)('me/photo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            }
        })
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StaffProfilesController.prototype, "uploadMyPhoto", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR'),
    (0, common_1.Post)(':id/photo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            }
        })
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StaffProfilesController.prototype, "uploadPhoto", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR'),
    (0, common_1.Get)(':id/id-card'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], StaffProfilesController.prototype, "downloadIdCard", null);
__decorate([
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StaffProfilesController.prototype, "deleteProfile", null);
exports.StaffProfilesController = StaffProfilesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/v1/staff-profiles'),
    __metadata("design:paramtypes", [staff_profiles_service_1.StaffProfilesService])
], StaffProfilesController);
//# sourceMappingURL=staff-profiles.controller.js.map