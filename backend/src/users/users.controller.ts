import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Post()
  create(@Body() createUserDto: any) {
    return this.usersService.createUser(createUserDto);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Put('me/password')
  changePassword(@Req() req: any, @Body() body: any) {
    return this.usersService.changePassword(req.user.id, body.currentPassword, body.newPassword);
  }

  @Roles('SUPER_ADMIN')
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.usersService.updateStatus(id, status);
  }

  @Roles('SUPER_ADMIN')
  @Put(':id/roles')
  updateRoles(@Param('id') id: string, @Body('roles') roles: string[]) {
    return this.usersService.updateRoles(id, roles);
  }

  @Roles('SUPER_ADMIN')
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
