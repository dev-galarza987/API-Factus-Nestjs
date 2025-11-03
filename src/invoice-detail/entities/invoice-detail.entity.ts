import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Invoice } from 'src/invoice/entities/invoice.entity';

@Entity()
export class InvoiceDetail {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_invoice_detail',
    comment: 'Identificador único del detalle de factura',
  })
  id: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 500,
    nullable: false,
    comment: 'Descripción del producto o servicio',
  })
  description: string;

  @Column({
    name: 'quantity',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    comment: 'Cantidad de productos o unidades',
  })
  quantity: number;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    comment: 'Precio unitario del producto o servicio',
  })
  unitPrice: number;

  @Column({
    name: 'subtotal',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    comment: 'Subtotal de la línea (quantity * unit_price)',
  })
  subtotal: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.details)
  invoice: Invoice;
}
