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
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const prisma_service_1 = require("./prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
async function seedSuperAdmin(app) {
    try {
        const prisma = app.get(prisma_service_1.PrismaService);
        const adminEmail = 'admin@nexviewconcept.com.ng';
        const passwordHash = await bcrypt.hash('@Nx.cl17576', 10);
        const superAdminRole = await prisma.role.upsert({
            where: { name: 'SUPER_ADMIN' },
            update: {},
            create: { name: 'SUPER_ADMIN', description: 'System Administrator' },
        });
        await prisma.user.upsert({
            where: { email: adminEmail },
            update: { passwordHash },
            create: {
                email: adminEmail,
                passwordHash,
                status: 'ACTIVE',
                roles: { create: { roleId: superAdminRole.id } },
                staffProfile: {
                    create: {
                        firstName: 'System',
                        lastName: 'Administrator',
                        department: 'Management',
                        designation: 'Super Admin'
                    }
                }
            },
        });
        console.log('✅ Auto-seed Super Admin completed successfully');
    }
    catch (err) {
        console.error('Auto-seed check note:', err?.message || err);
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    app.enableCors();
    await seedSuperAdmin(app);
    await app.listen(process.env.PORT ?? 3000);
}
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
bootstrap().catch(err => {
    try {
        fs.writeFileSync(path.join(__dirname, '..', '..', 'crash.log'), `Crash Date: ${new Date().toISOString()}\nError: ${err?.stack || err?.message || String(err)}\n`);
    }
    catch (e) {
    }
    process.exit(1);
});
//# sourceMappingURL=main.js.map