import { Controller, Get, Render } from '@nestjs/common';

@Controller('home')
export class HomeController {
  @Get()
  @Render('index')
  getHome() {
    return {
      title: 'API-Factus',
      description:
        'Sistema de facturación completo construido con NestJS y PostgreSQL',
      version: '1.0.0',
      modules: [
        {
          name: 'Company',
          description: 'Gestión de empresas y datos corporativos',
          icon: '🏢',
          endpoints: [
            {
              method: 'POST',
              path: '/api/v1/company/create',
              description: 'Crear nueva empresa',
            },
            {
              method: 'GET',
              path: '/api/v1/company',
              description: 'Obtener todas las empresas',
            },
            {
              method: 'GET',
              path: '/api/v1/company/:id',
              description: 'Obtener empresa por ID',
            },
            {
              method: 'PATCH',
              path: '/api/v1/company/:id/update',
              description: 'Actualizar empresa',
            },
            {
              method: 'DELETE',
              path: '/api/v1/company/:id/delete',
              description: 'Eliminar empresa',
            },
            {
              method: 'GET',
              path: '/api/v1/company/search/business-name/:name',
              description: 'Buscar por razón social',
            },
            {
              method: 'GET',
              path: '/api/v1/company/search/ruc/:ruc',
              description: 'Buscar por RUC',
            },
            {
              method: 'GET',
              path: '/api/v1/company/search/email/:email',
              description: 'Buscar por email',
            },
            {
              method: 'GET',
              path: '/api/v1/company/filter/active',
              description: 'Filtrar empresas activas',
            },
            {
              method: 'GET',
              path: '/api/v1/company/paginated/list',
              description: 'Obtener con paginación',
            },
            {
              method: 'GET',
              path: '/api/v1/company/exists/ruc/:ruc',
              description: 'Verificar existencia por RUC',
            },
            {
              method: 'GET',
              path: '/api/v1/company/:id/with-invoices',
              description: 'Obtener con facturas',
            },
            {
              method: 'GET',
              path: '/api/v1/company/:id/invoice-count',
              description: 'Contar facturas',
            },
            {
              method: 'GET',
              path: '/api/v1/company/count/total',
              description: 'Contar total',
            },
            {
              method: 'GET',
              path: '/api/v1/company/count/active',
              description: 'Contar activas',
            },
          ],
        },
        {
          name: 'Customer',
          description: 'Gestión de clientes del sistema',
          icon: '👥',
          endpoints: [
            {
              method: 'POST',
              path: '/api/v1/customer/create',
              description: 'Crear nuevo cliente',
            },
            {
              method: 'GET',
              path: '/api/v1/customer',
              description: 'Obtener todos los clientes',
            },
            {
              method: 'GET',
              path: '/api/v1/customer/:id',
              description: 'Obtener cliente por ID',
            },
            {
              method: 'PATCH',
              path: '/api/v1/customer/:id/update',
              description: 'Actualizar cliente',
            },
            {
              method: 'DELETE',
              path: '/api/v1/customer/:id/delete',
              description: 'Eliminar cliente',
            },
            {
              method: 'GET',
              path: '/api/v1/customer/search/name/:name',
              description: 'Buscar por nombre',
            },
            {
              method: 'GET',
              path: '/api/v1/customer/search/dni/:dni',
              description: 'Buscar por DNI',
            },
            {
              method: 'GET',
              path: '/api/v1/customer/search/email/:email',
              description: 'Buscar por email',
            },
            {
              method: 'GET',
              path: '/api/v1/customer/search/phone/:phone',
              description: 'Buscar por teléfono',
            },
            {
              method: 'GET',
              path: '/api/v1/customer/filter/active',
              description: 'Filtrar activos',
            },
            {
              method: 'GET',
              path: '/api/v1/customer/paginated/list',
              description: 'Obtener con paginación',
            },
            {
              method: 'GET',
              path: '/api/v1/customer/exists/dni/:dni',
              description: 'Verificar por DNI',
            },
            {
              method: 'GET',
              path: '/api/v1/customer/exists/email/:email',
              description: 'Verificar por email',
            },
            {
              method: 'GET',
              path: '/api/v1/customer/:id/with-invoices',
              description: 'Obtener con facturas',
            },
            {
              method: 'GET',
              path: '/api/v1/customer/:id/invoice-count',
              description: 'Contar facturas',
            },
            {
              method: 'GET',
              path: '/api/v1/customer/count/total',
              description: 'Contar total',
            },
          ],
        },
        {
          name: 'Invoice',
          description: 'Gestión de facturas y documentos',
          icon: '📄',
          endpoints: [
            {
              method: 'POST',
              path: '/api/v1/invoice/create',
              description: 'Crear nueva factura',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice',
              description: 'Obtener todas las facturas',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/:id',
              description: 'Obtener factura por ID',
            },
            {
              method: 'PATCH',
              path: '/api/v1/invoice/:id/update',
              description: 'Actualizar factura',
            },
            {
              method: 'DELETE',
              path: '/api/v1/invoice/:id/delete',
              description: 'Eliminar factura',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/number/:number',
              description: 'Buscar por número',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/company/:companyId',
              description: 'Buscar por empresa',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/customer/:customerId',
              description: 'Buscar por cliente',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/status/:status',
              description: 'Buscar por estado',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/date-range/search',
              description: 'Buscar por rango de fechas',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/min-amount/:minAmount',
              description: 'Buscar por monto mínimo',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/paginated/list',
              description: 'Obtener con paginación',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/exists/number/:number',
              description: 'Verificar por número',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/:id/with-details',
              description: 'Obtener con detalles',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/:id/with-payments',
              description: 'Obtener con pagos',
            },
            {
              method: 'PATCH',
              path: '/api/v1/invoice/:id/status',
              description: 'Cambiar estado',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/count/total',
              description: 'Contar total',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/stats/by-status',
              description: 'Estadísticas por estado',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/stats/total-billed',
              description: 'Total facturado',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/stats/average-amount',
              description: 'Promedio de facturas',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/stats/largest-invoices',
              description: 'Facturas más grandes',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/stats/by-period',
              description: 'Estadísticas por período',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/stats/by-company',
              description: 'Estadísticas por empresa',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/stats/by-customer',
              description: 'Estadísticas por cliente',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/stats/pending-collection',
              description: 'Pendientes de cobro',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/stats/overdue',
              description: 'Facturas vencidas',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/stats/payment-status',
              description: 'Estado de pagos',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice/stats/general',
              description: 'Estadísticas generales',
            },
          ],
        },
        {
          name: 'Invoice Detail',
          description: 'Gestión de detalles de facturas (líneas de producto)',
          icon: '📋',
          endpoints: [
            {
              method: 'POST',
              path: '/api/v1/invoice-detail/create',
              description: 'Crear nuevo detalle',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail',
              description: 'Obtener todos los detalles',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/:id',
              description: 'Obtener detalle por ID',
            },
            {
              method: 'PATCH',
              path: '/api/v1/invoice-detail/:id/update',
              description: 'Actualizar detalle',
            },
            {
              method: 'DELETE',
              path: '/api/v1/invoice-detail/:id/delete',
              description: 'Eliminar detalle',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/invoice/:invoiceId',
              description: 'Obtener por factura',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/description/:description',
              description: 'Buscar por descripción',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/min-quantity/:minQuantity',
              description: 'Buscar por cantidad mínima',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/min-price/:minPrice',
              description: 'Buscar por precio mínimo',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/paginated/list',
              description: 'Obtener con paginación',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/exists/id/:id',
              description: 'Verificar existencia',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/calculate/subtotal/:id',
              description: 'Calcular subtotal',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/calculate/invoice-total/:invoiceId',
              description: 'Calcular total factura',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/count/total',
              description: 'Contar total',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/count/by-invoice/:invoiceId',
              description: 'Contar por factura',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/stats/total-sold',
              description: 'Total vendido',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/stats/average-price',
              description: 'Precio promedio',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/stats/average-quantity',
              description: 'Cantidad promedio',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/stats/most-expensive',
              description: 'Productos más caros',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/stats/most-sold',
              description: 'Productos más vendidos',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/stats/by-invoice/:invoiceId',
              description: 'Estadísticas por factura',
            },
            {
              method: 'GET',
              path: '/api/v1/invoice-detail/stats/general',
              description: 'Estadísticas generales',
            },
          ],
        },
        {
          name: 'Payment',
          description: 'Gestión de pagos y cobros',
          icon: '💰',
          endpoints: [
            {
              method: 'POST',
              path: '/api/v1/payment/create',
              description: 'Crear nuevo pago',
            },
            {
              method: 'GET',
              path: '/api/v1/payment',
              description: 'Obtener todos los pagos',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/:id',
              description: 'Obtener pago por ID',
            },
            {
              method: 'PATCH',
              path: '/api/v1/payment/:id/update',
              description: 'Actualizar pago',
            },
            {
              method: 'DELETE',
              path: '/api/v1/payment/:id/delete',
              description: 'Eliminar pago',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/invoice/:invoiceId',
              description: 'Obtener por factura',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/method/:method',
              description: 'Buscar por método',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/date-range/search',
              description: 'Buscar por rango de fechas',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/min-amount/:minAmount',
              description: 'Buscar por monto mínimo',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/paginated/list',
              description: 'Obtener con paginación',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/exists/id/:id',
              description: 'Verificar existencia',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/calculate/total-paid/:invoiceId',
              description: 'Calcular total pagado',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/calculate/balance/:invoiceId',
              description: 'Calcular saldo pendiente',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/check/fully-paid/:invoiceId',
              description: 'Verificar pago completo',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/count/total',
              description: 'Contar total',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/stats/total-collected',
              description: 'Total recaudado',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/stats/collected-by-method',
              description: 'Recaudado por método',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/stats/average-payment',
              description: 'Promedio de pagos',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/stats/largest-payments',
              description: 'Pagos más grandes',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/stats/by-period',
              description: 'Estadísticas por período',
            },
            {
              method: 'GET',
              path: '/api/v1/payment/stats/general',
              description: 'Estadísticas generales',
            },
          ],
        },
      ],
      technologies: [
        {
          name: 'NestJS',
          version: '10.x',
          description: 'Framework Node.js progresivo',
        },
        {
          name: 'TypeORM',
          version: '0.3.x',
          description: 'ORM para TypeScript y JavaScript',
        },
        {
          name: 'PostgreSQL',
          version: '16.x',
          description: 'Base de datos relacional',
        },
        {
          name: 'TypeScript',
          version: '5.x',
          description: 'Superset tipado de JavaScript',
        },
      ],
      features: [
        'API REST completa con arquitectura modular',
        'Autenticación y autorización JWT (próximamente)',
        'Documentación Swagger/OpenAPI interactiva',
        'Validación de datos con class-validator',
        'Relaciones complejas entre entidades',
        'Estadísticas y reportes avanzados',
        'Paginación y filtros en todas las consultas',
        'Logging con Morgan',
        'CORS habilitado',
        'Variables de entorno con dotenv',
      ],
    };
  }
}
