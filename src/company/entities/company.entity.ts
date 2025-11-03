import {
  Entity,
  PrimaryGeneratedColumn,
  Column /*, OneToMany*/,
} from 'typeorm';
//import { Invoice } from './invoice.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessName: string;

  @Column()
  taxId: string;

  @Column()
  email: string;

  @Column()
  address: string;

  //   @OneToMany(() => Invoice, (invoice) => invoice.company)
  //   invoices: Invoice[];
}
