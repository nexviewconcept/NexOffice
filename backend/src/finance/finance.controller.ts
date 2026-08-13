import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Get('report')
  getReport() {
    return this.financeService.getFinancialReport();
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Post('categories')
  createCategory(@Body() data: { name: string; description?: string }) {
    return this.financeService.createExpenseCategory(data);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get('categories')
  getCategories() {
    return this.financeService.getExpenseCategories();
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Post('expenses')
  createExpense(@Body() data: any) {
    return this.financeService.createExpense(data);
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get('expenses')
  getExpenses() {
    return this.financeService.getExpenses();
  }

  @Roles('SUPER_ADMIN', 'DIRECTOR')
  @Delete('expenses/:id')
  deleteExpense(@Param('id') id: string) {
    return this.financeService.deleteExpense(id);
  }
}
