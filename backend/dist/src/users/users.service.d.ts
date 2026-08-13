import { PrismaService } from '../prisma/prisma.service';
import { EmailsService } from '../emails/emails.service';
export declare class UsersService {
    private prisma;
    private emailsService;
    private readonly mainSuperAdminEmail;
    constructor(prisma: PrismaService, emailsService: EmailsService);
    createUser(data: any): Promise<{
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
    changePassword(userId: string, currentPass: string, newPass: string): Promise<{
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
    updateRoles(id: string, roleNames: string[]): Promise<{
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
