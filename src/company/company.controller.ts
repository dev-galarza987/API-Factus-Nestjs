import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // ==========================================
  // ENDPOINTS CRUD BÁSICOS
  // ==========================================

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva empresa' })
  @ApiResponse({
    status: 201,
    description: 'Empresa creada exitosamente',
    type: Company,
  })
  @ApiResponse({
    status: 409,
    description: 'El taxId ya existe',
  })
  create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las empresas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de empresas obtenida exitosamente',
    type: [Company],
  })
  findAll(): Promise<Company[]> {
    return this.companyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una empresa por ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID de la empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Empresa encontrada exitosamente',
    type: Company,
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa no encontrada',
  })
  findOne(@Param('id') id: string): Promise<Company> {
    return this.companyService.findOne(id);
  }

  @Patch(':id/update')
  @ApiOperation({ summary: 'Actualizar una empresa existente' })
  @ApiParam({
    name: 'id',
    description: 'UUID de la empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Empresa actualizada exitosamente',
    type: Company,
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'El taxId ya existe en otra empresa',
  })
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una empresa' })
  @ApiParam({
    name: 'id',
    description: 'UUID de la empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Empresa eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa no encontrada',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.companyService.remove(id);
  }

  // ==========================================
  // ENDPOINTS DE BÚSQUEDA Y FILTRADO
  // ==========================================

  @Get('tax-id/:taxId')
  @ApiOperation({
    summary: 'Buscar empresa por número de identificación fiscal',
  })
  @ApiParam({
    name: 'taxId',
    description: 'Número de identificación fiscal (RUC/NIT)',
    example: '20123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Empresa encontrada',
    type: Company,
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa no encontrada',
  })
  findByTaxId(@Param('taxId') taxId: string): Promise<Company> {
    return this.companyService.findByTaxId(taxId);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Buscar empresa por correo electrónico' })
  @ApiParam({
    name: 'email',
    description: 'Correo electrónico de la empresa',
    example: 'contact@techsolutions.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Empresa encontrada',
    type: Company,
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa no encontrada',
  })
  findByEmail(@Param('email') email: string): Promise<Company> {
    return this.companyService.findByEmail(email);
  }

  @Get('search/query')
  @ApiOperation({
    summary: 'Buscar empresas por texto en nombre, email o dirección',
  })
  @ApiQuery({
    name: 'q',
    description: 'Texto a buscar',
    example: 'Tech Solutions',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda',
    type: [Company],
  })
  @ApiResponse({
    status: 400,
    description: 'Término de búsqueda requerido',
  })
  search(@Query('q') query: string): Promise<Company[]> {
    return this.companyService.search(query);
  }

  @Get('paginated/list')
  @ApiOperation({ summary: 'Obtener empresas con paginación' })
  @ApiQuery({
    name: 'page',
    description: 'Número de página',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Cantidad de resultados por página',
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de empresas',
  })
  findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    data: Company[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.companyService.findAllPaginated(Number(page), Number(limit));
  }

  // ==========================================
  // ENDPOINTS DE VALIDACIÓN
  // ==========================================

  @Get('exists/id/:id')
  @ApiOperation({ summary: 'Verificar si existe una empresa por ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID de la empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado de la verificación',
    schema: {
      type: 'object',
      properties: {
        exists: { type: 'boolean' },
      },
    },
  })
  async existsById(@Param('id') id: string): Promise<{ exists: boolean }> {
    const exists = await this.companyService.existsById(id);
    return { exists };
  }

  @Get('exists/tax-id/:taxId')
  @ApiOperation({
    summary:
      'Verificar si existe una empresa por número de identificación fiscal',
  })
  @ApiParam({
    name: 'taxId',
    description: 'Número de identificación fiscal',
    example: '20123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado de la verificación',
    schema: {
      type: 'object',
      properties: {
        exists: { type: 'boolean' },
      },
    },
  })
  async existsByTaxId(
    @Param('taxId') taxId: string,
  ): Promise<{ exists: boolean }> {
    const exists = await this.companyService.existsByTaxId(taxId);
    return { exists };
  }

  // ==========================================
  // ENDPOINTS DE RELACIONES
  // ==========================================

  @Get(':id/with-invoices')
  @ApiOperation({ summary: 'Obtener empresa con todas sus facturas' })
  @ApiParam({
    name: 'id',
    description: 'UUID de la empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Empresa con sus facturas',
    type: Company,
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa no encontrada',
  })
  findWithInvoices(@Param('id') id: string): Promise<Company> {
    return this.companyService.findWithInvoices(id);
  }

  @Get(':id/invoices')
  @ApiOperation({ summary: 'Obtener todas las facturas de una empresa' })
  @ApiParam({
    name: 'id',
    description: 'UUID de la empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de facturas de la empresa',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa no encontrada',
  })
  getInvoicesByCompany(@Param('id') id: string) {
    return this.companyService.getInvoicesByCompany(id);
  }

  // ==========================================
  // ENDPOINTS DE ESTADÍSTICAS
  // ==========================================

  @Get(':id/stats')
  @ApiOperation({ summary: 'Obtener estadísticas de una empresa' })
  @ApiParam({
    name: 'id',
    description: 'UUID de la empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de la empresa',
    schema: {
      type: 'object',
      properties: {
        company: { type: 'object' },
        totalInvoices: { type: 'number' },
        totalAmount: { type: 'number' },
        pendingInvoices: { type: 'number' },
        paidInvoices: { type: 'number' },
        cancelledInvoices: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa no encontrada',
  })
  getCompanyStats(@Param('id') id: string) {
    return this.companyService.getCompanyStats(id);
  }

  @Get('count/total')
  @ApiOperation({ summary: 'Obtener el total de empresas registradas' })
  @ApiResponse({
    status: 200,
    description: 'Total de empresas',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
      },
    },
  })
  async count(): Promise<{ total: number }> {
    const total = await this.companyService.count();
    return { total };
  }
}
