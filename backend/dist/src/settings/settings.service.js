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
var SettingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SettingsService = SettingsService_1 = class SettingsService {
    prisma;
    logger = new common_1.Logger(SettingsService_1.name);
    defaultSettings = {
        'companyName': 'Nexview Concept Limited',
        'companyAddress': 'Abuja, Nigeria',
        'currency': 'NGN',
        'supportEmail': 'support@nexview.com',
        'supportPhone': '+234 800 000 0000',
    };
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        const records = await this.prisma.systemSetting.findMany();
        let settings = {};
        records.forEach(r => {
            settings[r.key] = r.value;
        });
        let missingDefaults = false;
        for (const [key, value] of Object.entries(this.defaultSettings)) {
            if (!settings[key]) {
                settings[key] = value;
                missingDefaults = true;
            }
        }
        if (missingDefaults) {
            await this.updateSettings(settings);
        }
        return settings;
    }
    async updateSettings(data) {
        const promises = Object.entries(data).map(([key, value]) => {
            return this.prisma.systemSetting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) }
            });
        });
        await Promise.all(promises);
        return { message: 'Settings updated successfully' };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = SettingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map