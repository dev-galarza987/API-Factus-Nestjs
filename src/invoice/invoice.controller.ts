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
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { StateInvoice } from 'src/types/StateInvoice';

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  // ==========================================
  // ENDPOINTS CRUD BÁSICOS
  // ==========================================

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear nueva factura',
    description: 'Crea una nueva factura con sus detalles asociados',
  })
  @ApiResponse({
    status: 201,
    description: 'Factura creada exitosamente',
    type: Invoice,
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una factura con ese número',
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({
    status: 404,
    description: 'Empresa o cliente no encontrado',
  })
  create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las facturas',
    description:
      'Retorna la lista completa de facturas ordenadas por fecha de emisión',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de facturas obtenida exitosamente',
    type: [Invoice],
  })
  findAll(): Promise<Invoice[]> {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener factura por ID',
    description:
      'Retorna una factura específica con sus detalles y pagos asociados',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la factura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Factura encontrada',
    type: Invoice,
  })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  findOne(@Param('id') id: string): Promise<Invoice> {
    return this.invoiceService.findOne(id);
  }

  @Patch(':id/update')
  @ApiOperation({
    summary: 'Actualizar factura',
    description: 'Actualiza los datos de una factura existente',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la factura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Factura actualizada exitosamente',
    type: Invoice,
  })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe otra factura con ese número',
  })
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Delete(':id/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar factura',
    description: 'Elimina una factura y sus detalles del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la factura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 204, description: 'Factura eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  remove(@Param('id') id: string): Promise<void> {
    return this.invoiceService.remove(id);
  }

  // ==========================================
  // ENDPOINTS DE BÚSQUEDA Y FILTRADO
  // ==========================================

  @Get('number/:number')
  @ApiOperation({
    summary: 'Buscar factura por número',
    description: 'Busca una factura específica por su número de factura',
  })
  @ApiParam({
    name: 'number',
    description: 'Número de factura',
    example: 'FAC-2024-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Factura encontrada',
    type: Invoice,
  })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  findByNumber(@Param('number') number: string): Promise<Invoice> {
    return this.invoiceService.findByNumber(number);
  }

  @Get('status/:status')
  @ApiOperation({
    summary: 'Buscar facturas por estado',
    description: 'Retorna todas las facturas con un estado específico',
  })
  @ApiParam({
    name: 'status',
    description: 'Estado de la factura',
    enum: StateInvoice,
    example: 'PENDING',
  })
  @ApiResponse({
    status: 200,
    description: 'Facturas encontradas',
    type: [Invoice],
  })
  findByStatus(@Param('status') status: StateInvoice): Promise<Invoice[]> {
    return this.invoiceService.findByStatus(status);
  }

  @Get('company/:companyId')
  @ApiOperation({
    summary: 'Buscar facturas por empresa',
    description: 'Retorna todas las facturas emitidas por una empresa',
  })
  @ApiParam({
    name: 'companyId',
    description: 'UUID de la empresa',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Facturas de la empresa',
    type: [Invoice],
  })
  findByCompany(@Param('companyId') companyId: string): Promise<Invoice[]> {
    return this.invoiceService.findByCompany(companyId);
  }

  @Get('customer/:customerId')
  @ApiOperation({
    summary: 'Buscar facturas por cliente',
    description: 'Retorna todas las facturas de un cliente específico',
  })
  @ApiParam({
    name: 'customerId',
    description: 'UUID del cliente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Facturas del cliente',
    type: [Invoice],
  })
  findByCustomer(@Param('customerId') customerId: string): Promise<Invoice[]> {
    return this.invoiceService.findByCustomer(customerId);
  }

  @Get('date-range/search')
  @ApiOperation({
    summary: 'Buscar facturas por rango de fechas',
    description: 'Retorna facturas emitidas dentro de un rango de fechas',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Fecha inicial (ISO 8601)',
    example: '2024-01-01T00:00:00.000Z',
    required: true,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'Fecha final (ISO 8601)',
    example: '2024-12-31T23:59:59.999Z',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Facturas en el rango especificado',
    type: [Invoice],
  })
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Invoice[]> {
    return this.invoiceService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('min-amount/:minAmount')
  @ApiOperation({
    summary: 'Buscar facturas por monto mínimo',
    description:
      'Retorna facturas con monto total mayor o igual al especificado',
  })
  @ApiParam({
    name: 'minAmount',
    description: 'Monto mínimo',
    example: 1000,
  })
  @ApiResponse({
    status: 200,
    description: 'Facturas encontradas',
    type: [Invoice],
  })
  findByMinAmount(@Param('minAmount') minAmount: number): Promise<Invoice[]> {
    return this.invoiceService.findByMinAmount(Number(minAmount));
  }

  @Get('paginated/list')
  @ApiOperation({
    summary: 'Obtener facturas con paginación',
    description:
      'Retorna una lista paginada de facturas con metadata de paginación',
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
    description: 'Lista paginada de facturas',
  })
  findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    data: Invoice[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.invoiceService.findAllPaginated(Number(page), Number(limit));
  }

  // ==========================================
  // ENDPOINTS DE VALIDACIÓN
  // ==========================================

  @Get('exists/id/:id')
  @ApiOperation({
    summary: 'Verificar existencia por ID',
    description: 'Verifica si existe una factura con el UUID especificado',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la factura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna true si existe, false si no',
    schema: { type: 'boolean' },
  })
  existsById(@Param('id') id: string): Promise<boolean> {
    return this.invoiceService.existsById(id);
  }

  @Get('exists/number/:number')
  @ApiOperation({
    summary: 'Verificar existencia por número',
    description: 'Verifica si existe una factura con el número especificado',
  })
  @ApiParam({
    name: 'number',
    description: 'Número de factura',
    example: 'FAC-2024-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna true si existe, false si no',
    schema: { type: 'boolean' },
  })
  existsByNumber(@Param('number') number: string): Promise<boolean> {
    return this.invoiceService.existsByNumber(number);
  }

  // ==========================================
  // ENDPOINTS DE ESTADO Y PAGOS
  // ==========================================

  @Patch(':id/status/:status')
  @ApiOperation({
    summary: 'Cambiar estado de factura',
    description: 'Actualiza el estado de una factura',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la factura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'status',
    description: 'Nuevo estado',
    enum: StateInvoice,
    example: 'PAID',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado exitosamente',
    type: Invoice,
  })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  changeStatus(
    @Param('id') id: string,
    @Param('status') status: StateInvoice,
  ): Promise<Invoice> {
    return this.invoiceService.changeStatus(id, status);
  }

  @Patch(':id/mark-as-paid')
  @ApiOperation({
    summary: 'Marcar factura como pagada',
    description: 'Cambia el estado de la factura a PAID',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la factura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Factura marcada como pagada',
    type: Invoice,
  })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  markAsPaid(@Param('id') id: string): Promise<Invoice> {
    return this.invoiceService.markAsPaid(id);
  }

  @Patch(':id/mark-as-pending')
  @ApiOperation({
    summary: 'Marcar factura como pendiente',
    description: 'Cambia el estado de la factura a PENDING',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la factura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Factura marcada como pendiente',
    type: Invoice,
  })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  markAsPending(@Param('id') id: string): Promise<Invoice> {
    return this.invoiceService.markAsPending(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({
    summary: 'Cancelar factura',
    description: 'Cambia el estado de la factura a CANCELLED',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la factura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Factura cancelada',
    type: Invoice,
  })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  cancelInvoice(@Param('id') id: string): Promise<Invoice> {
    return this.invoiceService.cancelInvoice(id);
  }

  @Get(':id/total-paid')
  @ApiOperation({
    summary: 'Obtener total pagado',
    description: 'Calcula el monto total pagado de una factura',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la factura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Total pagado',
    schema: { type: 'number', example: 1500.5 },
  })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  getTotalPaid(@Param('id') id: string): Promise<number> {
    return this.invoiceService.getTotalPaid(id);
  }

  @Get(':id/balance')
  @ApiOperation({
    summary: 'Obtener saldo pendiente',
    description: 'Calcula el saldo pendiente de pago de una factura',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la factura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Saldo pendiente',
    schema: { type: 'number', example: 500.0 },
  })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  getBalance(@Param('id') id: string): Promise<number> {
    return this.invoiceService.getBalance(id);
  }

  // ==========================================
  // ENDPOINTS DE ESTADÍSTICAS
  // ==========================================

  @Get('count/total')
  @ApiOperation({
    summary: 'Contar total de facturas',
    description: 'Retorna el número total de facturas en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Total de facturas',
    schema: { type: 'number', example: 250 },
  })
  count(): Promise<number> {
    return this.invoiceService.count();
  }

  @Get('stats/total-revenue')
  @ApiOperation({
    summary: 'Obtener ingresos totales',
    description: 'Calcula la suma total de todas las facturas',
  })
  @ApiResponse({
    status: 200,
    description: 'Ingresos totales',
    schema: { type: 'number', example: 150000.5 },
  })
  getTotalRevenue(): Promise<number> {
    return this.invoiceService.getTotalRevenue();
  }

  @Get('stats/revenue-by-status')
  @ApiOperation({
    summary: 'Obtener ingresos por estado',
    description: 'Calcula el total facturado agrupado por estado',
  })
  @ApiResponse({
    status: 200,
    description: 'Ingresos por estado',
    schema: {
      type: 'object',
      properties: {
        pending: { type: 'number', example: 50000 },
        paid: { type: 'number', example: 90000 },
        cancelled: { type: 'number', example: 10000 },
      },
    },
  })
  getRevenueByStatus(): Promise<{
    pending: number;
    paid: number;
    cancelled: number;
  }> {
    return this.invoiceService.getRevenueByStatus();
  }

  @Get('stats/general')
  @ApiOperation({
    summary: 'Obtener estadísticas generales',
    description: 'Retorna estadísticas completas del sistema de facturación',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas generales',
  })
  getGeneralStats() {
    return this.invoiceService.getGeneralStats();
  }
}
