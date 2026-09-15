import { CoursesService } from './courses.service';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(createCourseDto: any): Promise<{
        id: string;
        description: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        duration: string | null;
        fee: number | null;
    }>;
    findAll(): Promise<{
        id: string;
        description: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        duration: string | null;
        fee: number | null;
    }[]>;
    findOne(id: string): Promise<{
        enrollments: ({
            student: {
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
        description: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        duration: string | null;
        fee: number | null;
    }>;
    update(id: string, updateCourseDto: any): Promise<{
        id: string;
        description: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        duration: string | null;
        fee: number | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        description: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        duration: string | null;
        fee: number | null;
    }>;
}
