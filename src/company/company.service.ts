import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { StateInvoice } from 'src/types/StateInvoice';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // ==========================================
  // MÉTODOS CRUD BÁSICOS
  // ==========================================

  /**
   * Crea una nueva empresa
   * @param createCompanyDto - Datos de la empresa a crear
   * @returns La empresa creada
   * @throws ConflictException si el taxId ya existe
   */
  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    // Validar que el taxId no exista
    const existingCompany = await this.companyRepository.findOne({
      where: { taxId: createCompanyDto.taxId },
    });

    if (existingCompany) {
      throw new ConflictException(
        `Ya existe una empresa con el número de identificación fiscal: ${createCompanyDto.taxId}`,
      );
    }

    // Crear y guardar la empresa
    const company = this.companyRepository.create(createCompanyDto);
    return await this.companyRepository.save(company);
  }

  /**
   * Obtiene todas las empresas
   * @returns Array de empresas
   */
  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find({
      order: { businessName: 'ASC' },
    });
  }

  /**
   * Obtiene una empresa por su ID
   * @param id - UUID de la empresa
   * @returns La empresa encontrada
   * @throws NotFoundException si la empresa no existe
   */
  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    }

    return company;
  }

  /**
   * Actualiza una empresa existente
   * @param id - UUID de la empresa
   * @param updateCompanyDto - Datos a actualizar
   * @returns La empresa actualizada
   * @throws NotFoundException si la empresa no existe
   * @throws ConflictException si el taxId ya existe en otra empresa
   */
  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    // Verificar que la empresa existe
    const company = await this.findOne(id);

    // Si se está actualizando el taxId, validar que no exista en otra empresa
    if (updateCompanyDto.taxId && updateCompanyDto.taxId !== company.taxId) {
      const existingCompany = await this.companyRepository.findOne({
        where: { taxId: updateCompanyDto.taxId },
      });

      if (existingCompany) {
        throw new ConflictException(
          `Ya existe otra empresa con el número de identificación fiscal: ${updateCompanyDto.taxId}`,
        );
      }
    }

    // Actualizar la empresa
    Object.assign(company, updateCompanyDto);
    return await this.companyRepository.save(company);
  }

  /**
   * Elimina una empresa
   * @param id - UUID de la empresa
   * @throws NotFoundException si la empresa no existe
   */
  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    await this.companyRepository.remove(company);
  }

  // ==========================================
  // MÉTODOS DE BÚSQUEDA Y FILTRADO
  // ==========================================

  /**
   * Busca una empresa por su número de identificación fiscal
   * @param taxId - Número de identificación fiscal
   * @returns La empresa encontrada
   * @throws NotFoundException si no existe
   */
  async findByTaxId(taxId: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { taxId },
    });

    if (!company) {
      throw new NotFoundException(`Empresa con taxId ${taxId} no encontrada`);
    }

    return company;
  }

  /**
   * Busca una empresa por su correo electrónico
   * @param email - Correo electrónico
   * @returns La empresa encontrada
   * @throws NotFoundException si no existe
   */
  async findByEmail(email: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { email },
    });

    if (!company) {
      throw new NotFoundException(`Empresa con email ${email} no encontrada`);
    }

    return company;
  }

  /**
   * Busca empresas por texto en nombre, email o dirección
   * @param query - Texto a buscar
   * @returns Array de empresas que coinciden
   */
  async search(query: string): Promise<Company[]> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('El término de búsqueda es requerido');
    }

    return await this.companyRepository.find({
      where: [
        { businessName: Like(`%${query}%`) },
        { email: Like(`%${query}%`) },
        { address: Like(`%${query}%`) },
      ],
      order: { businessName: 'ASC' },
    });
  }

  /**
   * Obtiene empresas con paginación
   * @param page - Número de página (empezando en 1)
   * @param limit - Cantidad de resultados por página
   * @returns Objeto con datos y metadata de paginación
   */
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Company[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.companyRepository.findAndCount({
      order: { businessName: 'ASC' },
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
   * Verifica si existe una empresa con el ID especificado
   * @param id - UUID de la empresa
   * @returns true si existe, false si no
   */
  async existsById(id: string): Promise<boolean> {
    const count = await this.companyRepository.count({
      where: { id },
    });
    return count > 0;
  }

  /**
   * Verifica si existe una empresa con el taxId especificado
   * @param taxId - Número de identificación fiscal
   * @returns true si existe, false si no
   */
  async existsByTaxId(taxId: string): Promise<boolean> {
    const count = await this.companyRepository.count({
      where: { taxId },
    });
    return count > 0;
  }

  // ==========================================
  // MÉTODOS DE RELACIONES
  // ==========================================

  /**
   * Obtiene una empresa con todas sus facturas
   * @param id - UUID de la empresa
   * @returns La empresa con sus facturas
   * @throws NotFoundException si la empresa no existe
   */
  async findWithInvoices(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['invoices'],
    });

    if (!company) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    }

    return company;
  }

  /**
   * Obtiene todas las facturas de una empresa
   * @param id - UUID de la empresa
   * @returns Array de facturas de la empresa
   * @throws NotFoundException si la empresa no existe
   */
  async getInvoicesByCompany(id: string): Promise<Invoice[]> {
    const company = await this.findWithInvoices(id);
    return company.invoices;
  }

  // ==========================================
  // MÉTODOS DE ESTADÍSTICAS
  // ==========================================

  /**
   * Obtiene estadísticas de una empresa
   * @param id - UUID de la empresa
   * @returns Objeto con estadísticas de la empresa
   * @throws NotFoundException si la empresa no existe
   */
  async getCompanyStats(id: string): Promise<{
    company: Company;
    totalInvoices: number;
    totalAmount: number;
    pendingInvoices: number;
    paidInvoices: number;
    cancelledInvoices: number;
  }> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['invoices'],
    });

    if (!company) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    }

    const totalInvoices = company.invoices.length;
    const totalAmount = company.invoices.reduce(
      (sum, invoice) => sum + Number(invoice.totalAmount),
      0,
    );
    const pendingInvoices = company.invoices.filter(
      (inv) => inv.status === StateInvoice.PENDING,
    ).length;
    const paidInvoices = company.invoices.filter(
      (inv) => inv.status === StateInvoice.PAID,
    ).length;
    const cancelledInvoices = company.invoices.filter(
      (inv) => inv.status === StateInvoice.CANCELLED,
    ).length;

    return {
      company,
      totalInvoices,
      totalAmount,
      pendingInvoices,
      paidInvoices,
      cancelledInvoices,
    };
  }

  /**
   * Cuenta el total de empresas registradas
   * @returns Número total de empresas
   */
  async count(): Promise<number> {
    return await this.companyRepository.count();
  }
}
