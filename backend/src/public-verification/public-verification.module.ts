import { Module } from '@nestjs/common';
import { PublicVerificationController } from './public-verification.controller';

@Module({
  controllers: [PublicVerificationController]
})
export class PublicVerificationModule {}
