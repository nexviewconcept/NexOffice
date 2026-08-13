import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class PermissionsService implements OnModuleInit {
    private prisma;
    private defaultPermissions;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private seedPermissions;
    getAllRolesAndPermissions(): Promise<{
        roles: ({
            permissions: ({
                permission: {
                    id: string;
                    description: string | null;
                    action: string;
                };
            } & {
                roleId: string;
                permissionId: string;
            })[];
        } & {
            id: string;
            name: string;
            description: string | null;
        })[];
        permissions: {
            id: string;
            description: string | null;
            action: string;
        }[];
    }>;
    updateRolePermissions(roleId: string, permissionIds: string[]): Promise<{
        success: boolean;
    }>;
}
