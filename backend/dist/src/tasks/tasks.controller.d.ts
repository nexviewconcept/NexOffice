import { TasksService } from './tasks.service';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
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
    create(body: any, req: any): Promise<{
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
    update(id: string, body: any): Promise<{
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
    addComment(id: string, content: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        taskId: string;
    }>;
}
