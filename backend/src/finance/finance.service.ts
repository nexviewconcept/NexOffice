import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  // Expenses
  async createExpenseCategory(data: { name: string; description?: string }) {
    return this.prisma.expenseCategory.create({ data });
  }

  async getExpenseCategories() {
    return this.prisma.expenseCategory.findMany({ orderBy: { name: 'asc' } });
  }

  async createExpense(data: any) {
    return this.prisma.expense.create({
      data: {
        categoryId: data.categoryId,
        amount: Number(data.amount),
        description: data.description,
        paymentMethod: data.paymentMethod,
        reference: data.reference,
        expenseDate: data.expenseDate ? new Date(data.expenseDate) : new Date()
      },
      include: { category: true }
    });
  }

  async getExpenses() {
    return this.prisma.expense.findMany({
      include: { category: true },
      orderBy: { expenseDate: 'desc' }
    });
  }

  async deleteExpense(id: string) {
    return this.prisma.expense.delete({ where: { id } });
  }

  // Reports
  async getFinancialReport() {
    // Total Revenue (Sum of all Receipts)
    const receipts = await this.prisma.receipt.aggregate({
      _sum: { amount: true }
    });
    
    // Total Expenses (Sum of all Expenses)
    const expenses = await this.prisma.expense.aggregate({
      _sum: { amount: true }
    });

    const totalRevenue = receipts._sum.amount || 0;
    const totalExpenses = expenses._sum.amount || 0;
    const netBalance = totalRevenue - totalExpenses;

    return {
      totalRevenue,
      totalExpenses,
      netBalance,
      currency: 'NGN'
    };
  }
}
