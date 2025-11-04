import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_customer',
    comment: 'Identificador único del cliente',
  })
  id: string;

  @Column({
    name: 'customer_name',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Nombre completo o razón social del cliente',
  })
  name: string;

  @Column({
    name: 'tax_or_id',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
    comment: 'Número de identificación fiscal o documento de identidad',
  })
  taxOrId: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Correo electrónico del cliente',
  })
  email: string;

  @OneToOne(() => User, (user) => user.customer, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices: Invoice[];
}
