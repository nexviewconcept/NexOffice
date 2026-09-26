import { PrismaService } from '../prisma/prisma.service';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        assignee: {
            id: string;
            email: string;
            staffProfile: {
                firstName: string;
                lastName: string;
            } | null;
        } | null;
        creator: {
            id: string;
            email: string;
            staffProfile: {
                firstName: string;
                lastName: string;
            } | null;
        };
        comments: ({
            user: {
                id: string;
                email: string;
                staffProfile: {
                    firstName: string;
                    lastName: string;
                } | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            content: string;
            taskId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        title: string;
        assigneeId: string | null;
        creatorId: string;
    })[]>;
    create(data: any, creatorId: string): Promise<{
        id: string;
        description: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        title: string;
        assigneeId: string | null;
        creatorId: string;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        description: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        title: string;
        assigneeId: string | null;
        creatorId: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        description: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        title: string;
        assigneeId: string | null;
        creatorId: string;
    }>;
    addComment(taskId: string, userId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        taskId: string;
    }>;
}
