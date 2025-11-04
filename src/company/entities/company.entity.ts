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
export class Company {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_company',
    comment: 'Identificador único de la empresa',
  })
  id: string;

  @Column({
    name: 'business_name',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Razón social de la empresa',
  })
  businessName: string; // Nombre oficial de la empresa

  @Column({
    name: 'tax_id',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
    comment: 'Número de identificación fiscal (RUC/NIT)',
  })
  taxId: string; // Número de identificación fiscal (NIT/CI)

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Correo electrónico de la empresa',
  })
  email: string;

  @Column({
    name: 'address',
    type: 'varchar',
    length: 500,
    nullable: false,
    comment: 'Dirección física de la empresa',
  })
  address: string;

  @OneToOne(() => User, (user) => user.company, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @OneToMany(() => Invoice, (invoice) => invoice.company)
  invoices: Invoice[]; // Relación uno a muchos con la entidad Invoice
}
