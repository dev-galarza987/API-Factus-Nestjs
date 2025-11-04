import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { PaymentMethod } from 'src/types/PaymentMethod';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  // ==========================================
  // MÉTODOS CRUD BÁSICOS
  // ==========================================

  /**
   * Crea un nuevo pago
   * @param createPaymentDto - Datos del pago
   * @returns El pago creado
   * @throws NotFoundException si la factura no existe
   * @throws BadRequestException si el monto es mayor al saldo pendiente
   */
  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Validar que la factura exista
    const invoice = await this.invoiceRepository.findOne({
      where: { id: createPaymentDto.invoiceId },
      relations: ['payments'],
    });

    if (!invoice) {
      throw new NotFoundException(
        `Factura con ID ${createPaymentDto.invoiceId} no encontrada`,
      );
    }

    // Calcular el total pagado hasta ahora
    const totalPaid = invoice.payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    // Calcular el saldo pendiente
    const balance = Number(invoice.totalAmount) - totalPaid;

    // Validar que el monto no exceda el saldo pendiente
    if (createPaymentDto.amount > balance) {
      throw new BadRequestException(
        `El monto del pago (${createPaymentDto.amount}) excede el saldo pendiente (${balance})`,
      );
    }

    // Crear el pago
    const payment = this.paymentRepository.create({
      method: createPaymentDto.method,
      amount: createPaymentDto.amount,
      invoice,
    });

    return await this.paymentRepository.save(payment);
  }

  /**
   * Obtiene todos los pagos
   * @returns Array de pagos ordenados por fecha
   */
  async findAll(): Promise<Payment[]> {
    return await this.paymentRepository.find({
      relations: ['invoice'],
      order: { date: 'DESC' },
    });
  }

  /**
   * Obtiene un pago por su ID
   * @param id - UUID del pago
   * @returns El pago encontrado
   * @throws NotFoundException si el pago no existe
   */
  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['invoice', 'invoice.company', 'invoice.customer'],
    });

    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }

    return payment;
  }

  /**
   * Actualiza un pago existente
   * @param id - UUID del pago
   * @param updatePaymentDto - Datos a actualizar
   * @returns El pago actualizado
   * @throws NotFoundException si el pago no existe
   */
  async update(id: string, updatePayment: UpdatePaymentDto): Promise<Payment> {
    // Verificar que el pago existe
    const payment = await this.findOne(id);

    // Si se actualiza la factura, validar que exista
    if (updatePayment.invoiceId) {
      const invoice = await this.invoiceRepository.findOne({
        where: { id: updatePayment.invoiceId },
      });

      if (!invoice) {
        throw new NotFoundException(
          `Factura con ID ${updatePayment.invoiceId} no encontrada`,
        );
      }
      payment.invoice = invoice;
    }

    // Actualizar campos
    if (updatePayment.method) payment.method = updatePayment.method;
    if (updatePayment.amount !== undefined)
      payment.amount = updatePayment.amount;

    return await this.paymentRepository.save(payment);
  }

  /**
   * Elimina un pago
   * @param id - UUID del pago
   * @throws NotFoundException si el pago no existe
   */
  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepository.remove(payment);
  }

  // ==========================================
  // MÉTODOS DE BÚSQUEDA Y FILTRADO
  // ==========================================

  /**
   * Busca pagos por factura
   * @param invoiceId - UUID de la factura
   * @returns Array de pagos de la factura
   */
  async findByInvoice(invoiceId: string): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { invoice: { id: invoiceId } },
      relations: ['invoice'],
      order: { date: 'DESC' },
    });
  }

  /**
   * Busca pagos por método de pago
   * @param method - Método de pago
   * @returns Array de pagos con el método especificado
   */
  async findByMethod(method: PaymentMethod): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { method },
      relations: ['invoice'],
      order: { date: 'DESC' },
    });
  }

  /**
   * Busca pagos por rango de fechas
   * @param startDate - Fecha inicial
   * @param endDate - Fecha final
   * @returns Array de pagos en el rango
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      relations: ['invoice'],
      order: { date: 'DESC' },
    });
  }

  /**
   * Busca pagos por monto mínimo
   * @param minAmount - Monto mínimo
   * @returns Array de pagos con monto >= minAmount
   */
  async findByMinAmount(minAmount: number): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: {
        amount: MoreThanOrEqual(minAmount),
      },
      relations: ['invoice'],
      order: { amount: 'DESC' },
    });
  }

  /**
   * Obtiene pagos con paginación
   * @param page - Número de página
   * @param limit - Cantidad de resultados
   * @returns Objeto con datos y metadata de paginación
   */
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Payment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.paymentRepository.findAndCount({
      relations: ['invoice'],
      order: { date: 'DESC' },
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
   * Verifica si existe un pago con el ID especificado
   * @param id - UUID del pago
   * @returns true si existe, false si no
   */
  async existsById(id: string): Promise<boolean> {
    const count = await this.paymentRepository.count({
      where: { id },
    });
    return count > 0;
  }

  // ==========================================
  // MÉTODOS DE CÁLCULOS
  // ==========================================

  /**
   * Calcula el total pagado de una factura
   * @param invoiceId - UUID de la factura
   * @returns Total pagado
   */
  async calculateTotalPaid(invoiceId: string): Promise<number> {
    const payments = await this.findByInvoice(invoiceId);
    return payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  }

  /**
   * Calcula el saldo pendiente de una factura
   * @param invoiceId - UUID de la factura
   * @returns Saldo pendiente
   */
  async calculateBalance(invoiceId: string): Promise<number> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
      relations: ['payments'],
    });

    if (!invoice) {
      throw new NotFoundException(`Factura con ID ${invoiceId} no encontrada`);
    }

    const totalPaid = invoice.payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    return Number(invoice.totalAmount) - totalPaid;
  }

  /**
   * Verifica si una factura está completamente pagada
   * @param invoiceId - UUID de la factura
   * @returns true si está pagada, false si no
   */
  async isInvoiceFullyPaid(invoiceId: string): Promise<boolean> {
    const balance = await this.calculateBalance(invoiceId);
    return balance <= 0;
  }

  // ==========================================
  // MÉTODOS DE ESTADÍSTICAS
  // ==========================================

  /**
   * Cuenta el total de pagos
   * @returns Número total de pagos
   */
  async count(): Promise<number> {
    return await this.paymentRepository.count();
  }

  /**
   * Obtiene el total recaudado
   * @returns Suma total de todos los pagos
   */
  async getTotalCollected(): Promise<number> {
    const result = (await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .getRawOne()) as unknown as { total: string } | undefined;

    return Number(result?.total || 0);
  }

  /**
   * Obtiene el total recaudado por método de pago
   * @returns Objeto con totales por método
   */
  async getCollectedByMethod(): Promise<{
    [key in PaymentMethod]: number;
  }> {
    const methods = Object.values(PaymentMethod);
    const result: { [key in PaymentMethod]: number } = {} as {
      [key in PaymentMethod]: number;
    };

    for (const method of methods) {
      const total = (await this.paymentRepository
        .createQueryBuilder('payment')
        .select('SUM(payment.amount)', 'total')
        .where('payment.payment_method = :method', { method })
        .getRawOne()) as unknown as { total: string } | undefined;

      result[method] = Number(total?.total || 0);
    }

    return result;
  }

  /**
   * Obtiene el promedio de pagos
   * @returns Promedio del monto de pagos
   */
  async getAveragePaymentAmount(): Promise<number> {
    const result = (await this.paymentRepository
      .createQueryBuilder('payment')
      .select('AVG(payment.amount)', 'average')
      .getRawOne()) as unknown as { average: string } | undefined;

    return Number(result?.average || 0);
  }

  /**
   * Obtiene los pagos más grandes
   * @param limit - Cantidad de pagos a retornar
   * @returns Array de pagos ordenados por monto
   */
  async getLargestPayments(limit: number = 10): Promise<Payment[]> {
    return await this.paymentRepository.find({
      relations: ['invoice', 'invoice.company', 'invoice.customer'],
      order: { amount: 'DESC' },
      take: limit,
    });
  }

  /**
   * Obtiene estadísticas de pagos por período
   * @param startDate - Fecha inicial
   * @param endDate - Fecha final
   * @returns Estadísticas del período
   */
  async getPaymentStatsByPeriod(
    startDate: Date,
    endDate: Date,
  ): Promise<{
    totalPayments: number;
    totalCollected: number;
    averagePayment: number;
    paymentsByMethod: { [key in PaymentMethod]: number };
  }> {
    const payments = await this.findByDateRange(startDate, endDate);

    const totalPayments = payments.length;
    const totalCollected = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );
    const averagePayment =
      totalPayments > 0 ? totalCollected / totalPayments : 0;

    const paymentsByMethod: { [key in PaymentMethod]: number } = {} as {
      [key in PaymentMethod]: number;
    };

    Object.values(PaymentMethod).forEach((method) => {
      paymentsByMethod[method] = payments
        .filter((p) => p.method === method)
        .reduce((sum, p) => sum + Number(p.amount), 0);
    });

    return {
      totalPayments,
      totalCollected,
      averagePayment,
      paymentsByMethod,
    };
  }

  /**
   * Obtiene estadísticas generales
   * @returns Objeto con estadísticas completas
   */
  async getGeneralStats(): Promise<{
    totalPayments: number;
    totalCollected: number;
    averagePayment: number;
    collectedByMethod: { [key in PaymentMethod]: number };
  }> {
    const totalPayments = await this.count();
    const totalCollected = await this.getTotalCollected();
    const averagePayment = await this.getAveragePaymentAmount();
    const collectedByMethod = await this.getCollectedByMethod();

    return {
      totalPayments,
      totalCollected,
      averagePayment,
      collectedByMethod,
    };
  }
}
