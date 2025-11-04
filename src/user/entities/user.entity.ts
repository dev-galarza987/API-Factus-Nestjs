import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { UserRole } from 'src/types/UserRole';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_user',
    comment: 'Identificador único del usuario',
  })
  id: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
    comment: 'Email único del usuario',
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Contraseña hasheada del usuario',
  })
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    nullable: false,
    comment: 'Rol del usuario (COMPANY o CUSTOMER)',
  })
  role: UserRole;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
    nullable: false,
    comment: 'Estado activo/inactivo del usuario',
  })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    comment: 'Fecha de creación del usuario',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    comment: 'Fecha de última actualización',
  })
  updatedAt: Date;

  @OneToOne(() => Company, (company) => company.user, { nullable: true })
  company?: Company;

  @OneToOne(() => Customer, (customer) => customer.user, { nullable: true })
  customer?: Customer;
}
