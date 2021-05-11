import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from '../web/rest/payment.controller';
import { PaymentRepository } from '../repository/payment.repository';
import { PaymentService } from '../service/payment.service';

@Module({
    imports: [TypeOrmModule.forFeature([PaymentRepository])],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService],
})
export class PaymentModule {}
