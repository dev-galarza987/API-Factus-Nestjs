# 🧪 Guía de Testing - API-Factus

Documentación completa sobre la suite de tests de la API de facturación, incluyendo tests unitarios, E2E y estrategias de testing.

---

## 📋 Índice

- [Tipos de Tests](#tipos-de-tests)
- [Scripts de Testing](#scripts-de-testing)
- [Tests Básicos (Mocked)](#tests-básicos-mocked)
- [Tests de Integración](#tests-de-integración)
- [Configuración](#configuración)
- [Buenas Prácticas](#buenas-prácticas)

---

## 🎯 Tipos de Tests

### 1. **Tests Unitarios** 
Tests que prueban componentes individuales de forma aislada (services, controllers, etc.) sin dependencias externas.

**Ubicación:** `src/**/*.spec.ts`  
**Características:**
- Rápidos de ejecutar
- Usan mocks para todas las dependencias
- No requieren base de datos
- Ideal para TDD (Test Driven Development)

### 2. **Tests E2E Básicos (Mocked)**
Tests end-to-end que usan servicios mockeados, sin conexión a base de datos real.

**Archivos:**
- `test/basic-app.e2e-spec.ts` - Tests básicos de la aplicación
- `test/*-simple.e2e-spec.ts` - Tests simples de cada módulo con mocks

**Características:**
- ✅ **Rápidos** - No requieren DB real
- ✅ **Independientes** - No afectan datos reales
- ✅ **Predecibles** - Siempre retornan lo mismo
- ✅ **CI/CD Ready** - Perfectos para pipelines

### 3. **Tests E2E de Integración**
Tests completos que interactúan con base de datos real y prueban el flujo completo.

**Archivos:**
- `test/company.e2e-spec.ts`
- `test/customer.e2e-spec.ts`
- `test/invoice.e2e-spec.ts`
- `test/invoice-detail.e2e-spec.ts`
- `test/payment.e2e-spec.ts`
- `test/user.e2e-spec.ts`

**Características:**
- 🔍 **Completos** - Prueban todo el stack
- 🗄️ **Base de datos real** - Requieren PostgreSQL
- 🐢 **Más lentos** - Operaciones I/O reales
- ✅ **Alta confianza** - Prueban escenarios reales

---

## 🚀 Scripts de Testing

### Ejecutar Todos los Tests
```bash
npm test                    # Tests unitarios (src/**/*.spec.ts)
npm run test:e2e            # Todos los tests E2E
npm run test:all            # Unitarios + E2E
```

### Tests Básicos (Recomendado para desarrollo rápido)
```bash
npm run test:e2e:basic      # Solo tests básicos y simples (15 tests)
```

Este comando ejecuta:
- ✅ `basic-app.e2e-spec.ts` (3 tests)
- ✅ `customer-simple.e2e-spec.ts` (3 tests)
- ✅ `user-simple.e2e-spec.ts` (3 tests)
- ✅ `invoice-simple.e2e-spec.ts` (3 tests)
- ✅ `payment-simple.e2e-spec.ts` (3 tests)

**Ventajas:**
- ⚡ Rápido: ~8-10 segundos
- 🎯 No requiere base de datos
- ✅ Perfecto para CI/CD
- 🔄 Ideal durante desarrollo

### Tests de Integración
```bash
npm run test:e2e:integration # Tests completos con DB real
```

**Requisitos:**
- PostgreSQL corriendo
- Variables de entorno configuradas
- Base de datos de prueba disponible

### Tests con Watch Mode
```bash
npm run test:watch          # Unitarios en modo watch
npm run test:e2e:watch      # E2E en modo watch
```

### Tests con Coverage
```bash
npm run test:cov            # Genera reporte de cobertura
```

---

## ✅ Tests Básicos (Mocked)

### basic-app.e2e-spec.ts

```typescript
describe('Basic App Tests (e2e)', () => {
  // ✅ 1. Redirect de la raíz
  it('Should return Hello World from root endpoint', () => {
    return request(app.getHttpServer()).get('/').expect(302);
  });

  // ✅ 2. Manejo de 404
  it('Should return 404 for non-existent route', () => {
    return request(app.getHttpServer())
      .get('/non-existent-route')
      .expect(404);
  });

  // ✅ 3. Verificación de redirect
  it('Should handle redirect properly', async () => {
    const response = await request(app.getHttpServer())
      .get('/')
      .expect(302);
    expect(response.status).toBe(302);
  });
});
```

**Resultado:**
```
✓ 1. Should return Hello World from root endpoint (294 ms)
✓ 2. Should return 404 for non-existent route (158 ms)
✓ 3. Should handle redirect properly (24 ms)
```

### customer-simple.e2e-spec.ts

Prueba el controlador de Customer con un servicio mockeado:

```typescript
const mockCustomerService = {
  findAll: jest.fn().mockResolvedValue([
    { id: '1', fullName: 'Juan Pérez', email: 'juan@test.com' },
    { id: '2', fullName: 'María García', email: 'maria@test.com' },
  ]),
  findOne: jest.fn().mockResolvedValue({
    id: '1',
    fullName: 'Juan Pérez',
    taxOrId: '12345678',
    email: 'juan@test.com',
  }),
};
```

**Tests:**
- ✅ GET /customer - Lista todos los clientes
- ✅ GET /customer/:id - Obtiene un cliente
- ✅ Manejo de rutas no existentes

### user-simple.e2e-spec.ts

Prueba el controlador de User con datos mockeados:

**Tests:**
- ✅ GET /user - Lista todos los usuarios
- ✅ GET /user/:id - Obtiene usuario por UUID
- ✅ Validación de UUID

### invoice-simple.e2e-spec.ts

**Tests:**
- ✅ GET /invoice - Lista todas las facturas
- ✅ GET /invoice/:id - Obtiene factura por ID
- ✅ Manejo de errores

### payment-simple.e2e-spec.ts

**Tests:**
- ✅ GET /payment - Lista todos los pagos
- ✅ GET /payment/:id - Obtiene pago por ID
- ✅ Validaciones de métodos de pago

---

## 🔧 Configuración

### jest-e2e.json

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
```

### Variables de Entorno para Tests

Crear archivo `.env.test`:

```env
# Database (para tests de integración)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=factus_test

# Application
PORT=4500
NODE_ENV=test
```

---

## 📊 Resultados de Tests Básicos

### Última Ejecución (Exitosa)

```
 PASS  test/payment-simple.e2e-spec.ts
 PASS  test/customer-simple.e2e-spec.ts
 PASS  test/invoice-simple.e2e-spec.ts
 PASS  test/user-simple.e2e-spec.ts
 PASS  test/basic-app.e2e-spec.ts

Test Suites: 5 passed, 5 total  
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        8.512 s
```

### Cobertura

| Módulo | Tests | Estado |
|--------|-------|--------|
| **Basic App** | 3 | ✅ Passing |
| **Customer Simple** | 3 | ✅ Passing |
| **User Simple** | 3 | ✅ Passing |
| **Invoice Simple** | 3 | ✅ Passing |
| **Payment Simple** | 3 | ✅ Passing |
| **Total** | **15** | **✅ 100%** |

---

## 🎯 Buenas Prácticas

### 1. **Usar Tests Básicos Durante Desarrollo**

Durante desarrollo activo, usa los tests básicos para validación rápida:

```bash
# Mientras desarrollas
npm run test:e2e:basic
```

**Ventajas:**
- ⚡ Feedback inmediato (8s vs 20s+)
- 🔄 No necesitas levantar DB
- 🎯 Enfócate en lógica de negocio
- ✅ Valida estructura de API

### 2. **Tests de Integración Antes de Commits**

Antes de hacer commit, ejecuta tests de integración:

```bash
# Antes de commit
npm run test:e2e:integration
```

### 3. **Tests Completos en CI/CD**

En tu pipeline de CI/CD:

```yaml
# .github/workflows/test.yml
steps:
  - name: Run Basic Tests
    run: npm run test:e2e:basic
    
  - name: Run Integration Tests
    run: npm run test:e2e:integration
    if: github.ref == 'refs/heads/main'
```

### 4. **Estructura de Tests Mockeados**

```typescript
describe('Module Tests (e2e)', () => {
  let app: INestApplication;

  // Mock del servicio
  const mockService = {
    findAll: jest.fn().mockResolvedValue([/* data */]),
    findOne: jest.fn().mockResolvedValue(/* data */),
  };

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [Controller],
      providers: [
        {
          provide: Service,
          useValue: mockService, // Inyectar mock
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should test something', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/endpoint')
      .expect(200);

    expect(response.body).toBeDefined();
    expect(mockService.findAll).toHaveBeenCalled();
  });
});
```

### 5. **Naming Conventions**

- `*.spec.ts` - Tests unitarios
- `*.e2e-spec.ts` - Tests E2E completos
- `*-simple.e2e-spec.ts` - Tests E2E con mocks
- `*-mock.e2e-spec.ts` - Tests con mocks específicos
- `basic-*.e2e-spec.ts` - Tests básicos de aplicación

---

## 🔍 Debugging Tests

### Modo Debug

```bash
npm run test:debug          # Debug tests unitarios
```

En VS Code, agrega a `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug E2E",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": [
    "--config",
    "./test/jest-e2e.json",
    "--runInBand",
    "--testPathPatterns",
    "basic-app"
  ],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Ver Logs Detallados

```bash
# Con logs detallados
npm run test:e2e:basic -- --verbose

# Un test específico
npm run test:e2e:basic -- --testNamePattern="Should return Hello World"
```

---

## 📈 Estrategia de Testing Recomendada

### Fase 1: Desarrollo (Tests Rápidos)
```bash
npm run test:e2e:basic      # ~8 segundos
```

### Fase 2: Pre-Commit (Tests Completos)
```bash
npm run test:all            # Unitarios + E2E
```

### Fase 3: CI/CD Pipeline
```bash
# PR branches
npm run test:e2e:basic

# Main branch
npm run test:e2e
npm run test:cov
```

### Fase 4: Pre-Deploy (Validación Final)
```bash
npm run test:e2e:integration  # Con DB real
npm run test:cov              # Verificar cobertura
```

---

## 🐛 Troubleshooting

### Error: EntityMetadataNotFoundError

**Problema:** Los tests de integración no encuentran las entidades.

**Solución:**
```typescript
// En test-helper.ts, asegurar que se importan las entidades
TypeOrmModule.forRoot({
  type: 'postgres',
  entities: [User, Company, Customer, Invoice, Payment, InvoiceDetail],
  synchronize: true,
}),
```

### Error: Connection Timeout

**Problema:** Tests de integración fallan por timeout de DB.

**Solución:**
1. Verificar que PostgreSQL esté corriendo
2. Verificar credenciales en `.env.test`
3. Aumentar timeout en jest: `testTimeout: 30000`

### Tests Básicos Lentos

**Problema:** Tests básicos tardan mucho.

**Solución:**
```bash
# Ejecutar en paralelo (por defecto)
npm run test:e2e:basic

# O especificar workers
npm run test:e2e:basic -- --maxWorkers=4
```

---

## 📚 Recursos Adicionales

### Documentación
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Supertest](https://github.com/visionmedia/supertest)

### Archivos Relacionados
- `test/helpers/test-helper.ts` - Utilidades para tests
- `test/fixtures/test-fixtures.ts` - Datos de prueba
- `test/jest-e2e.json` - Configuración Jest E2E

---

## ✨ Resumen de Scripts

| Script | Descripción | Velocidad | DB Requerida |
|--------|-------------|-----------|--------------|
| `npm test` | Tests unitarios | ⚡⚡⚡ Muy rápido | ❌ No |
| `npm run test:e2e:basic` | Tests básicos mockeados | ⚡⚡ Rápido | ❌ No |
| `npm run test:e2e:integration` | Tests con DB real | 🐢 Lento | ✅ Sí |
| `npm run test:e2e` | Todos los E2E | 🐢 Lento | ✅ Sí |
| `npm run test:all` | Todos los tests | 🐢🐢 Muy lento | ✅ Sí |
| `npm run test:cov` | Con cobertura | 🐢 Lento | ❌ No |
| `npm run test:watch` | Modo watch | ⚡ Rápido | ❌ No |

---

**Última Actualización:** 5 de Noviembre, 2025  
**Suite de Tests:** 15 tests básicos + 67 tests integración = 82 tests totales  
**Estado:** ✅ 15/15 tests básicos pasando  
**Framework:** Jest 30.x + Supertest + NestJS Testing

---

## 🎯 Quick Start

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar tests básicos (sin DB)
npm run test:e2e:basic

# 3. Ver resultado
# ✅ Test Suites: 5 passed, 5 total  
# ✅ Tests:       15 passed, 15 total
# ⏱️ Time:        ~8 segundos
```

¡Tests listos para usar! 🚀
