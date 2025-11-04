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
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentMethod } from 'src/types/PaymentMethod';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // ==========================================
  // ENDPOINTS CRUD BÁSICOS
  // ==========================================

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear nuevo pago',
    description:
      'Registra un nuevo pago asociado a una factura y valida que no exceda el saldo pendiente',
  })
  @ApiResponse({
    status: 201,
    description: 'Pago creado exitosamente',
    type: Payment,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  create(@Body() createPayment: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(createPayment);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los pagos',
    description:
      'Retorna la lista completa de pagos ordenados por fecha descendente',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagos obtenida exitosamente',
    type: [Payment],
  })
  findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener pago por ID',
    description:
      'Retorna un pago específico con su factura, empresa y cliente asociados',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del pago',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Pago encontrado',
    type: Payment,
  })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  findOne(@Param('id') id: string): Promise<Payment> {
    return this.paymentService.findOne(id);
  }

  @Patch(':id/update')
  @ApiOperation({
    summary: 'Actualizar pago',
    description: 'Actualiza los datos de un pago existente',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del pago',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Pago actualizado exitosamente',
    type: Payment,
  })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updatePayment: UpdatePaymentDto,
  ): Promise<Payment> {
    return this.paymentService.update(id, updatePayment);
  }

  @Delete(':id/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar pago',
    description: 'Elimina un pago del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del pago',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 204, description: 'Pago eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  remove(@Param('id') id: string): Promise<void> {
    return this.paymentService.remove(id);
  }

  // ==========================================
  // ENDPOINTS DE BÚSQUEDA Y FILTRADO
  // ==========================================

  @Get('invoice/:invoiceId')
  @ApiOperation({
    summary: 'Obtener pagos por factura',
    description: 'Retorna todos los pagos asociados a una factura específica',
  })
  @ApiParam({
    name: 'invoiceId',
    description: 'UUID de la factura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Pagos de la factura',
    type: [Payment],
  })
  findByInvoice(@Param('invoiceId') invoiceId: string): Promise<Payment[]> {
    return this.paymentService.findByInvoice(invoiceId);
  }

  @Get('method/:method')
  @ApiOperation({
    summary: 'Buscar pagos por método',
    description: 'Retorna todos los pagos realizados con un método específico',
  })
  @ApiParam({
    name: 'method',
    description: 'Método de pago',
    enum: PaymentMethod,
    example: 'CASH',
  })
  @ApiResponse({
    status: 200,
    description: 'Pagos encontrados',
    type: [Payment],
  })
  findByMethod(@Param('method') method: PaymentMethod): Promise<Payment[]> {
    return this.paymentService.findByMethod(method);
  }

  @Get('date-range/search')
  @ApiOperation({
    summary: 'Buscar pagos por rango de fechas',
    description: 'Retorna pagos realizados dentro de un rango de fechas',
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
    description: 'Pagos en el rango especificado',
    type: [Payment],
  })
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Payment[]> {
    return this.paymentService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('min-amount/:minAmount')
  @ApiOperation({
    summary: 'Buscar pagos por monto mínimo',
    description: 'Retorna pagos con monto mayor o igual al especificado',
  })
  @ApiParam({
    name: 'minAmount',
    description: 'Monto mínimo',
    example: 1000,
  })
  @ApiResponse({
    status: 200,
    description: 'Pagos encontrados',
    type: [Payment],
  })
  findByMinAmount(@Param('minAmount') minAmount: number): Promise<Payment[]> {
    return this.paymentService.findByMinAmount(Number(minAmount));
  }

  @Get('paginated/list')
  @ApiOperation({
    summary: 'Obtener pagos con paginación',
    description:
      'Retorna una lista paginada de pagos con metadata de paginación',
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
    description: 'Lista paginada de pagos',
  })
  findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    data: Payment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.paymentService.findAllPaginated(Number(page), Number(limit));
  }

  // ==========================================
  // ENDPOINTS DE VALIDACIÓN
  // ==========================================

  @Get('exists/id/:id')
  @ApiOperation({
    summary: 'Verificar existencia por ID',
    description: 'Verifica si existe un pago con el UUID especificado',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del pago',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna true si existe, false si no',
    schema: { type: 'boolean' },
  })
  existsById(@Param('id') id: string): Promise<boolean> {
    return this.paymentService.existsById(id);
  }

  // ==========================================
  // ENDPOINTS DE CÁLCULOS
  // ==========================================

  @Get('calculate/total-paid/:invoiceId')
  @ApiOperation({
    summary: 'Calcular total pagado',
    description: 'Calcula el monto total pagado de una factura',
  })
  @ApiParam({
    name: 'invoiceId',
    description: 'UUID de la factura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Total pagado',
    schema: { type: 'number', example: 2500.75 },
  })
  calculateTotalPaid(@Param('invoiceId') invoiceId: string): Promise<number> {
    return this.paymentService.calculateTotalPaid(invoiceId);
  }

  @Get('calculate/balance/:invoiceId')
  @ApiOperation({
    summary: 'Calcular saldo pendiente',
    description: 'Calcula el saldo pendiente de pago de una factura',
  })
  @ApiParam({
    name: 'invoiceId',
    description: 'UUID de la factura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Saldo pendiente',
    schema: { type: 'number', example: 1500.0 },
  })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  calculateBalance(@Param('invoiceId') invoiceId: string): Promise<number> {
    return this.paymentService.calculateBalance(invoiceId);
  }

  @Get('check/fully-paid/:invoiceId')
  @ApiOperation({
    summary: 'Verificar si factura está pagada',
    description: 'Verifica si una factura está completamente pagada',
  })
  @ApiParam({
    name: 'invoiceId',
    description: 'UUID de la factura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna true si está pagada, false si no',
    schema: { type: 'boolean' },
  })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  isInvoiceFullyPaid(@Param('invoiceId') invoiceId: string): Promise<boolean> {
    return this.paymentService.isInvoiceFullyPaid(invoiceId);
  }

  // ==========================================
  // ENDPOINTS DE ESTADÍSTICAS
  // ==========================================

  @Get('count/total')
  @ApiOperation({
    summary: 'Contar total de pagos',
    description: 'Retorna el número total de pagos en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Total de pagos',
    schema: { type: 'number', example: 350 },
  })
  count(): Promise<number> {
    return this.paymentService.count();
  }

  @Get('stats/total-collected')
  @ApiOperation({
    summary: 'Obtener total recaudado',
    description: 'Calcula la suma total de todos los pagos',
  })
  @ApiResponse({
    status: 200,
    description: 'Total recaudado',
    schema: { type: 'number', example: 125000.5 },
  })
  getTotalCollected(): Promise<number> {
    return this.paymentService.getTotalCollected();
  }

  @Get('stats/collected-by-method')
  @ApiOperation({
    summary: 'Obtener recaudación por método',
    description: 'Calcula el total recaudado agrupado por método de pago',
  })
  @ApiResponse({
    status: 200,
    description: 'Recaudación por método',
  })
  getCollectedByMethod() {
    return this.paymentService.getCollectedByMethod();
  }

  @Get('stats/average-payment')
  @ApiOperation({
    summary: 'Obtener promedio de pagos',
    description: 'Calcula el promedio del monto de los pagos',
  })
  @ApiResponse({
    status: 200,
    description: 'Promedio de pagos',
    schema: { type: 'number', example: 357.14 },
  })
  getAveragePaymentAmount(): Promise<number> {
    return this.paymentService.getAveragePaymentAmount();
  }

  @Get('stats/largest-payments')
  @ApiOperation({
    summary: 'Obtener pagos más grandes',
    description: 'Retorna los pagos de mayor monto ordenados descendentemente',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Cantidad de pagos a retornar',
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagos más grandes',
    type: [Payment],
  })
  getLargestPayments(@Query('limit') limit: number = 10): Promise<Payment[]> {
    return this.paymentService.getLargestPayments(Number(limit));
  }

  @Get('stats/by-period')
  @ApiOperation({
    summary: 'Obtener estadísticas por período',
    description:
      'Retorna estadísticas de pagos dentro de un rango de fechas específico',
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
    description: 'Estadísticas del período',
  })
  getPaymentStatsByPeriod(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.paymentService.getPaymentStatsByPeriod(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('stats/general')
  @ApiOperation({
    summary: 'Obtener estadísticas generales',
    description: 'Retorna estadísticas completas del sistema de pagos',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas generales',
  })
  getGeneralStats() {
    return this.paymentService.getGeneralStats();
  }
}
