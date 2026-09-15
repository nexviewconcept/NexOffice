import { PrismaService } from '../prisma/prisma.service';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        middleName: string | null;
        lastName: string;
        photoUrl: string | null;
        userId: string | null;
        studentIdNumber: string | null;
        phone: string | null;
        address: string | null;
    }>;
    findAll(): Promise<({
        enrollments: ({
            course: {
                id: string;
                description: string | null;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                duration: string | null;
                fee: number | null;
            };
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date | null;
            endDate: Date | null;
            grade: string | null;
            studentId: string;
            courseId: string;
        })[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        middleName: string | null;
        lastName: string;
        photoUrl: string | null;
        userId: string | null;
        studentIdNumber: string | null;
        phone: string | null;
        address: string | null;
    })[]>;
    findOne(id: string): Promise<{
        enrollments: ({
            course: {
                id: string;
                description: string | null;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                duration: string | null;
                fee: number | null;
            };
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date | null;
            endDate: Date | null;
            grade: string | null;
            studentId: string;
            courseId: string;
        })[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        middleName: string | null;
        lastName: string;
        photoUrl: string | null;
        userId: string | null;
        studentIdNumber: string | null;
        phone: string | null;
        address: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        middleName: string | null;
        lastName: string;
        photoUrl: string | null;
        userId: string | null;
        studentIdNumber: string | null;
        phone: string | null;
        address: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        middleName: string | null;
        lastName: string;
        photoUrl: string | null;
        userId: string | null;
        studentIdNumber: string | null;
        phone: string | null;
        address: string | null;
    }>;
    enrollCourse(studentId: string, data: {
        courseId: string;
        status?: string;
    }): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date | null;
        endDate: Date | null;
        grade: string | null;
        studentId: string;
        courseId: string;
    }>;
    unenrollCourse(studentId: string, courseId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date | null;
        endDate: Date | null;
        grade: string | null;
        studentId: string;
        courseId: string;
    }>;
}
