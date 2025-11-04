import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from 'src/types/UserRole';
import { Company } from 'src/company/entities/company.entity';
import { Customer } from 'src/customer/entities/customer.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // ============================================================
  // CATEGORÍA 1: CRUD OPERATIONS
  // ============================================================

  /**
   * Registra un nuevo usuario con contraseña hasheada
   */
  async register(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `El email ${createUserDto.email} ya está registrado`,
      );
    }

    // Hashear la contraseña
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // Crear el usuario
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      isActive: true,
    });

    return await this.userRepository.save(user);
  }

  /**
   * Obtiene todos los usuarios con sus relaciones
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['company', 'customer'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Busca un usuario por ID con sus relaciones
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['company', 'customer'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  /**
   * Actualiza un usuario existente
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Si se actualiza el email, verificar que no exista
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException(
          `El email ${updateUserDto.email} ya está en uso`,
        );
      }
    }

    // Si se actualiza la contraseña, hashearla
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  /**
   * Elimina (desactiva) un usuario
   */
  async remove(id: string): Promise<{ message: string; user: User }> {
    const user = await this.findOne(id);
    user.isActive = false;
    const updatedUser = await this.userRepository.save(user);

    return {
      message: `Usuario ${user.email} desactivado correctamente`,
      user: updatedUser,
    };
  }

  // ============================================================
  // CATEGORÍA 2: BÚSQUEDA Y FILTRADO
  // ============================================================

  /**
   * Busca un usuario por email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['company', 'customer'],
    });
  }

  /**
   * Busca usuarios por rol
   */
  async findByRole(role: UserRole): Promise<User[]> {
    return await this.userRepository.find({
      where: { role },
      relations: ['company', 'customer'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Busca usuarios activos
   */
  async findActive(): Promise<User[]> {
    return await this.userRepository.find({
      where: { isActive: true },
      relations: ['company', 'customer'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Busca usuarios con su empresa asociada
   */
  async findWithCompany(): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.company', 'company')
      .where('user.role = :role', { role: UserRole.COMPANY })
      .orderBy('user.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Busca usuarios con su cliente asociado
   */
  async findWithCustomer(): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.customer', 'customer')
      .where('user.role = :role', { role: UserRole.CUSTOMER })
      .orderBy('user.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Búsqueda paginada de usuarios
   */
  async findPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      relations: ['company', 'customer'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      users,
      total,
      page,
      limit,
    };
  }

  // ============================================================
  // CATEGORÍA 3: VALIDACIÓN
  // ============================================================

  /**
   * Verifica si un email ya existe
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { email } });
    return count > 0;
  }

  /**
   * Verifica si un usuario está activo
   */
  async isActiveUser(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'isActive'],
    });
    return user?.isActive ?? false;
  }

  // ============================================================
  // CATEGORÍA 4: AUTENTICACIÓN
  // ============================================================

  /**
   * Hashea una contraseña usando bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compara una contraseña con su hash
   */
  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Valida las credenciales de un usuario (login)
   */
  async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['company', 'customer'],
    });

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new BadRequestException('El usuario está desactivado');
    }

    const isPasswordValid = await this.comparePasswords(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  /**
   * Realiza el login de un usuario
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; message: string }> {
    const user = await this.validateCredentials(email, password);

    if (!user) {
      throw new BadRequestException('Credenciales inválidas');
    }

    return {
      user,
      message: 'Login exitoso',
    };
  }

  // ============================================================
  // CATEGORÍA 5: ESTADÍSTICAS Y REPORTES
  // ============================================================

  /**
   * Cuenta el total de usuarios
   */
  async countTotal(): Promise<number> {
    return await this.userRepository.count();
  }

  /**
   * Cuenta usuarios por rol
   */
  async countByRole(role: UserRole): Promise<number> {
    return await this.userRepository.count({ where: { role } });
  }

  /**
   * Cuenta usuarios activos
   */
  async countActive(): Promise<number> {
    return await this.userRepository.count({ where: { isActive: true } });
  }

  /**
   * Obtiene estadísticas generales de usuarios
   */
  async getGeneralStats(): Promise<{
    total: number;
    companies: number;
    customers: number;
    active: number;
    inactive: number;
  }> {
    const [total, companies, customers, active] = await Promise.all([
      this.countTotal(),
      this.countByRole(UserRole.COMPANY),
      this.countByRole(UserRole.CUSTOMER),
      this.countActive(),
    ]);

    return {
      total,
      companies,
      customers,
      active,
      inactive: total - active,
    };
  }

  /**
   * Obtiene los últimos usuarios registrados
   */
  async getLatestUsers(limit: number = 10): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['company', 'customer'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
