import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true; // No specific permissions required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new ForbiddenException('Access denied');
    }

    // Always allow SUPER_ADMIN
    if (user.roles?.includes('SUPER_ADMIN')) {
      return true;
    }

    // Fetch user's roles and permissions from DB
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true }
                }
              }
            }
          }
        }
      }
    });

    if (!dbUser) throw new ForbiddenException('User not found');

    // Extract all allowed permission actions for this user
    const userPermissions = new Set<string>();
    dbUser.roles.forEach(ur => {
      ur.role.permissions.forEach(rp => {
        userPermissions.add(rp.permission.action);
      });
    });

    // Check if user has ALL required permissions
    const hasPermission = requiredPermissions.every(perm => userPermissions.has(perm));
    
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
