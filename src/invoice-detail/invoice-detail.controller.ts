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
import { InvoiceDetailService } from './invoice-detail.service';
import { CreateInvoiceDetailDto } from './dto/create-invoice-detail.dto';
import { UpdateInvoiceDetailDto } from './dto/update-invoice-detail.dto';
import { InvoiceDetail } from './entities/invoice-detail.entity';

@ApiTags('Invoice Detail')
@Controller('invoice-detail')
export class InvoiceDetailController {
  constructor(private readonly invoiceDetailService: InvoiceDetailService) {}

  // ==========================================
  // ENDPOINTS CRUD BÁSICOS
  // ==========================================

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear nuevo detalle de factura',
    description: 'Crea un nuevo detalle (línea) en una factura',
  })
  @ApiResponse({
    status: 201,
    description: 'Detalle creado exitosamente',
    type: InvoiceDetail,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  create(
    @Body() createInvoiceDetailDto: CreateInvoiceDetailDto,
  ): Promise<InvoiceDetail> {
    return this.invoiceDetailService.create(createInvoiceDetailDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los detalles',
    description:
      'Retorna la lista completa de detalles de factura ordenados por subtotal',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de detalles obtenida exitosamente',
    type: [InvoiceDetail],
  })
  findAll(): Promise<InvoiceDetail[]> {
    return this.invoiceDetailService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalle por ID',
    description: 'Retorna un detalle específico buscado por su UUID',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del detalle',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle encontrado',
    type: InvoiceDetail,
  })
  @ApiResponse({ status: 404, description: 'Detalle no encontrado' })
  findOne(@Param('id') id: string): Promise<InvoiceDetail> {
    return this.invoiceDetailService.findOne(id);
  }

  @Patch(':id/update')
  @ApiOperation({
    summary: 'Actualizar detalle',
    description:
      'Actualiza los datos de un detalle existente y recalcula el subtotal',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del detalle',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle actualizado exitosamente',
    type: InvoiceDetail,
  })
  @ApiResponse({ status: 404, description: 'Detalle no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDetailDto: UpdateInvoiceDetailDto,
  ): Promise<InvoiceDetail> {
    return this.invoiceDetailService.update(id, updateInvoiceDetailDto);
  }

  @Delete(':id/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar detalle',
    description: 'Elimina un detalle de factura del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del detalle',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 204, description: 'Detalle eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Detalle no encontrado' })
  remove(@Param('id') id: string): Promise<void> {
    return this.invoiceDetailService.remove(id);
  }

  // ==========================================
  // ENDPOINTS DE BÚSQUEDA Y FILTRADO
  // ==========================================

  @Get('invoice/:invoiceId')
  @ApiOperation({
    summary: 'Obtener detalles por factura',
    description: 'Retorna todos los detalles de una factura específica',
  })
  @ApiParam({
    name: 'invoiceId',
    description: 'UUID de la factura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la factura',
    type: [InvoiceDetail],
  })
  findByInvoice(
    @Param('invoiceId') invoiceId: string,
  ): Promise<InvoiceDetail[]> {
    return this.invoiceDetailService.findByInvoice(invoiceId);
  }

  @Get('search/description')
  @ApiOperation({
    summary: 'Buscar detalles por descripción',
    description:
      'Busca detalles que contengan el texto especificado en su descripción',
  })
  @ApiQuery({
    name: 'q',
    description: 'Texto a buscar en la descripción',
    example: 'Laptop',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles encontrados',
    type: [InvoiceDetail],
  })
  @ApiResponse({
    status: 400,
    description: 'La descripción de búsqueda es requerida',
  })
  searchByDescription(
    @Query('q') description: string,
  ): Promise<InvoiceDetail[]> {
    return this.invoiceDetailService.searchByDescription(description);
  }

  @Get('quantity-range/search')
  @ApiOperation({
    summary: 'Buscar por rango de cantidad',
    description: 'Retorna detalles con cantidad dentro del rango especificado',
  })
  @ApiQuery({
    name: 'min',
    description: 'Cantidad mínima',
    example: 1,
    required: true,
  })
  @ApiQuery({
    name: 'max',
    description: 'Cantidad máxima',
    example: 100,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles en el rango',
    type: [InvoiceDetail],
  })
  findByQuantityRange(
    @Query('min') minQuantity: number,
    @Query('max') maxQuantity: number,
  ): Promise<InvoiceDetail[]> {
    return this.invoiceDetailService.findByQuantityRange(
      Number(minQuantity),
      Number(maxQuantity),
    );
  }

  @Get('min-unit-price/:minPrice')
  @ApiOperation({
    summary: 'Buscar por precio unitario mínimo',
    description:
      'Retorna detalles con precio unitario mayor o igual al especificado',
  })
  @ApiParam({
    name: 'minPrice',
    description: 'Precio unitario mínimo',
    example: 100,
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles encontrados',
    type: [InvoiceDetail],
  })
  findByMinUnitPrice(
    @Param('minPrice') minPrice: number,
  ): Promise<InvoiceDetail[]> {
    return this.invoiceDetailService.findByMinUnitPrice(Number(minPrice));
  }

  @Get('min-subtotal/:minSubtotal')
  @ApiOperation({
    summary: 'Buscar por subtotal mínimo',
    description: 'Retorna detalles con subtotal mayor o igual al especificado',
  })
  @ApiParam({
    name: 'minSubtotal',
    description: 'Subtotal mínimo',
    example: 1000,
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles encontrados',
    type: [InvoiceDetail],
  })
  findByMinSubtotal(
    @Param('minSubtotal') minSubtotal: number,
  ): Promise<InvoiceDetail[]> {
    return this.invoiceDetailService.findByMinSubtotal(Number(minSubtotal));
  }

  @Get('paginated/list')
  @ApiOperation({
    summary: 'Obtener detalles con paginación',
    description:
      'Retorna una lista paginada de detalles con metadata de paginación',
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
    description: 'Lista paginada de detalles',
  })
  findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    data: InvoiceDetail[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.invoiceDetailService.findAllPaginated(
      Number(page),
      Number(limit),
    );
  }

  // ==========================================
  // ENDPOINTS DE VALIDACIÓN
  // ==========================================

  @Get('exists/id/:id')
  @ApiOperation({
    summary: 'Verificar existencia por ID',
    description: 'Verifica si existe un detalle con el UUID especificado',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del detalle',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna true si existe, false si no',
    schema: { type: 'boolean' },
  })
  existsById(@Param('id') id: string): Promise<boolean> {
    return this.invoiceDetailService.existsById(id);
  }

  // ==========================================
  // ENDPOINTS DE CÁLCULOS
  // ==========================================

  @Get('calculate/invoice-total/:invoiceId')
  @ApiOperation({
    summary: 'Calcular total de factura',
    description: 'Calcula el total de una factura sumando todos sus detalles',
  })
  @ApiParam({
    name: 'invoiceId',
    description: 'UUID de la factura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Total de la factura',
    schema: { type: 'number', example: 5000.5 },
  })
  calculateInvoiceTotal(
    @Param('invoiceId') invoiceId: string,
  ): Promise<number> {
    return this.invoiceDetailService.calculateInvoiceTotal(invoiceId);
  }

  @Patch(':id/recalculate-subtotal')
  @ApiOperation({
    summary: 'Recalcular subtotal',
    description:
      'Recalcula el subtotal de un detalle basado en cantidad y precio unitario',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del detalle',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle con subtotal recalculado',
    type: InvoiceDetail,
  })
  @ApiResponse({ status: 404, description: 'Detalle no encontrado' })
  recalculateSubtotal(@Param('id') id: string): Promise<InvoiceDetail> {
    return this.invoiceDetailService.recalculateSubtotal(id);
  }

  // ==========================================
  // ENDPOINTS DE ESTADÍSTICAS
  // ==========================================

  @Get('count/total')
  @ApiOperation({
    summary: 'Contar total de detalles',
    description: 'Retorna el número total de detalles en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Total de detalles',
    schema: { type: 'number', example: 500 },
  })
  count(): Promise<number> {
    return this.invoiceDetailService.count();
  }

  @Get('stats/average-quantity')
  @ApiOperation({
    summary: 'Obtener promedio de cantidad',
    description: 'Calcula el promedio de cantidad por detalle',
  })
  @ApiResponse({
    status: 200,
    description: 'Promedio de cantidad',
    schema: { type: 'number', example: 5.5 },
  })
  getAverageQuantity(): Promise<number> {
    return this.invoiceDetailService.getAverageQuantity();
  }

  @Get('stats/average-unit-price')
  @ApiOperation({
    summary: 'Obtener promedio de precio unitario',
    description: 'Calcula el promedio de precio unitario',
  })
  @ApiResponse({
    status: 200,
    description: 'Promedio de precio unitario',
    schema: { type: 'number', example: 250.75 },
  })
  getAverageUnitPrice(): Promise<number> {
    return this.invoiceDetailService.getAverageUnitPrice();
  }

  @Get('stats/top-products')
  @ApiOperation({
    summary: 'Obtener productos más vendidos',
    description:
      'Retorna los productos/servicios más vendidos ordenados por ingresos',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Cantidad de productos a retornar',
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos más vendidos',
  })
  getTopProducts(@Query('limit') limit: number = 10) {
    return this.invoiceDetailService.getTopProducts(Number(limit));
  }

  @Get('stats/general')
  @ApiOperation({
    summary: 'Obtener estadísticas generales',
    description: 'Retorna estadísticas completas de los detalles de factura',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas generales',
  })
  getGeneralStats() {
    return this.invoiceDetailService.getGeneralStats();
  }
}
