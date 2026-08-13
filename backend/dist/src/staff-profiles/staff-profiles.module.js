"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffProfilesModule = void 0;
const common_1 = require("@nestjs/common");
const staff_profiles_service_1 = require("./staff-profiles.service");
const staff_profiles_controller_1 = require("./staff-profiles.controller");
const documents_module_1 = require("../documents/documents.module");
let StaffProfilesModule = class StaffProfilesModule {
};
exports.StaffProfilesModule = StaffProfilesModule;
exports.StaffProfilesModule = StaffProfilesModule = __decorate([
    (0, common_1.Module)({
        imports: [documents_module_1.DocumentsModule],
        providers: [staff_profiles_service_1.StaffProfilesService],
        controllers: [staff_profiles_controller_1.StaffProfilesController]
    })
], StaffProfilesModule);
//# sourceMappingURL=staff-profiles.module.js.map