import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { InvoiceDetail } from 'src/invoice-detail/entities/invoice-detail.entity';
import { Company } from 'src/company/entities/company.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { StateInvoice } from 'src/types/StateInvoice';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceDetail)
    private readonly invoiceDetailRepository: Repository<InvoiceDetail>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // ==========================================
  // MÉTODOS CRUD BÁSICOS
  // ==========================================

  /**
   * Crea una nueva factura con sus detalles
   * @param createInvoiceDto - Datos de la factura y detalles
   * @returns La factura creada con sus detalles
   * @throws ConflictException si el número de factura ya existe
   * @throws NotFoundException si la empresa o cliente no existen
   */
  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    // Validar que el número de factura no exista
    const existingInvoice = await this.invoiceRepository.findOne({
      where: { number: createInvoiceDto.number },
    });

    if (existingInvoice) {
      throw new ConflictException(
        `Ya existe una factura con el número: ${createInvoiceDto.number}`,
      );
    }

    // Validar que la empresa exista
    const company = await this.companyRepository.findOne({
      where: { id: createInvoiceDto.companyId },
    });

    if (!company) {
      throw new NotFoundException(
        `Empresa con ID ${createInvoiceDto.companyId} no encontrada`,
      );
    }

    // Validar que el cliente exista
    const customer = await this.customerRepository.findOne({
      where: { id: createInvoiceDto.customerId },
    });

    if (!customer) {
      throw new NotFoundException(
        `Cliente con ID ${createInvoiceDto.customerId} no encontrado`,
      );
    }

    // Calcular el total de la factura
    let totalAmount = 0;
    if (createInvoiceDto.details && createInvoiceDto.details.length > 0) {
      totalAmount = createInvoiceDto.details.reduce((sum, detail) => {
        const subtotal = detail.quantity * detail.unitPrice;
        return sum + subtotal;
      }, 0);
    }

    // Crear la factura
    const invoice = this.invoiceRepository.create({
      number: createInvoiceDto.number,
      totalAmount,
      status: createInvoiceDto.status || StateInvoice.PENDING,
      company,
      customer,
    });

    // Guardar la factura
    const savedInvoice = await this.invoiceRepository.save(invoice);

    // Crear los detalles si existen
    if (createInvoiceDto.details && createInvoiceDto.details.length > 0) {
      const details = createInvoiceDto.details.map((detail) => {
        const subtotal = detail.quantity * detail.unitPrice;
        return this.invoiceDetailRepository.create({
          ...detail,
          subtotal,
          invoice: savedInvoice,
        });
      });

      await this.invoiceDetailRepository.save(details);
    }

    // Retornar la factura con sus relaciones
    return await this.findOne(savedInvoice.id);
  }

  /**
   * Obtiene todas las facturas
   * @returns Array de facturas ordenadas por fecha de emisión
   */
  async findAll(): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      order: { issueDate: 'DESC' },
      relations: ['company', 'customer'],
    });
  }

  /**
   * Obtiene una factura por su ID
   * @param id - UUID de la factura
   * @returns La factura encontrada
   * @throws NotFoundException si la factura no existe
   */
  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['company', 'customer', 'details', 'payments'],
    });

    if (!invoice) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }

    return invoice;
  }

  /**
   * Actualiza una factura existente
   * @param id - UUID de la factura
   * @param updateInvoiceDto - Datos a actualizar
   * @returns La factura actualizada
   * @throws NotFoundException si la factura no existe
   * @throws ConflictException si el número ya existe en otra factura
   */
  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    // Verificar que la factura existe
    const invoice = await this.findOne(id);

    // Si se está actualizando el número, validar que no exista
    if (updateInvoiceDto.number && updateInvoiceDto.number !== invoice.number) {
      const existingInvoice = await this.invoiceRepository.findOne({
        where: { number: updateInvoiceDto.number },
      });

      if (existingInvoice) {
        throw new ConflictException(
          `Ya existe otra factura con el número: ${updateInvoiceDto.number}`,
        );
      }
    }

    // Si se actualiza la empresa, validar que exista
    if (updateInvoiceDto.companyId) {
      const company = await this.companyRepository.findOne({
        where: { id: updateInvoiceDto.companyId },
      });

      if (!company) {
        throw new NotFoundException(
          `Empresa con ID ${updateInvoiceDto.companyId} no encontrada`,
        );
      }
      invoice.company = company;
    }

    // Si se actualiza el cliente, validar que exista
    if (updateInvoiceDto.customerId) {
      const customer = await this.customerRepository.findOne({
        where: { id: updateInvoiceDto.customerId },
      });

      if (!customer) {
        throw new NotFoundException(
          `Cliente con ID ${updateInvoiceDto.customerId} no encontrado`,
        );
      }
      invoice.customer = customer;
    }

    // Actualizar campos básicos
    if (updateInvoiceDto.number) invoice.number = updateInvoiceDto.number;
    if (updateInvoiceDto.totalAmount !== undefined)
      invoice.totalAmount = updateInvoiceDto.totalAmount;
    if (updateInvoiceDto.status) invoice.status = updateInvoiceDto.status;

    return await this.invoiceRepository.save(invoice);
  }

  /**
   * Elimina una factura (y sus detalles en cascada)
   * @param id - UUID de la factura
   * @throws NotFoundException si la factura no existe
   */
  async remove(id: string): Promise<void> {
    const invoice = await this.findOne(id);
    await this.invoiceRepository.remove(invoice);
  }

  // ==========================================
  // MÉTODOS DE BÚSQUEDA Y FILTRADO
  // ==========================================

  /**
   * Busca una factura por su número
   * @param number - Número de factura
   * @returns La factura encontrada
   * @throws NotFoundException si no existe
   */
  async findByNumber(number: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { number },
      relations: ['company', 'customer', 'details', 'payments'],
    });

    if (!invoice) {
      throw new NotFoundException(`Factura con número ${number} no encontrada`);
    }

    return invoice;
  }

  /**
   * Busca facturas por estado
   * @param status - Estado de la factura (PENDING, PAID, CANCELLED)
   * @returns Array de facturas con el estado especificado
   */
  async findByStatus(status: StateInvoice): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { status },
      order: { issueDate: 'DESC' },
      relations: ['company', 'customer'],
    });
  }

  /**
   * Busca facturas por empresa
   * @param companyId - UUID de la empresa
   * @returns Array de facturas de la empresa
   */
  async findByCompany(companyId: string): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { company: { id: companyId } },
      order: { issueDate: 'DESC' },
      relations: ['company', 'customer'],
    });
  }

  /**
   * Busca facturas por cliente
   * @param customerId - UUID del cliente
   * @returns Array de facturas del cliente
   */
  async findByCustomer(customerId: string): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { customer: { id: customerId } },
      order: { issueDate: 'DESC' },
      relations: ['company', 'customer'],
    });
  }

  /**
   * Busca facturas por rango de fechas
   * @param startDate - Fecha inicial
   * @param endDate - Fecha final
   * @returns Array de facturas en el rango
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: {
        issueDate: Between(startDate, endDate),
      },
      order: { issueDate: 'DESC' },
      relations: ['company', 'customer'],
    });
  }

  /**
   * Busca facturas por monto mínimo
   * @param minAmount - Monto mínimo
   * @returns Array de facturas con monto >= minAmount
   */
  async findByMinAmount(minAmount: number): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: {
        totalAmount: MoreThanOrEqual(minAmount),
      },
      order: { totalAmount: 'DESC' },
      relations: ['company', 'customer'],
    });
  }

  /**
   * Obtiene facturas con paginación
   * @param page - Número de página
   * @param limit - Cantidad de resultados
   * @returns Objeto con datos y metadata de paginación
   */
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Invoice[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.invoiceRepository.findAndCount({
      order: { issueDate: 'DESC' },
      relations: ['company', 'customer'],
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
   * Verifica si existe una factura con el ID especificado
   * @param id - UUID de la factura
   * @returns true si existe, false si no
   */
  async existsById(id: string): Promise<boolean> {
    const count = await this.invoiceRepository.count({
      where: { id },
    });
    return count > 0;
  }

  /**
   * Verifica si existe una factura con el número especificado
   * @param number - Número de factura
   * @returns true si existe, false si no
   */
  async existsByNumber(number: string): Promise<boolean> {
    const count = await this.invoiceRepository.count({
      where: { number },
    });
    return count > 0;
  }

  // ==========================================
  // MÉTODOS DE ESTADO Y PAGOS
  // ==========================================

  /**
   * Cambia el estado de una factura
   * @param id - UUID de la factura
   * @param status - Nuevo estado
   * @returns La factura actualizada
   */
  async changeStatus(id: string, status: StateInvoice): Promise<Invoice> {
    const invoice = await this.findOne(id);
    invoice.status = status;
    return await this.invoiceRepository.save(invoice);
  }

  /**
   * Marca una factura como pagada
   * @param id - UUID de la factura
   * @returns La factura actualizada
   */
  async markAsPaid(id: string): Promise<Invoice> {
    return await this.changeStatus(id, StateInvoice.PAID);
  }

  /**
   * Marca una factura como pendiente
   * @param id - UUID de la factura
   * @returns La factura actualizada
   */
  async markAsPending(id: string): Promise<Invoice> {
    return await this.changeStatus(id, StateInvoice.PENDING);
  }

  /**
   * Cancela una factura
   * @param id - UUID de la factura
   * @returns La factura actualizada
   */
  async cancelInvoice(id: string): Promise<Invoice> {
    return await this.changeStatus(id, StateInvoice.CANCELLED);
  }

  /**
   * Calcula el total pagado de una factura
   * @param id - UUID de la factura
   * @returns Monto total pagado
   */
  async getTotalPaid(id: string): Promise<number> {
    const invoice = await this.findOne(id);
    return invoice.payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );
  }

  /**
   * Calcula el saldo pendiente de una factura
   * @param id - UUID de la factura
   * @returns Monto pendiente de pago
   */
  async getBalance(id: string): Promise<number> {
    const invoice = await this.findOne(id);
    const totalPaid = await this.getTotalPaid(id);
    return Number(invoice.totalAmount) - totalPaid;
  }

  // ==========================================
  // MÉTODOS DE ESTADÍSTICAS
  // ==========================================

  /**
   * Cuenta el total de facturas
   * @returns Número total de facturas
   */
  async count(): Promise<number> {
    return await this.invoiceRepository.count();
  }

  /**
   * Obtiene el total facturado
   * @returns Suma total de todas las facturas
   */
  async getTotalRevenue(): Promise<number> {
    const result = (await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total_amount)', 'total')
      .getRawOne()) as unknown as { total: string } | undefined;

    return Number(result?.total || 0);
  }

  /**
   * Obtiene el total facturado por estado
   * @returns Objeto con totales por estado
   */
  async getRevenueByStatus(): Promise<{
    pending: number;
    paid: number;
    cancelled: number;
  }> {
    const pending = (await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total_amount)', 'total')
      .where('invoice.status = :status', { status: StateInvoice.PENDING })
      .getRawOne()) as unknown as { total: string } | undefined;

    const paid = (await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total_amount)', 'total')
      .where('invoice.status = :status', { status: StateInvoice.PAID })
      .getRawOne()) as unknown as { total: string } | undefined;

    const cancelled = (await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total_amount)', 'total')
      .where('invoice.status = :status', { status: StateInvoice.CANCELLED })
      .getRawOne()) as unknown as { total: string } | undefined;

    return {
      pending: Number(pending?.total || 0),
      paid: Number(paid?.total || 0),
      cancelled: Number(cancelled?.total || 0),
    };
  }

  /**
   * Obtiene estadísticas generales del sistema
   * @returns Objeto con estadísticas completas
   */
  async getGeneralStats(): Promise<{
    totalInvoices: number;
    totalRevenue: number;
    averageInvoiceAmount: number;
    pendingInvoices: number;
    paidInvoices: number;
    cancelledInvoices: number;
    revenueByStatus: {
      pending: number;
      paid: number;
      cancelled: number;
    };
  }> {
    const totalInvoices = await this.count();
    const totalRevenue = await this.getTotalRevenue();
    const averageInvoiceAmount =
      totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

    const pendingInvoices = await this.invoiceRepository.count({
      where: { status: StateInvoice.PENDING },
    });

    const paidInvoices = await this.invoiceRepository.count({
      where: { status: StateInvoice.PAID },
    });

    const cancelledInvoices = await this.invoiceRepository.count({
      where: { status: StateInvoice.CANCELLED },
    });

    const revenueByStatus = await this.getRevenueByStatus();

    return {
      totalInvoices,
      totalRevenue,
      averageInvoiceAmount,
      pendingInvoices,
      paidInvoices,
      cancelledInvoices,
      revenueByStatus,
    };
  }
}
