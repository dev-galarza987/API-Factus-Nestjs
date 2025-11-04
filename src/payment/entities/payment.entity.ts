import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { PaymentMethod } from 'src/types/PaymentMethod';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_payment',
    comment: 'Identificador único del pago',
  })
  id: string;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
    nullable: false,
    comment: 'Método de pago utilizado',
  })
  method: PaymentMethod;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    comment: 'Monto del pago realizado',
  })
  amount: number;

  @CreateDateColumn({
    name: 'payment_date',
    type: 'timestamp',
    comment: 'Fecha y hora del pago',
  })
  date: Date;

  @ManyToOne(() => Invoice, (invoice) => invoice.payments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  invoice: Invoice;
}
