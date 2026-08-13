import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(email: string, passwordPlain: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            roles: string[];
        };
    }>;
}
