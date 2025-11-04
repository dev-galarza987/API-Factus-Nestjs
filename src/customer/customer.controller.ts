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
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // ==========================================
  // ENDPOINTS CRUD BÁSICOS
  // ==========================================

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear nuevo cliente',
    description: 'Crea un nuevo cliente en el sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Cliente creado exitosamente',
    type: Customer,
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un cliente con ese número de identificación',
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() createCustomer: CreateCustomerDto): Promise<Customer> {
    return this.customerService.create(createCustomer);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los clientes',
    description: 'Retorna la lista completa de clientes ordenados por nombre',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes obtenida exitosamente',
    type: [Customer],
  })
  findAll(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener cliente por ID',
    description: 'Retorna un cliente específico buscado por su UUID',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del cliente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado',
    type: Customer,
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.customerService.findOne(id);
  }

  @Patch(':id/update')
  @ApiOperation({
    summary: 'Actualizar cliente',
    description: 'Actualiza los datos de un cliente existente',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del cliente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente actualizado exitosamente',
    type: Customer,
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe otro cliente con ese número de identificación',
  })
  update(
    @Param('id') id: string,
    @Body() updateCustomer: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.update(id, updateCustomer);
  }

  @Delete(':id/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar cliente',
    description: 'Elimina un cliente del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del cliente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 204, description: 'Cliente eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  remove(@Param('id') id: string): Promise<void> {
    return this.customerService.remove(id);
  }

  // ==========================================
  // ENDPOINTS DE BÚSQUEDA Y FILTRADO
  // ==========================================

  @Get('tax-id/:taxOrId')
  @ApiOperation({
    summary: 'Buscar cliente por identificación',
    description:
      'Busca un cliente específico por su número de identificación fiscal o documento',
  })
  @ApiParam({
    name: 'taxOrId',
    description: 'Número de identificación fiscal o documento',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado',
    type: Customer,
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findByTaxOrId(@Param('taxOrId') taxOrId: string): Promise<Customer> {
    return this.customerService.findByTaxOrId(taxOrId);
  }

  @Get('email/:email')
  @ApiOperation({
    summary: 'Buscar cliente por email',
    description: 'Busca un cliente específico por su correo electrónico',
  })
  @ApiParam({
    name: 'email',
    description: 'Correo electrónico del cliente',
    example: 'cliente@example.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado',
    type: Customer,
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findByEmail(@Param('email') email: string): Promise<Customer> {
    return this.customerService.findByEmail(email);
  }

  @Get('search/query')
  @ApiOperation({
    summary: 'Buscar clientes por texto',
    description:
      'Busca clientes que coincidan con el texto en nombre o email (búsqueda parcial)',
  })
  @ApiQuery({
    name: 'q',
    description: 'Término de búsqueda',
    example: 'Juan',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Clientes encontrados',
    type: [Customer],
  })
  @ApiResponse({
    status: 400,
    description: 'El término de búsqueda es requerido',
  })
  search(@Query('q') query: string): Promise<Customer[]> {
    return this.customerService.search(query);
  }

  @Get('paginated/list')
  @ApiOperation({
    summary: 'Obtener clientes con paginación',
    description:
      'Retorna una lista paginada de clientes con metadata de paginación',
  })
  @ApiQuery({
    name: 'page',
    description: 'Número de página (inicia en 1)',
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
    description: 'Lista paginada de clientes',
  })
  findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    data: Customer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.customerService.findAllPaginated(Number(page), Number(limit));
  }

  // ==========================================
  // ENDPOINTS DE VALIDACIÓN
  // ==========================================

  @Get('exists/id/:id')
  @ApiOperation({
    summary: 'Verificar existencia por ID',
    description: 'Verifica si existe un cliente con el UUID especificado',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del cliente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna true si existe, false si no',
    schema: { type: 'boolean' },
  })
  existsById(@Param('id') id: string): Promise<boolean> {
    return this.customerService.existsById(id);
  }

  @Get('exists/tax-id/:taxOrId')
  @ApiOperation({
    summary: 'Verificar existencia por identificación',
    description:
      'Verifica si existe un cliente con el número de identificación especificado',
  })
  @ApiParam({
    name: 'taxOrId',
    description: 'Número de identificación',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna true si existe, false si no',
    schema: { type: 'boolean' },
  })
  existsByTaxOrId(@Param('taxOrId') taxOrId: string): Promise<boolean> {
    return this.customerService.existsByTaxOrId(taxOrId);
  }

  // ==========================================
  // ENDPOINTS DE RELACIONES
  // ==========================================

  @Get(':id/with-invoices')
  @ApiOperation({
    summary: 'Obtener cliente con sus facturas',
    description: 'Retorna un cliente incluyendo todas sus facturas asociadas',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del cliente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente con facturas',
    type: Customer,
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findWithInvoices(@Param('id') id: string): Promise<Customer> {
    return this.customerService.findWithInvoices(id);
  }

  @Get(':id/invoices')
  @ApiOperation({
    summary: 'Obtener facturas del cliente',
    description: 'Retorna todas las facturas asociadas a un cliente',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del cliente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de facturas del cliente',
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  getInvoicesByCustomer(@Param('id') id: string) {
    return this.customerService.getInvoicesByCustomer(id);
  }

  // ==========================================
  // ENDPOINTS DE ESTADÍSTICAS
  // ==========================================

  @Get(':id/stats')
  @ApiOperation({
    summary: 'Obtener estadísticas del cliente',
    description:
      'Retorna estadísticas completas de un cliente: total de facturas, monto gastado, promedios y facturas por estado',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del cliente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas del cliente',
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  getCustomerStats(@Param('id') id: string) {
    return this.customerService.getCustomerStats(id);
  }

  @Get('count/total')
  @ApiOperation({
    summary: 'Contar total de clientes',
    description:
      'Retorna el número total de clientes registrados en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Total de clientes',
    schema: { type: 'number', example: 150 },
  })
  count(): Promise<number> {
    return this.customerService.count();
  }

  @Get('top/customers')
  @ApiOperation({
    summary: 'Obtener mejores clientes',
    description:
      'Retorna los clientes con más compras ordenados por total gastado',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Cantidad de clientes a retornar',
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de mejores clientes',
  })
  getTopCustomers(@Query('limit') limit: number = 10) {
    return this.customerService.getTopCustomers(Number(limit));
  }
}
