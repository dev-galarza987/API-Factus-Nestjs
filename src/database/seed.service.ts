import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../types/UserRole';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Se ejecuta al inicializar el módulo
   * Crea el usuario administrador si no existe
   */
  async onModuleInit() {
    await this.createAdminUser();
  }

  /**
   * Crea el usuario administrador por defecto
   */
  async createAdminUser() {
    const adminEmail = 'admin@factus.com';

    // Verificar si el admin ya existe
    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('✅ Usuario administrador ya existe');
      return;
    }

    // Crear el usuario administrador
    const adminPassword = await bcrypt.hash('galarza987#', 10);
    const admin = this.userRepository.create({
      id: '00000000-0000-0000-0000-000000000001',
      email: adminEmail,
      password: adminPassword,
      role: UserRole.COMPANY,
      isActive: true,
    });

    await this.userRepository.save(admin);
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('📧 Email: admin@factus.com');
    console.log('🔑 Password: galarza987#');
  }
}
