# 📚 API-Factus - Documentación de Endpoints

> Sistema de facturación completo construido con NestJS y PostgreSQL

**Versión:** 1.0.0  
**Base URL:** `http://localhost:4500/api/v1`  
**Documentación Swagger:** `http://localhost:4500/api/v1/docs`

---

## 📋 Tabla de Contenidos

- [Información General](#información-general)
- [Company (Empresas)](#-company-empresas)
- [Customer (Clientes)](#-customer-clientes)
- [Invoice (Facturas)](#-invoice-facturas)
- [Invoice Detail (Detalles de Factura)](#-invoice-detail-detalles-de-factura)
- [Payment (Pagos)](#-payment-pagos)
- [User (Usuarios)](#-user-usuarios)
- [Códigos de Estado HTTP](#códigos-de-estado-http)

---

## 📖 Información General

### Servidor y Endpoints Principales

| Endpoint | Descripción |
|----------|-------------|
| `http://localhost:4500` | Servidor principal |
| `http://localhost:4500/home` | Página de inicio con documentación |
| `http://localhost:4500/api/v1` | Base de la API REST |
| `http://localhost:4500/api/v1/docs` | Documentación Swagger interactiva |

### Tecnologías

- **Framework:** NestJS 11.x
- **Base de Datos:** PostgreSQL 16.x
- **ORM:** TypeORM 0.3.x
- **Lenguaje:** TypeScript 5.x
- **Validación:** class-validator, class-transformer
- **Documentación:** Swagger/OpenAPI

---

## 🏢 Company (Empresas)

**Base Path:** `/api/v1/company`

### CRUD Básico

#### Crear Empresa
```http
POST /api/v1/company/create
```

**Request Body:**
```json
{
  "businessName": "Tech Solutions S.A.C.",
  "taxId": "20123456789",
  "email": "contacto@techsolutions.com",
  "address": "Av. Javier Prado 123, San Isidro, Lima"
}
```

**Respuestas:**
- `201 Created` - Empresa creada exitosamente
- `409 Conflict` - El taxId ya existe
- `400 Bad Request` - Datos inválidos

---

#### Obtener Todas las Empresas
```http
GET /api/v1/company
```

**Respuesta:**
- `200 OK` - Lista de empresas

---

#### Obtener Empresa por ID
```http
GET /api/v1/company/:id
```

**Parámetros:**
- `id` (UUID) - Identificador único de la empresa

**Respuestas:**
- `200 OK` - Empresa encontrada
- `404 Not Found` - Empresa no encontrada

---

#### Actualizar Empresa
```http
PATCH /api/v1/company/:id/update
```

**Request Body:** (todos los campos son opcionales)
```json
{
  "businessName": "Tech Solutions Actualizada",
  "email": "nuevo@email.com",
  "address": "Nueva dirección"
}
```

**Respuestas:**
- `200 OK` - Empresa actualizada
- `404 Not Found` - Empresa no encontrada

---

#### Eliminar Empresa
```http
DELETE /api/v1/company/:id/delete
```

**Respuestas:**
- `204 No Content` - Empresa eliminada exitosamente
- `404 Not Found` - Empresa no encontrada

---

### Búsqueda y Filtrado

#### Buscar por RUC/Tax ID
```http
GET /api/v1/company/tax-id/:taxId
```

**Respuestas:**
- `200 OK` - Empresa encontrada
- `404 Not Found` - Empresa no encontrada

---

#### Buscar por Email
```http
GET /api/v1/company/email/:email
```

---

#### Buscar con Query
```http
GET /api/v1/company/search/query?q=nombre
```

**Query Params:**
- `q` (string) - Término de búsqueda

---

#### Listado Paginado
```http
GET /api/v1/company/paginated/list?page=1&limit=10
```

**Query Params:**
- `page` (number) - Número de página (default: 1)
- `limit` (number) - Elementos por página (default: 10)

**Respuesta:**
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

---

### Validación

#### Verificar Existencia por ID
```http
GET /api/v1/company/exists/id/:id
```

**Respuesta:** `true` o `false`

---

#### Verificar Existencia por Tax ID
```http
GET /api/v1/company/exists/tax-id/:taxId
```

**Respuesta:** `true` o `false`

---

### Relaciones

#### Obtener Empresa con Facturas
```http
GET /api/v1/company/:id/with-invoices
```

---

#### Obtener Solo Facturas de la Empresa
```http
GET /api/v1/company/:id/invoices
```

---

### Estadísticas

#### Estadísticas de la Empresa
```http
GET /api/v1/company/:id/stats
```

**Respuesta:**
```json
{
  "totalInvoices": 50,
  "totalBilled": 125000.00,
  "pendingAmount": 25000.00,
  "paidAmount": 100000.00
}
```

---

#### Contar Total de Empresas
```http
GET /api/v1/company/count/total
```

**Respuesta:** `number`

---

## 👥 Customer (Clientes)

**Base Path:** `/api/v1/customer`

### CRUD Básico

#### Crear Cliente
```http
POST /api/v1/customer/create
```

**Request Body:**
```json
{
  "name": "Juan Carlos Pérez González",
  "taxOrId": "12345678",
  "email": "jcperez@gmail.com"
}
```

**Respuestas:**
- `201 Created` - Cliente creado exitosamente
- `409 Conflict` - Ya existe un cliente con ese número de identificación
- `400 Bad Request` - Datos inválidos

---

#### Obtener Todos los Clientes
```http
GET /api/v1/customer
```

**Respuesta:**
- `200 OK` - Lista de clientes

---

#### Obtener Cliente por ID
```http
GET /api/v1/customer/:id
```

**Respuestas:**
- `200 OK` - Cliente encontrado
- `404 Not Found` - Cliente no encontrado

---

#### Actualizar Cliente
```http
PATCH /api/v1/customer/:id/update
```

**Request Body:** (campos opcionales)
```json
{
  "name": "Juan Carlos Pérez Actualizado",
  "email": "nuevo@email.com"
}
```

---

#### Eliminar Cliente
```http
DELETE /api/v1/customer/:id/delete
```

**Respuestas:**
- `204 No Content` - Cliente eliminado
- `404 Not Found` - Cliente no encontrado

---

### Búsqueda y Filtrado

#### Buscar por DNI/Tax ID
```http
GET /api/v1/customer/tax-id/:taxOrId
```

---

#### Buscar por Email
```http
GET /api/v1/customer/email/:email
```

---

#### Buscar con Query
```http
GET /api/v1/customer/search/query?q=nombre
```

---

#### Listado Paginado
```http
GET /api/v1/customer/paginated/list?page=1&limit=10
```

**Respuesta:**
```json
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 10,
  "totalPages": 15
}
```

---

### Validación

#### Verificar Existencia por ID
```http
GET /api/v1/customer/exists/id/:id
```

---

#### Verificar Existencia por Tax ID
```http
GET /api/v1/customer/exists/tax-id/:taxOrId
```

---

### Relaciones

#### Obtener Cliente con Facturas
```http
GET /api/v1/customer/:id/with-invoices
```

---

#### Obtener Solo Facturas del Cliente
```http
GET /api/v1/customer/:id/invoices
```

---

### Estadísticas

#### Estadísticas del Cliente
```http
GET /api/v1/customer/:id/stats
```

**Respuesta:**
```json
{
  "totalInvoices": 25,
  "totalSpent": 50000.00,
  "pendingAmount": 10000.00,
  "paidAmount": 40000.00
}
```

---

#### Contar Total de Clientes
```http
GET /api/v1/customer/count/total
```

---

#### Top Clientes
```http
GET /api/v1/customer/top/customers?limit=10
```

**Query Params:**
- `limit` (number) - Número de clientes a retornar (default: 10)

---

## 📄 Invoice (Facturas)

**Base Path:** `/api/v1/invoice`

### CRUD Básico

#### Crear Factura
```http
POST /api/v1/invoice/create
```

**Request Body:**
```json
{
  "number": "FAC-2025-0001",
  "totalAmount": 15750.00,
  "status": "PENDING",
  "companyId": "a1b2c3d4-e5f6-7890-abcd-111111111111",
  "customerId": "b1b2c3d4-e5f6-7890-abcd-111111111111"
}
```

**Estados posibles:** `PENDING`, `PAID`, `CANCELLED`

**Respuestas:**
- `201 Created` - Factura creada
- `409 Conflict` - Ya existe una factura con ese número
- `400 Bad Request` - Datos inválidos

---

#### Obtener Todas las Facturas
```http
GET /api/v1/invoice
```

---

#### Obtener Factura por ID
```http
GET /api/v1/invoice/:id
```

**Respuestas:**
- `200 OK` - Factura con detalles y pagos
- `404 Not Found` - Factura no encontrada

---

#### Actualizar Factura
```http
PATCH /api/v1/invoice/:id/update
```

**Request Body:** (campos opcionales)
```json
{
  "totalAmount": 16000.00,
  "status": "PAID"
}
```

---

#### Eliminar Factura
```http
DELETE /api/v1/invoice/:id/delete
```

**Respuestas:**
- `204 No Content` - Factura eliminada
- `404 Not Found` - Factura no encontrada

---

### Búsqueda y Filtrado

#### Buscar por Número de Factura
```http
GET /api/v1/invoice/number/:number
```

**Ejemplo:** `GET /api/v1/invoice/number/FAC-2025-0001`

---

#### Buscar por Estado
```http
GET /api/v1/invoice/status/:status
```

**Valores:** `PENDING`, `PAID`, `CANCELLED`

---

#### Buscar por Empresa
```http
GET /api/v1/invoice/company/:companyId
```

---

#### Buscar por Cliente
```http
GET /api/v1/invoice/customer/:customerId
```

---

#### Buscar por Rango de Fechas
```http
GET /api/v1/invoice/date-range/search?startDate=2025-01-01T00:00:00.000Z&endDate=2025-12-31T23:59:59.999Z
```

**Query Params:**
- `startDate` (ISO 8601) - Fecha inicial
- `endDate` (ISO 8601) - Fecha final

---

#### Buscar por Monto Mínimo
```http
GET /api/v1/invoice/min-amount/:minAmount
```

**Ejemplo:** `GET /api/v1/invoice/min-amount/10000`

---

#### Listado Paginado
```http
GET /api/v1/invoice/paginated/list?page=1&limit=10
```

---

### Validación

#### Verificar Existencia por ID
```http
GET /api/v1/invoice/exists/id/:id
```

---

#### Verificar Existencia por Número
```http
GET /api/v1/invoice/exists/number/:number
```

---

### Operaciones de Estado

#### Cambiar Estado
```http
PATCH /api/v1/invoice/:id/status/:status
```

**Parámetros:**
- `id` (UUID) - ID de la factura
- `status` (enum) - Nuevo estado: `PENDING`, `PAID`, `CANCELLED`

---

#### Marcar como Pagada
```http
PATCH /api/v1/invoice/:id/mark-as-paid
```

---

#### Marcar como Pendiente
```http
PATCH /api/v1/invoice/:id/mark-as-pending
```

---

#### Cancelar Factura
```http
PATCH /api/v1/invoice/:id/cancel
```

---

### Cálculos

#### Total Pagado
```http
GET /api/v1/invoice/:id/total-paid
```

**Respuesta:** `number` - Monto total pagado

---

#### Saldo Pendiente
```http
GET /api/v1/invoice/:id/balance
```

**Respuesta:** `number` - Saldo pendiente de pago

---

### Estadísticas

#### Contar Total de Facturas
```http
GET /api/v1/invoice/count/total
```

---

#### Total Facturado (Revenue)
```http
GET /api/v1/invoice/stats/total-revenue
```

**Respuesta:**
```json
{
  "totalRevenue": 500000.00
}
```

---

#### Revenue por Estado
```http
GET /api/v1/invoice/stats/revenue-by-status
```

**Respuesta:**
```json
{
  "PAID": 400000.00,
  "PENDING": 75000.00,
  "CANCELLED": 25000.00
}
```

---

#### Estadísticas Generales
```http
GET /api/v1/invoice/stats/general
```

**Respuesta:**
```json
{
  "totalInvoices": 250,
  "totalRevenue": 500000.00,
  "averageAmount": 2000.00,
  "byStatus": {
    "PAID": 200,
    "PENDING": 40,
    "CANCELLED": 10
  }
}
```

---

## 📋 Invoice Detail (Detalles de Factura)

**Base Path:** `/api/v1/invoice-detail`

### CRUD Básico

#### Crear Detalle
```http
POST /api/v1/invoice-detail/create
```

**Request Body:**
```json
{
  "description": "Laptop HP EliteBook 840 G8",
  "quantity": 5.00,
  "unitPrice": 2500.00,
  "subtotal": 12500.00,
  "invoiceId": "c1b2c3d4-e5f6-7890-abcd-111111111111"
}
```

**Respuestas:**
- `201 Created` - Detalle creado
- `400 Bad Request` - Datos inválidos

---

#### Obtener Todos los Detalles
```http
GET /api/v1/invoice-detail
```

---

#### Obtener Detalle por ID
```http
GET /api/v1/invoice-detail/:id
```

---

#### Actualizar Detalle
```http
PATCH /api/v1/invoice-detail/:id/update
```

**Request Body:** (campos opcionales)
```json
{
  "quantity": 10.00,
  "unitPrice": 2400.00
}
```

---

#### Eliminar Detalle
```http
DELETE /api/v1/invoice-detail/:id/delete
```

---

### Búsqueda y Filtrado

#### Obtener Detalles por Factura
```http
GET /api/v1/invoice-detail/invoice/:invoiceId
```

---

#### Buscar por Descripción
```http
GET /api/v1/invoice-detail/search/description?q=laptop
```

---

#### Buscar por Rango de Cantidad
```http
GET /api/v1/invoice-detail/quantity-range/search?min=1&max=100
```

**Query Params:**
- `min` (number) - Cantidad mínima
- `max` (number) - Cantidad máxima

---

#### Buscar por Precio Unitario Mínimo
```http
GET /api/v1/invoice-detail/min-unit-price/:minPrice
```

---

#### Buscar por Subtotal Mínimo
```http
GET /api/v1/invoice-detail/min-subtotal/:minSubtotal
```

---

#### Listado Paginado
```http
GET /api/v1/invoice-detail/paginated/list?page=1&limit=10
```

---

### Validación

#### Verificar Existencia por ID
```http
GET /api/v1/invoice-detail/exists/id/:id
```

---

### Cálculos

#### Calcular Total de Factura
```http
GET /api/v1/invoice-detail/calculate/invoice-total/:invoiceId
```

**Respuesta:** `number` - Suma de todos los subtotales

---

#### Recalcular Subtotal
```http
PATCH /api/v1/invoice-detail/:id/recalculate-subtotal
```

**Descripción:** Recalcula automáticamente `subtotal = quantity * unitPrice`

---

### Estadísticas

#### Contar Total de Detalles
```http
GET /api/v1/invoice-detail/count/total
```

---

#### Cantidad Promedio
```http
GET /api/v1/invoice-detail/stats/average-quantity
```

---

#### Precio Unitario Promedio
```http
GET /api/v1/invoice-detail/stats/average-unit-price
```

---

#### Top Productos/Servicios
```http
GET /api/v1/invoice-detail/stats/top-products?limit=10
```

---

#### Estadísticas Generales
```http
GET /api/v1/invoice-detail/stats/general
```

---

## 💳 Payment (Pagos)

**Base Path:** `/api/v1/payment`

### CRUD Básico

#### Crear Pago
```http
POST /api/v1/payment/create
```

**Request Body:**
```json
{
  "method": "BANK_TRANSFER",
  "amount": 10000.00,
  "invoiceId": "c1b2c3d4-e5f6-7890-abcd-111111111111"
}
```

**Métodos de pago:** `CASH`, `CREDIT_CARD`, `DEBIT_CARD`, `BANK_TRANSFER`, `CHECK`, `OTHER`

**Respuestas:**
- `201 Created` - Pago registrado
- `400 Bad Request` - Datos inválidos

---

#### Obtener Todos los Pagos
```http
GET /api/v1/payment
```

---

#### Obtener Pago por ID
```http
GET /api/v1/payment/:id
```

---

#### Actualizar Pago
```http
PATCH /api/v1/payment/:id/update
```

---

#### Eliminar Pago
```http
DELETE /api/v1/payment/:id/delete
```

---

### Búsqueda y Filtrado

#### Obtener Pagos por Factura
```http
GET /api/v1/payment/invoice/:invoiceId
```

---

#### Buscar por Método de Pago
```http
GET /api/v1/payment/method/:method
```

**Valores:** `CASH`, `CREDIT_CARD`, `DEBIT_CARD`, `BANK_TRANSFER`, `CHECK`, `OTHER`

---

#### Buscar por Rango de Fechas
```http
GET /api/v1/payment/date-range/search?startDate=2025-01-01T00:00:00.000Z&endDate=2025-12-31T23:59:59.999Z
```

---

#### Buscar por Monto Mínimo
```http
GET /api/v1/payment/min-amount/:minAmount
```

---

#### Listado Paginado
```http
GET /api/v1/payment/paginated/list?page=1&limit=10
```

---

### Validación

#### Verificar Existencia por ID
```http
GET /api/v1/payment/exists/id/:id
```

---

### Cálculos

#### Total Pagado por Factura
```http
GET /api/v1/payment/calculate/total-paid/:invoiceId
```

---

#### Saldo Pendiente por Factura
```http
GET /api/v1/payment/calculate/balance/:invoiceId
```

---

#### Verificar si Factura está Completamente Pagada
```http
GET /api/v1/payment/check/fully-paid/:invoiceId
```

**Respuesta:** `boolean`

---

### Estadísticas

#### Contar Total de Pagos
```http
GET /api/v1/payment/count/total
```

---

#### Total Recaudado
```http
GET /api/v1/payment/stats/total-collected
```

**Respuesta:**
```json
{
  "totalCollected": 450000.00
}
```

---

#### Total Recaudado por Método
```http
GET /api/v1/payment/stats/collected-by-method
```

**Respuesta:**
```json
{
  "BANK_TRANSFER": 200000.00,
  "CREDIT_CARD": 150000.00,
  "CASH": 75000.00,
  "CHECK": 25000.00
}
```

---

#### Promedio de Pagos
```http
GET /api/v1/payment/stats/average-payment
```

---

#### Pagos Más Grandes
```http
GET /api/v1/payment/stats/largest-payments?limit=10
```

---

#### Estadísticas por Período
```http
GET /api/v1/payment/stats/by-period?startDate=2025-01-01T00:00:00.000Z&endDate=2025-12-31T23:59:59.999Z
```

---

#### Estadísticas Generales
```http
GET /api/v1/payment/stats/general
```

---

## 👤 User (Usuarios)

**Base Path:** `/api/v1/user`

### Autenticación

#### Registrar Usuario
```http
POST /api/v1/user/register
```

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "password123",
  "role": "COMPANY"
}
```

**Roles:** `COMPANY`, `CUSTOMER`

**Respuestas:**
- `201 Created` - Usuario registrado
- `409 Conflict` - El email ya existe
- `400 Bad Request` - Datos inválidos

---

#### Iniciar Sesión
```http
POST /api/v1/user/auth/login
```

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuestas:**
- `200 OK` - Login exitoso
- `400 Bad Request` - Credenciales inválidas o usuario desactivado

---

### CRUD Básico

#### Obtener Todos los Usuarios
```http
GET /api/v1/user
```

---

#### Obtener Usuarios Paginados
```http
GET /api/v1/user/paginated?page=1&limit=10
```

---

#### Obtener Usuario por ID
```http
GET /api/v1/user/:id
```

---

#### Actualizar Usuario
```http
PATCH /api/v1/user/:id
```

**Request Body:** (campos opcionales)
```json
{
  "email": "nuevo@email.com",
  "isActive": true
}
```

---

#### Desactivar Usuario (Soft Delete)
```http
DELETE /api/v1/user/:id
```

**Nota:** No elimina físicamente el usuario, solo lo marca como inactivo

---

### Filtros

#### Obtener Usuarios Activos
```http
GET /api/v1/user/active
```

---

#### Obtener Usuarios por Rol
```http
GET /api/v1/user/role/:role
```

**Valores:** `COMPANY`, `CUSTOMER`

---

#### Obtener Usuarios con Company
```http
GET /api/v1/user/with-company
```

---

#### Obtener Usuarios con Customer
```http
GET /api/v1/user/with-customer
```

---

#### Obtener Últimos Usuarios Registrados
```http
GET /api/v1/user/latest?limit=10
```

---

### Validación

#### Verificar si Email Existe
```http
GET /api/v1/user/email/:email/exists
```

**Respuesta:** `boolean`

---

#### Verificar si Usuario está Activo
```http
GET /api/v1/user/:id/is-active
```

**Respuesta:** `boolean`

---

### Estadísticas

#### Contar Total de Usuarios
```http
GET /api/v1/user/stats/total
```

---

#### Contar Usuarios Activos
```http
GET /api/v1/user/stats/active
```

---

#### Contar Usuarios por Rol
```http
GET /api/v1/user/stats/role/:role
```

---

#### Estadísticas Generales
```http
GET /api/v1/user/stats/general
```

**Respuesta:**
```json
{
  "total": 150,
  "active": 140,
  "inactive": 10,
  "byRole": {
    "COMPANY": 50,
    "CUSTOMER": 100
  }
}
```

---

## 📊 Códigos de Estado HTTP

### Respuestas Exitosas

| Código | Significado | Uso |
|--------|-------------|-----|
| `200 OK` | Solicitud exitosa | GET, PATCH exitosos |
| `201 Created` | Recurso creado | POST exitoso |
| `204 No Content` | Exitoso sin contenido | DELETE exitoso |

### Errores del Cliente

| Código | Significado | Uso |
|--------|-------------|-----|
| `400 Bad Request` | Datos inválidos | Validación fallida |
| `401 Unauthorized` | No autenticado | Token inválido/faltante |
| `403 Forbidden` | No autorizado | Sin permisos |
| `404 Not Found` | Recurso no encontrado | ID inválido |
| `409 Conflict` | Conflicto | Duplicado (email, taxId, etc.) |

### Errores del Servidor

| Código | Significado | Uso |
|--------|-------------|-----|
| `500 Internal Server Error` | Error del servidor | Error no manejado |

---

## 🔐 Autenticación

Actualmente la API no requiere autenticación JWT, pero está preparada para implementarla. 

**Para implementar autenticación:**
1. Obtener token con `POST /api/v1/user/auth/login`
2. Incluir en headers: `Authorization: Bearer <token>`

---

## 📝 Notas Adicionales

### Formato de Fechas
Todas las fechas siguen el formato **ISO 8601**:
```
2025-01-15T10:30:00.000Z
```

### UUIDs
Todos los IDs utilizan formato **UUID v4**:
```
550e8400-e29b-41d4-a716-446655440000
```

### Paginación
La paginación sigue este formato:
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

### Validaciones
- **Email:** Formato válido de email
- **Tax ID:** Alfanumérico, longitud 8-50
- **Amounts:** Números decimales positivos (precision: 10, scale: 2)
- **Status:** Solo valores del enum permitidos

---

## 🚀 Ejemplos de Uso

### Crear una Factura Completa

```bash
# 1. Crear la factura
curl -X POST http://localhost:4500/api/v1/invoice/create \
  -H "Content-Type: application/json" \
  -d '{
    "number": "FAC-2025-0100",
    "totalAmount": 5000.00,
    "status": "PENDING",
    "companyId": "...",
    "customerId": "..."
  }'

# 2. Agregar detalles
curl -X POST http://localhost:4500/api/v1/invoice-detail/create \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Servicio de consultoría",
    "quantity": 10,
    "unitPrice": 500,
    "subtotal": 5000,
    "invoiceId": "..."
  }'

# 3. Registrar pago
curl -X POST http://localhost:4500/api/v1/payment/create \
  -H "Content-Type: application/json" \
  -d '{
    "method": "BANK_TRANSFER",
    "amount": 5000.00,
    "invoiceId": "..."
  }'
```

---

## 📞 Soporte

- **Repositorio:** [https://github.com/dev-galarza987/API-Factus-Nestjs](https://github.com/dev-galarza987/API-Factus-Nestjs)
- **Documentación Interactiva:** http://localhost:4500/api/v1/docs
- **Página de Inicio:** http://localhost:4500/home

---

**Última actualización:** 4 de Noviembre, 2025  
**Versión del documento:** 1.0.0
