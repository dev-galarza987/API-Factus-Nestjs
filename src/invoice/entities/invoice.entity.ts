import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { InvoiceDetail } from 'src/invoice-detail/entities/invoice-detail.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { StateInvoice } from 'src/types/StateInvoice';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_invoice',
    comment: 'Identificador único de la factura',
  })
  id: string;

  @Column({
    name: 'invoice_number',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
    comment: 'Número de factura único',
  })
  number: string;

  @CreateDateColumn({
    name: 'issue_date',
    type: 'timestamp',
    comment: 'Fecha de emisión de la factura',
  })
  issueDate: Date; // Fecha de emisión de la factura

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    comment: 'Monto total de la factura',
  })
  totalAmount: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: StateInvoice,
    default: StateInvoice.PENDING,
    nullable: false,
    comment: 'Estado de la factura (PENDING, PAID, CANCELLED)',
  })
  status: StateInvoice;

  @ManyToOne(() => Company, (company) => company.invoices, { eager: true })
  company: Company;

  @ManyToOne(() => Customer, (customer) => customer.invoices, { eager: true })
  customer: Customer;

  @OneToMany(() => InvoiceDetail, (detail) => detail.invoice, {
    cascade: true,
  })
  details: InvoiceDetail[];

  @OneToMany(() => Payment, (payment) => payment.invoice, { cascade: true })
  payments: Payment[];
}
