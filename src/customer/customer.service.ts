import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { StateInvoice } from 'src/types/StateInvoice';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // ==========================================
  // MÉTODOS CRUD BÁSICOS
  // ==========================================

  /**
   * Crea un nuevo cliente
   * @param createCustomerDto - Datos del cliente a crear
   * @returns El cliente creado
   * @throws ConflictException si el taxOrId ya existe
   */
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Validar que el taxOrId no exista
    const existingCustomer = await this.customerRepository.findOne({
      where: { taxOrId: createCustomerDto.taxOrId },
    });

    if (existingCustomer) {
      throw new ConflictException(
        `Ya existe un cliente con el número de identificación: ${createCustomerDto.taxOrId}`,
      );
    }

    // Crear y guardar el cliente
    const customer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(customer);
  }

  /**
   * Obtiene todos los clientes
   * @returns Array de clientes
   */
  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Obtiene un cliente por su ID
   * @param id - UUID del cliente
   * @returns El cliente encontrado
   * @throws NotFoundException si el cliente no existe
   */
  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return customer;
  }

  /**
   * Actualiza un cliente existente
   * @param id - UUID del cliente
   * @param updateCustomerDto - Datos a actualizar
   * @returns El cliente actualizado
   * @throws NotFoundException si el cliente no existe
   * @throws ConflictException si el taxOrId ya existe en otro cliente
   */
  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    // Verificar que el cliente existe
    const customer = await this.findOne(id);

    // Si se está actualizando el taxOrId, validar que no exista en otro cliente
    if (
      updateCustomerDto.taxOrId &&
      updateCustomerDto.taxOrId !== customer.taxOrId
    ) {
      const existingCustomer = await this.customerRepository.findOne({
        where: { taxOrId: updateCustomerDto.taxOrId },
      });

      if (existingCustomer) {
        throw new ConflictException(
          `Ya existe otro cliente con el número de identificación: ${updateCustomerDto.taxOrId}`,
        );
      }
    }

    // Actualizar el cliente
    Object.assign(customer, updateCustomerDto);
    return await this.customerRepository.save(customer);
  }

  /**
   * Elimina un cliente
   * @param id - UUID del cliente
   * @throws NotFoundException si el cliente no existe
   */
  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }

  // ==========================================
  // MÉTODOS DE BÚSQUEDA Y FILTRADO
  // ==========================================

  /**
   * Busca un cliente por su número de identificación
   * @param taxOrId - Número de identificación fiscal o documento
   * @returns El cliente encontrado
   * @throws NotFoundException si no existe
   */
  async findByTaxOrId(taxOrId: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { taxOrId },
    });

    if (!customer) {
      throw new NotFoundException(
        `Cliente con identificación ${taxOrId} no encontrado`,
      );
    }

    return customer;
  }

  /**
   * Busca un cliente por su correo electrónico
   * @param email - Correo electrónico
   * @returns El cliente encontrado
   * @throws NotFoundException si no existe
   */
  async findByEmail(email: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { email },
    });

    if (!customer) {
      throw new NotFoundException(`Cliente con email ${email} no encontrado`);
    }

    return customer;
  }

  /**
   * Busca clientes por texto en nombre o email
   * @param query - Texto a buscar
   * @returns Array de clientes que coinciden
   */
  async search(query: string): Promise<Customer[]> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('El término de búsqueda es requerido');
    }

    return await this.customerRepository.find({
      where: [{ name: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
      order: { name: 'ASC' },
    });
  }

  /**
   * Obtiene clientes con paginación
   * @param page - Número de página (empezando en 1)
   * @param limit - Cantidad de resultados por página
   * @returns Objeto con datos y metadata de paginación
   */
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Customer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.customerRepository.findAndCount({
      order: { name: 'ASC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ==========================================
  // MÉTODOS DE VALIDACIÓN
  // ==========================================

  /**
   * Verifica si existe un cliente con el ID especificado
   * @param id - UUID del cliente
   * @returns true si existe, false si no
   */
  async existsById(id: string): Promise<boolean> {
    const count = await this.customerRepository.count({
      where: { id },
    });
    return count > 0;
  }

  /**
   * Verifica si existe un cliente con el taxOrId especificado
   * @param taxOrId - Número de identificación
   * @returns true si existe, false si no
   */
  async existsByTaxOrId(taxOrId: string): Promise<boolean> {
    const count = await this.customerRepository.count({
      where: { taxOrId },
    });
    return count > 0;
  }

  // ==========================================
  // MÉTODOS DE RELACIONES
  // ==========================================

  /**
   * Obtiene un cliente con todas sus facturas
   * @param id - UUID del cliente
   * @returns El cliente con sus facturas
   * @throws NotFoundException si el cliente no existe
   */
  async findWithInvoices(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['invoices'],
    });

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return customer;
  }

  /**
   * Obtiene todas las facturas de un cliente
   * @param id - UUID del cliente
   * @returns Array de facturas del cliente
   * @throws NotFoundException si el cliente no existe
   */
  async getInvoicesByCustomer(id: string): Promise<Invoice[]> {
    const customer = await this.findWithInvoices(id);
    return customer.invoices;
  }

  // ==========================================
  // MÉTODOS DE ESTADÍSTICAS
  // ==========================================

  /**
   * Obtiene estadísticas de un cliente
   * @param id - UUID del cliente
   * @returns Objeto con estadísticas del cliente
   * @throws NotFoundException si el cliente no existe
   */
  async getCustomerStats(id: string): Promise<{
    customer: Customer;
    totalInvoices: number;
    totalSpent: number;
    averagePurchase: number;
    pendingInvoices: number;
    paidInvoices: number;
    cancelledInvoices: number;
  }> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['invoices'],
    });

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    const totalInvoices = customer.invoices.length;
    const totalSpent = customer.invoices.reduce(
      (sum, invoice) => sum + Number(invoice.totalAmount),
      0,
    );
    const averagePurchase = totalInvoices > 0 ? totalSpent / totalInvoices : 0;
    const pendingInvoices = customer.invoices.filter(
      (inv) => inv.status === StateInvoice.PENDING,
    ).length;
    const paidInvoices = customer.invoices.filter(
      (inv) => inv.status === StateInvoice.PAID,
    ).length;
    const cancelledInvoices = customer.invoices.filter(
      (inv) => inv.status === StateInvoice.CANCELLED,
    ).length;

    return {
      customer,
      totalInvoices,
      totalSpent,
      averagePurchase,
      pendingInvoices,
      paidInvoices,
      cancelledInvoices,
    };
  }

  /**
   * Cuenta el total de clientes registrados
   * @returns Número total de clientes
   */
  async count(): Promise<number> {
    return await this.customerRepository.count();
  }

  /**
   * Obtiene los clientes con más compras
   * @param limit - Cantidad de clientes a retornar
   * @returns Array de clientes ordenados por total gastado
   */
  async getTopCustomers(limit: number = 10): Promise<
    Array<{
      customer: Customer;
      totalInvoices: number;
      totalSpent: number;
    }>
  > {
    const customers = await this.customerRepository.find({
      relations: ['invoices'],
    });

    // Calcular totales para cada cliente
    const customersWithStats = customers.map((customer) => {
      const totalInvoices = customer.invoices.length;
      const totalSpent = customer.invoices.reduce(
        (sum, invoice) => sum + Number(invoice.totalAmount),
        0,
      );

      return {
        customer,
        totalInvoices,
        totalSpent,
      };
    });

    // Ordenar por total gastado y limitar resultados
    return customersWithStats
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  }
}
