import { PermissionsService } from './permissions.service';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    getRolesAndPermissions(): Promise<{
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
    updateRolePermissions(id: string, permissionIds: string[]): Promise<{
        success: boolean;
    }>;
}
