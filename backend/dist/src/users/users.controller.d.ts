import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: any): Promise<{
        roles: ({
            role: {
                id: string;
                name: string;
                description: string | null;
            };
        } & {
            roleId: string;
            userId: string;
        })[];
    } & {
        id: string;
        email: string;
        notificationEmail: string | null;
        passwordHash: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        status: string;
        createdAt: Date;
        roles: ({
            role: {
                id: string;
                name: string;
                description: string | null;
            };
        } & {
            roleId: string;
            userId: string;
        })[];
    }[]>;
    changePassword(req: any, body: any): Promise<{
        message: string;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        email: string;
        notificationEmail: string | null;
        passwordHash: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateRoles(id: string, roles: string[]): Promise<{
        roles: ({
            role: {
                id: string;
                name: string;
                description: string | null;
            };
        } & {
            roleId: string;
            userId: string;
        })[];
    } & {
        id: string;
        email: string;
        notificationEmail: string | null;
        passwordHash: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: string): Promise<{
        id: string;
        email: string;
        notificationEmail: string | null;
        passwordHash: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
