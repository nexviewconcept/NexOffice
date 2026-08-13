import { StaffProfilesService } from './staff-profiles.service';
import type { Response } from 'express';
export declare class StaffProfilesController {
    private readonly staffProfilesService;
    constructor(staffProfilesService: StaffProfilesService);
    create(data: any): Promise<{
        id: string;
        firstName: string;
        middleName: string | null;
        lastName: string;
        staffIdNumber: string | null;
        department: string | null;
        designation: string | null;
        photoUrl: string | null;
        dateJoined: Date | null;
        userId: string;
    }>;
    getAll(): Promise<({
        user: {
            email: string;
            status: string;
        };
    } & {
        id: string;
        firstName: string;
        middleName: string | null;
        lastName: string;
        staffIdNumber: string | null;
        department: string | null;
        designation: string | null;
        photoUrl: string | null;
        dateJoined: Date | null;
        userId: string;
    })[]>;
    getMyProfile(req: any): Promise<{
        user: {
            email: string;
            status: string;
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
        };
    } & {
        id: string;
        firstName: string;
        middleName: string | null;
        lastName: string;
        staffIdNumber: string | null;
        department: string | null;
        designation: string | null;
        photoUrl: string | null;
        dateJoined: Date | null;
        userId: string;
    }>;
    updateMyProfile(req: any, data: any): Promise<{
        id: string;
        firstName: string;
        middleName: string | null;
        lastName: string;
        staffIdNumber: string | null;
        department: string | null;
        designation: string | null;
        photoUrl: string | null;
        dateJoined: Date | null;
        userId: string;
    }>;
    uploadMyPhoto(req: any, file: Express.Multer.File): Promise<{
        id: string;
        firstName: string;
        middleName: string | null;
        lastName: string;
        staffIdNumber: string | null;
        department: string | null;
        designation: string | null;
        photoUrl: string | null;
        dateJoined: Date | null;
        userId: string;
    }>;
    uploadPhoto(id: string, file: Express.Multer.File): Promise<{
        id: string;
        firstName: string;
        middleName: string | null;
        lastName: string;
        staffIdNumber: string | null;
        department: string | null;
        designation: string | null;
        photoUrl: string | null;
        dateJoined: Date | null;
        userId: string;
    }>;
    downloadIdCard(id: string, res: Response, action?: string): Promise<void>;
    deleteProfile(id: string): Promise<{
        id: string;
        firstName: string;
        middleName: string | null;
        lastName: string;
        staffIdNumber: string | null;
        department: string | null;
        designation: string | null;
        photoUrl: string | null;
        dateJoined: Date | null;
        userId: string;
    }>;
}
