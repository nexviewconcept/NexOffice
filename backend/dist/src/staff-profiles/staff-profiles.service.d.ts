import { PrismaService } from '../prisma/prisma.service';
import { DocumentsService } from '../documents/documents.service';
export declare class StaffProfilesService {
    private prisma;
    private documents;
    constructor(prisma: PrismaService, documents: DocumentsService);
    createProfile(data: any): Promise<{
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
    getAllProfiles(): Promise<({
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
    getProfileByUserId(userId: string): Promise<{
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
    updateProfileByUserId(userId: string, data: any): Promise<{
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
    updateMyPhoto(userId: string, filename: string): Promise<{
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
    updatePhoto(id: string, filename: string): Promise<{
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
    generateStaffIdCard(id: string): Promise<Buffer<ArrayBufferLike>>;
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
