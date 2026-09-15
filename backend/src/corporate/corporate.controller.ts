import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { CorporateService } from './corporate.service';

@Controller('api/v1/corporate')
export class CorporateController {
  constructor(private readonly corporateService: CorporateService) {}

  @Get('services')
  getServices() {
    return this.corporateService.getCatalogue();
  }

  @Post('order')
  @HttpCode(200)
  createOrder(@Body() body: { fullName: string; email: string; phone: string; serviceId: string; description: string; idempotencyKey: string }) {
    if (!body.idempotencyKey) {
      body.idempotencyKey = Date.now().toString(); // Fallback if frontend didn't send one
    }
    return this.corporateService.createOrder(body);
  }

  @Post('contact')
  @HttpCode(200)
  createInquiry(@Body() body: { fullName: string; email: string; phone: string; subject: string; message: string; idempotencyKey: string }) {
    if (!body.idempotencyKey) {
      body.idempotencyKey = Date.now().toString();
    }
    return this.corporateService.createInquiry(body);
  }
}

