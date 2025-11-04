import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceDetailService } from './invoice-detail.service';
import { InvoiceDetailController } from './invoice-detail.controller';
import { InvoiceDetail } from './entities/invoice-detail.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceDetail, Invoice])],
  controllers: [InvoiceDetailController],
  providers: [InvoiceDetailService],
  exports: [InvoiceDetailService],
})
export class InvoiceDetailModule {}
