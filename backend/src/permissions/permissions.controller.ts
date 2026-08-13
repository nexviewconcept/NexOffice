import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('roles')
  @Roles('SUPER_ADMIN')
  async getRolesAndPermissions() {
    return this.permissionsService.getAllRolesAndPermissions();
  }

  @Put('roles/:id')
  @Roles('SUPER_ADMIN')
  async updateRolePermissions(
    @Param('id') id: string,
    @Body('permissions') permissionIds: string[]
  ) {
    return this.permissionsService.updateRolePermissions(id, permissionIds);
  }
}
