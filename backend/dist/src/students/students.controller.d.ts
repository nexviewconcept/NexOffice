import { StudentsService } from './students.service';
import { DocumentsService } from '../documents/documents.service';
import type { Response } from 'express';
export declare class StudentsController {
    private readonly studentsService;
    private readonly documentsService;
    constructor(studentsService: StudentsService, documentsService: DocumentsService);
    create(createStudentDto: any): Promise<{
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
    update(id: string, updateStudentDto: any): Promise<{
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
    enrollCourse(id: string, body: any): Promise<{
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
    unenrollCourse(id: string, courseId: string): Promise<{
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
    getPdf(id: string, res: Response): Promise<void>;
}
