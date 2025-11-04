import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { CreateInvoiceDetailDto } from './dto/create-invoice-detail.dto';
import { UpdateInvoiceDetailDto } from './dto/update-invoice-detail.dto';
import { InvoiceDetail } from './entities/invoice-detail.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';

@Injectable()
export class InvoiceDetailService {
  constructor(
    @InjectRepository(InvoiceDetail)
    private readonly invoiceDetailRepository: Repository<InvoiceDetail>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  // ==========================================
  // MÉTODOS CRUD BÁSICOS
  // ==========================================

  /**
   * Crea un nuevo detalle de factura
   * @param createInvoiceDetailDto - Datos del detalle
   * @returns El detalle creado
   * @throws NotFoundException si la factura no existe
   */
  async create(
    createInvoiceDetailDto: CreateInvoiceDetailDto,
  ): Promise<InvoiceDetail> {
    // Validar que la factura exista
    const invoice = await this.invoiceRepository.findOne({
      where: { id: createInvoiceDetailDto.invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException(
        `Factura con ID ${createInvoiceDetailDto.invoiceId} no encontrada`,
      );
    }

    // Calcular el subtotal
    const subtotal =
      createInvoiceDetailDto.quantity * createInvoiceDetailDto.unitPrice;

    // Crear el detalle
    const detail = this.invoiceDetailRepository.create({
      description: createInvoiceDetailDto.description,
      quantity: createInvoiceDetailDto.quantity,
      unitPrice: createInvoiceDetailDto.unitPrice,
      subtotal,
      invoice,
    });

    return await this.invoiceDetailRepository.save(detail);
  }

  /**
   * Obtiene todos los detalles de factura
   * @returns Array de detalles
   */
  async findAll(): Promise<InvoiceDetail[]> {
    return await this.invoiceDetailRepository.find({
      relations: ['invoice'],
      order: { subtotal: 'DESC' },
    });
  }

  /**
   * Obtiene un detalle por su ID
   * @param id - UUID del detalle
   * @returns El detalle encontrado
   * @throws NotFoundException si el detalle no existe
   */
  async findOne(id: string): Promise<InvoiceDetail> {
    const detail = await this.invoiceDetailRepository.findOne({
      where: { id },
      relations: ['invoice'],
    });

    if (!detail) {
      throw new NotFoundException(
        `Detalle de factura con ID ${id} no encontrado`,
      );
    }

    return detail;
  }

  /**
   * Actualiza un detalle existente
   * @param id - UUID del detalle
   * @param updateInvoiceDetailDto - Datos a actualizar
   * @returns El detalle actualizado
   * @throws NotFoundException si el detalle no existe
   */
  async update(
    id: string,
    updateInvoiceDetailDto: UpdateInvoiceDetailDto,
  ): Promise<InvoiceDetail> {
    // Verificar que el detalle existe
    const detail = await this.findOne(id);

    // Si se actualiza la factura, validar que exista
    if (updateInvoiceDetailDto.invoiceId) {
      const invoice = await this.invoiceRepository.findOne({
        where: { id: updateInvoiceDetailDto.invoiceId },
      });

      if (!invoice) {
        throw new NotFoundException(
          `Factura con ID ${updateInvoiceDetailDto.invoiceId} no encontrada`,
        );
      }
      detail.invoice = invoice;
    }

    // Actualizar campos
    if (updateInvoiceDetailDto.description)
      detail.description = updateInvoiceDetailDto.description;
    if (updateInvoiceDetailDto.quantity !== undefined)
      detail.quantity = updateInvoiceDetailDto.quantity;
    if (updateInvoiceDetailDto.unitPrice !== undefined)
      detail.unitPrice = updateInvoiceDetailDto.unitPrice;

    // Recalcular subtotal si cambió cantidad o precio
    if (
      updateInvoiceDetailDto.quantity !== undefined ||
      updateInvoiceDetailDto.unitPrice !== undefined
    ) {
      detail.subtotal = detail.quantity * detail.unitPrice;
    }

    return await this.invoiceDetailRepository.save(detail);
  }

  /**
   * Elimina un detalle de factura
   * @param id - UUID del detalle
   * @throws NotFoundException si el detalle no existe
   */
  async remove(id: string): Promise<void> {
    const detail = await this.findOne(id);
    await this.invoiceDetailRepository.remove(detail);
  }

  // ==========================================
  // MÉTODOS DE BÚSQUEDA Y FILTRADO
  // ==========================================

  /**
   * Busca detalles por factura
   * @param invoiceId - UUID de la factura
   * @returns Array de detalles de la factura
   */
  async findByInvoice(invoiceId: string): Promise<InvoiceDetail[]> {
    return await this.invoiceDetailRepository.find({
      where: { invoice: { id: invoiceId } },
      relations: ['invoice'],
      order: { subtotal: 'DESC' },
    });
  }

  /**
   * Busca detalles por descripción (búsqueda parcial)
   * @param description - Texto a buscar
   * @returns Array de detalles que coinciden
   */
  async searchByDescription(description: string): Promise<InvoiceDetail[]> {
    if (!description || description.trim().length === 0) {
      throw new BadRequestException('La descripción de búsqueda es requerida');
    }

    return await this.invoiceDetailRepository
      .createQueryBuilder('detail')
      .leftJoinAndSelect('detail.invoice', 'invoice')
      .where('detail.description ILIKE :description', {
        description: `%${description}%`,
      })
      .orderBy('detail.subtotal', 'DESC')
      .getMany();
  }

  /**
   * Busca detalles por rango de cantidad
   * @param minQuantity - Cantidad mínima
   * @param maxQuantity - Cantidad máxima
   * @returns Array de detalles en el rango
   */
  async findByQuantityRange(
    minQuantity: number,
    maxQuantity: number,
  ): Promise<InvoiceDetail[]> {
    return await this.invoiceDetailRepository.find({
      where: [
        {
          quantity: MoreThanOrEqual(minQuantity),
        },
        {
          quantity: LessThanOrEqual(maxQuantity),
        },
      ],
      relations: ['invoice'],
      order: { quantity: 'DESC' },
    });
  }

  /**
   * Busca detalles por precio unitario mínimo
   * @param minPrice - Precio mínimo
   * @returns Array de detalles con precio >= minPrice
   */
  async findByMinUnitPrice(minPrice: number): Promise<InvoiceDetail[]> {
    return await this.invoiceDetailRepository.find({
      where: {
        unitPrice: MoreThanOrEqual(minPrice),
      },
      relations: ['invoice'],
      order: { unitPrice: 'DESC' },
    });
  }

  /**
   * Busca detalles por subtotal mínimo
   * @param minSubtotal - Subtotal mínimo
   * @returns Array de detalles con subtotal >= minSubtotal
   */
  async findByMinSubtotal(minSubtotal: number): Promise<InvoiceDetail[]> {
    return await this.invoiceDetailRepository.find({
      where: {
        subtotal: MoreThanOrEqual(minSubtotal),
      },
      relations: ['invoice'],
      order: { subtotal: 'DESC' },
    });
  }

  /**
   * Obtiene detalles con paginación
   * @param page - Número de página
   * @param limit - Cantidad de resultados
   * @returns Objeto con datos y metadata de paginación
   */
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: InvoiceDetail[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.invoiceDetailRepository.findAndCount({
      relations: ['invoice'],
      order: { subtotal: 'DESC' },
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
   * Verifica si existe un detalle con el ID especificado
   * @param id - UUID del detalle
   * @returns true si existe, false si no
   */
  async existsById(id: string): Promise<boolean> {
    const count = await this.invoiceDetailRepository.count({
      where: { id },
    });
    return count > 0;
  }

  // ==========================================
  // MÉTODOS DE CÁLCULOS
  // ==========================================

  /**
   * Calcula el total de una factura sumando sus detalles
   * @param invoiceId - UUID de la factura
   * @returns Total de la factura
   */
  async calculateInvoiceTotal(invoiceId: string): Promise<number> {
    const details = await this.findByInvoice(invoiceId);
    return details.reduce((sum, detail) => sum + Number(detail.subtotal), 0);
  }

  /**
   * Recalcula el subtotal de un detalle
   * @param id - UUID del detalle
   * @returns El detalle con subtotal actualizado
   */
  async recalculateSubtotal(id: string): Promise<InvoiceDetail> {
    const detail = await this.findOne(id);
    detail.subtotal = detail.quantity * detail.unitPrice;
    return await this.invoiceDetailRepository.save(detail);
  }

  // ==========================================
  // MÉTODOS DE ESTADÍSTICAS
  // ==========================================

  /**
   * Cuenta el total de detalles
   * @returns Número total de detalles
   */
  async count(): Promise<number> {
    return await this.invoiceDetailRepository.count();
  }

  /**
   * Obtiene el promedio de cantidad por detalle
   * @returns Promedio de cantidad
   */
  async getAverageQuantity(): Promise<number> {
    const result = (await this.invoiceDetailRepository
      .createQueryBuilder('detail')
      .select('AVG(detail.quantity)', 'average')
      .getRawOne()) as unknown as { average: string } | undefined;

    return Number(result?.average || 0);
  }

  /**
   * Obtiene el promedio de precio unitario
   * @returns Promedio de precio unitario
   */
  async getAverageUnitPrice(): Promise<number> {
    const result = (await this.invoiceDetailRepository
      .createQueryBuilder('detail')
      .select('AVG(detail.unit_price)', 'average')
      .getRawOne()) as unknown as { average: string } | undefined;

    return Number(result?.average || 0);
  }

  /**
   * Obtiene los productos/servicios más vendidos
   * @param limit - Cantidad de resultados
   * @returns Array de productos más vendidos
   */
  async getTopProducts(limit: number = 10): Promise<
    Array<{
      description: string;
      totalQuantity: number;
      totalRevenue: number;
      occurrences: number;
    }>
  > {
    const result = (await this.invoiceDetailRepository
      .createQueryBuilder('detail')
      .select('detail.description', 'description')
      .addSelect('SUM(detail.quantity)', 'totalQuantity')
      .addSelect('SUM(detail.subtotal)', 'totalRevenue')
      .addSelect('COUNT(detail.id)', 'occurrences')
      .groupBy('detail.description')
      .orderBy('SUM(detail.subtotal)', 'DESC')
      .limit(limit)
      .getRawMany()) as unknown as Array<{
      description: string;
      totalQuantity: string;
      totalRevenue: string;
      occurrences: string;
    }>;

    return result.map((item) => ({
      description: item.description,
      totalQuantity: Number(item.totalQuantity),
      totalRevenue: Number(item.totalRevenue),
      occurrences: Number(item.occurrences),
    }));
  }

  /**
   * Obtiene estadísticas generales de detalles
   * @returns Objeto con estadísticas
   */
  async getGeneralStats(): Promise<{
    totalDetails: number;
    averageQuantity: number;
    averageUnitPrice: number;
    totalRevenue: number;
  }> {
    const totalDetails = await this.count();
    const averageQuantity = await this.getAverageQuantity();
    const averageUnitPrice = await this.getAverageUnitPrice();

    const revenueResult = (await this.invoiceDetailRepository
      .createQueryBuilder('detail')
      .select('SUM(detail.subtotal)', 'total')
      .getRawOne()) as unknown as { total: string } | undefined;

    const totalRevenue = Number(revenueResult?.total || 0);

    return {
      totalDetails,
      averageQuantity,
      averageUnitPrice,
      totalRevenue,
    };
  }
}
