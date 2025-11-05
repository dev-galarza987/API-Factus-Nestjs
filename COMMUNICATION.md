# 📡 Diagramas de Comunicación - API-Factus

Este documento contiene los diagramas de comunicación que muestran la interacción y el flujo de mensajes entre los objetos del sistema de facturación API-Factus.

---

## 📝 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Autenticación](#autenticación)
3. [Gestión de Empresas](#gestión-de-empresas)
4. [Gestión de Clientes](#gestión-de-clientes)
5. [Gestión de Facturas](#gestión-de-facturas)
6. [Gestión de Pagos](#gestión-de-pagos)
7. [Flujos Complejos](#flujos-complejos)

---

## 📖 Introducción

Los diagramas de comunicación (anteriormente conocidos como diagramas de colaboración) muestran las interacciones entre objetos o partes en términos de mensajes secuenciados. Se enfocan en la organización estructural de los objetos que envían y reciben mensajes.

**Notación:**
- Los números indican el orden de los mensajes (1, 2, 3, etc.)
- Los números anidados indican submensajes (1.1, 1.2, 2.1, etc.)
- Las flechas muestran la dirección del mensaje
- Los objetos se representan como nodos

---

## 🔐 Autenticación

### Registro de Usuario

```mermaid
graph LR
    Client["📱 Cliente HTTP"]
    Controller["🎮 UserController"]
    Validator["✅ Validator"]
    Service["⚙️ UserService"]
    BCrypt["🔐 BCrypt"]
    Repo["📦 UserRepository"]
    DB[("💾 PostgreSQL")]

    Client -->|"1: POST /register"| Controller
    Controller -->|"2: validate(dto)"| Validator
    Validator -->|"3: dto válido"| Controller
    Controller -->|"4: register(dto)"| Service
    Service -->|"5: findByEmail()"| Repo
    Repo -->|"6: SELECT user"| DB
    DB -->|"7: null"| Repo
    Repo -->|"8: user not exists"| Service
    Service -->|"9: hash(password)"| BCrypt
    BCrypt -->|"10: hashedPassword"| Service
    Service -->|"11: save(user)"| Repo
    Repo -->|"12: INSERT user"| DB
    DB -->|"13: user created"| Repo
    Repo -->|"14: user entity"| Service
    Service -->|"15: user entity"| Controller
    Controller -->|"16: 201 Created"| Client

    style Client fill:#e1f5ff
    style Controller fill:#fff4e6
    style Service fill:#e8f5e9
    style Repo fill:#f3e5f5
    style DB fill:#ffebee
```

---

### Inicio de Sesión

```mermaid
graph LR
    Client["📱 Cliente"]
    Controller["🎮 UserController"]
    Service["⚙️ UserService"]
    Repo["📦 UserRepository"]
    BCrypt["🔐 BCrypt"]
    DB[("💾 Database")]

    Client -->|"1: POST /login"| Controller
    Controller -->|"2: login(email, pwd)"| Service
    Service -->|"3: findByEmail()"| Repo
    Repo -->|"4: SELECT user"| DB
    DB -->|"5: user data"| Repo
    Repo -->|"6: user entity"| Service
    Service -->|"7: compare(pwd, hash)"| BCrypt
    BCrypt -->|"8: true"| Service
    Service -->|"9: user + token"| Controller
    Controller -->|"10: 200 OK"| Client

    style Client fill:#e1f5ff
    style Controller fill:#fff4e6
    style Service fill:#e8f5e9
    style BCrypt fill:#fce4ec
    style DB fill:#ffebee
```

---

## 🏢 Gestión de Empresas

### Crear Empresa

```mermaid
graph TB
    Client["📱 Cliente"]
    CompCtrl["🎮 CompanyController"]
    CompSvc["⚙️ CompanyService"]
    CompRepo["📦 CompanyRepository"]
    UserRepo["📦 UserRepository"]
    DB[("💾 Database")]

    Client -->|"1: POST /company"| CompCtrl
    CompCtrl -->|"2: create(dto)"| CompSvc
    
    CompSvc -->|"3: findOne(userId)"| UserRepo
    UserRepo -->|"4: SELECT user"| DB
    DB -->|"5: user data"| UserRepo
    UserRepo -->|"6: user exists"| CompSvc
    
    CompSvc -->|"7: findByTaxId()"| CompRepo
    CompRepo -->|"8: SELECT company"| DB
    DB -->|"9: null"| CompRepo
    CompRepo -->|"10: taxId unique"| CompSvc
    
    CompSvc -->|"11: save(company)"| CompRepo
    CompRepo -->|"12: INSERT company"| DB
    DB -->|"13: company created"| CompRepo
    CompRepo -->|"14: company entity"| CompSvc
    CompSvc -->|"15: company entity"| CompCtrl
    CompCtrl -->|"16: 201 Created"| Client

    style Client fill:#e1f5ff
    style CompCtrl fill:#fff4e6
    style CompSvc fill:#e8f5e9
    style CompRepo fill:#f3e5f5
    style UserRepo fill:#f3e5f5
    style DB fill:#ffebee
```

---

### Actualizar Empresa

```mermaid
graph LR
    Client["📱 Cliente"]
    Controller["🎮 CompanyController"]
    Service["⚙️ CompanyService"]
    Repo["📦 CompanyRepository"]
    DB[("💾 Database")]

    Client -->|"1: PATCH /company/:id"| Controller
    Controller -->|"2: update(id, dto)"| Service
    Service -->|"3: findOne(id)"| Repo
    Repo -->|"4: SELECT company"| DB
    DB -->|"5: company data"| Repo
    Repo -->|"6: company entity"| Service
    Service -->|"7.1: update(id, dto)"| Repo
    Repo -->|"7.2: UPDATE company"| DB
    DB -->|"7.3: updated"| Repo
    Service -->|"8: findOne(id)"| Repo
    Repo -->|"9: SELECT company"| DB
    DB -->|"10: updated data"| Repo
    Repo -->|"11: company entity"| Service
    Service -->|"12: company entity"| Controller
    Controller -->|"13: 200 OK"| Client

    style Client fill:#e1f5ff
    style Controller fill:#fff4e6
    style Service fill:#e8f5e9
    style Repo fill:#f3e5f5
    style DB fill:#ffebee
```

---

## 👥 Gestión de Clientes

### Crear Cliente

```mermaid
graph TB
    Client["📱 Cliente"]
    CustCtrl["🎮 CustomerController"]
    CustSvc["⚙️ CustomerService"]
    CustRepo["📦 CustomerRepository"]
    UserRepo["📦 UserRepository"]
    DB[("💾 Database")]

    Client -->|"1: POST /customer"| CustCtrl
    CustCtrl -->|"2: create(dto)"| CustSvc
    
    CustSvc -->|"3: findOne(userId)"| UserRepo
    UserRepo -->|"4: SELECT user"| DB
    DB -->|"5: user exists"| UserRepo
    UserRepo -->|"6: user entity"| CustSvc
    
    CustSvc -->|"7: findByTaxOrId()"| CustRepo
    CustRepo -->|"8: SELECT customer"| DB
    DB -->|"9: null"| CustRepo
    CustRepo -->|"10: unique"| CustSvc
    
    CustSvc -->|"11: save(customer)"| CustRepo
    CustRepo -->|"12: INSERT customer"| DB
    DB -->|"13: created"| CustRepo
    CustRepo -->|"14: customer entity"| CustSvc
    CustSvc -->|"15: customer entity"| CustCtrl
    CustCtrl -->|"16: 201 Created"| Client

    style Client fill:#e1f5ff
    style CustCtrl fill:#fff4e6
    style CustSvc fill:#e8f5e9
    style CustRepo fill:#f3e5f5
    style UserRepo fill:#f3e5f5
    style DB fill:#ffebee
```

---

### Búsqueda de Clientes con Filtros

```mermaid
graph LR
    Client["📱 Cliente"]
    Controller["🎮 CustomerController"]
    Service["⚙️ CustomerService"]
    QB["🔍 QueryBuilder"]
    DB[("💾 Database")]

    Client -->|"1: GET /search?filters"| Controller
    Controller -->|"2: search(filters)"| Service
    Service -->|"3: createQueryBuilder()"| QB
    QB -->|"4: instance"| Service
    Service -->|"5: andWhere(name)"| QB
    Service -->|"6: andWhere(email)"| QB
    Service -->|"7: getMany()"| QB
    QB -->|"8: SELECT with filters"| DB
    DB -->|"9: customer[]"| QB
    QB -->|"10: entities"| Service
    Service -->|"11: customer[]"| Controller
    Controller -->|"12: 200 OK"| Client

    style Client fill:#e1f5ff
    style Controller fill:#fff4e6
    style Service fill:#e8f5e9
    style QB fill:#fff9c4
    style DB fill:#ffebee
```

---

## 📄 Gestión de Facturas

### Crear Factura Completa

```mermaid
graph TB
    Client["📱 Cliente"]
    InvCtrl["🎮 InvoiceController"]
    InvSvc["⚙️ InvoiceService"]
    InvRepo["📦 InvoiceRepository"]
    CompRepo["📦 CompanyRepository"]
    CustRepo["📦 CustomerRepository"]
    DB[("💾 Database")]

    Client -->|"1: POST /invoice"| InvCtrl
    InvCtrl -->|"2: create(dto)"| InvSvc
    
    InvSvc -->|"3.1: findOne(companyId)"| CompRepo
    CompRepo -->|"3.2: SELECT company"| DB
    DB -->|"3.3: company exists"| CompRepo
    CompRepo -->|"3.4: company entity"| InvSvc
    
    InvSvc -->|"4.1: findOne(customerId)"| CustRepo
    CustRepo -->|"4.2: SELECT customer"| DB
    DB -->|"4.3: customer exists"| CustRepo
    CustRepo -->|"4.4: customer entity"| InvSvc
    
    InvSvc -->|"5.1: findByNumber()"| InvRepo
    InvRepo -->|"5.2: SELECT invoice"| DB
    DB -->|"5.3: null"| InvRepo
    InvRepo -->|"5.4: number unique"| InvSvc
    
    InvSvc -->|"6.1: save(invoice)"| InvRepo
    InvRepo -->|"6.2: INSERT invoice"| DB
    DB -->|"6.3: created"| InvRepo
    InvRepo -->|"6.4: invoice entity"| InvSvc
    
    InvSvc -->|"7: invoice entity"| InvCtrl
    InvCtrl -->|"8: 201 Created"| Client

    style Client fill:#e1f5ff
    style InvCtrl fill:#fff4e6
    style InvSvc fill:#e8f5e9
    style InvRepo fill:#f3e5f5
    style CompRepo fill:#f3e5f5
    style CustRepo fill:#f3e5f5
    style DB fill:#ffebee
```

---

### Agregar Detalle a Factura

```mermaid
graph TB
    Client["📱 Cliente"]
    DetCtrl["🎮 InvoiceDetailController"]
    DetSvc["⚙️ InvoiceDetailService"]
    DetRepo["📦 InvoiceDetailRepository"]
    InvRepo["📦 InvoiceRepository"]
    DB[("💾 Database")]

    Client -->|"1: POST /invoice-detail"| DetCtrl
    DetCtrl -->|"2: create(dto)"| DetSvc
    
    DetSvc -->|"3.1: findOne(invoiceId)"| InvRepo
    InvRepo -->|"3.2: SELECT invoice"| DB
    DB -->|"3.3: invoice exists"| InvRepo
    InvRepo -->|"3.4: invoice entity"| DetSvc
    
    DetSvc -->|"4: calcular subtotal"| DetSvc
    
    DetSvc -->|"5.1: save(detail)"| DetRepo
    DetRepo -->|"5.2: INSERT detail"| DB
    DB -->|"5.3: created"| DetRepo
    DetRepo -->|"5.4: detail entity"| DetSvc
    
    DetSvc -->|"6.1: updateTotal(invoiceId)"| InvRepo
    InvRepo -->|"6.2: UPDATE invoice.total"| DB
    DB -->|"6.3: updated"| InvRepo
    InvRepo -->|"6.4: success"| DetSvc
    
    DetSvc -->|"7: detail entity"| DetCtrl
    DetCtrl -->|"8: 201 Created"| Client

    style Client fill:#e1f5ff
    style DetCtrl fill:#fff4e6
    style DetSvc fill:#e8f5e9
    style DetRepo fill:#f3e5f5
    style InvRepo fill:#f3e5f5
    style DB fill:#ffebee
```

---

### Cambiar Estado de Factura

```mermaid
graph LR
    Client["📱 Cliente"]
    Controller["🎮 InvoiceController"]
    Service["⚙️ InvoiceService"]
    InvRepo["📦 InvoiceRepository"]
    PayRepo["📦 PaymentRepository"]
    DB[("💾 Database")]

    Client -->|"1: PATCH /invoice/:id/mark-as-paid"| Controller
    Controller -->|"2: markAsPaid(id)"| Service
    
    Service -->|"3.1: findOne(id)"| InvRepo
    InvRepo -->|"3.2: SELECT invoice"| DB
    DB -->|"3.3: invoice data"| InvRepo
    InvRepo -->|"3.4: invoice entity"| Service
    
    Service -->|"4.1: sumPayments(id)"| PayRepo
    PayRepo -->|"4.2: SUM(amount)"| DB
    DB -->|"4.3: total paid"| PayRepo
    PayRepo -->|"4.4: amount"| Service
    
    Service -->|"5: validar monto"| Service
    
    Service -->|"6.1: update(id, PAID)"| InvRepo
    InvRepo -->|"6.2: UPDATE status"| DB
    DB -->|"6.3: updated"| InvRepo
    InvRepo -->|"6.4: invoice updated"| Service
    
    Service -->|"7: invoice entity"| Controller
    Controller -->|"8: 200 OK"| Client

    style Client fill:#e1f5ff
    style Controller fill:#fff4e6
    style Service fill:#e8f5e9
    style InvRepo fill:#f3e5f5
    style PayRepo fill:#f3e5f5
    style DB fill:#ffebee
```

---

## 💰 Gestión de Pagos

### Registrar Pago

```mermaid
graph TB
    Client["📱 Cliente"]
    PayCtrl["🎮 PaymentController"]
    PaySvc["⚙️ PaymentService"]
    PayRepo["📦 PaymentRepository"]
    InvRepo["📦 InvoiceRepository"]
    DB[("💾 Database")]

    Client -->|"1: POST /payment"| PayCtrl
    PayCtrl -->|"2: create(dto)"| PaySvc
    
    PaySvc -->|"3.1: findOne(invoiceId)"| InvRepo
    InvRepo -->|"3.2: SELECT invoice"| DB
    DB -->|"3.3: invoice data"| InvRepo
    InvRepo -->|"3.4: invoice entity"| PaySvc
    
    PaySvc -->|"4.1: sumPayments(invoiceId)"| PayRepo
    PayRepo -->|"4.2: SUM(amount)"| DB
    DB -->|"4.3: total paid"| PayRepo
    PayRepo -->|"4.4: current total"| PaySvc
    
    PaySvc -->|"5: validar monto"| PaySvc
    
    PaySvc -->|"6.1: save(payment)"| PayRepo
    PayRepo -->|"6.2: INSERT payment"| DB
    DB -->|"6.3: created"| PayRepo
    PayRepo -->|"6.4: payment entity"| PaySvc
    
    PaySvc -->|"7.1: verificar total"| PaySvc
    PaySvc -->|"7.2: update(status)"| InvRepo
    InvRepo -->|"7.3: UPDATE invoice"| DB
    DB -->|"7.4: updated"| InvRepo
    
    PaySvc -->|"8: payment entity"| PayCtrl
    PayCtrl -->|"9: 201 Created"| Client

    style Client fill:#e1f5ff
    style PayCtrl fill:#fff4e6
    style PaySvc fill:#e8f5e9
    style PayRepo fill:#f3e5f5
    style InvRepo fill:#f3e5f5
    style DB fill:#ffebee
```

---

### Consultar Pagos de Factura

```mermaid
graph LR
    Client["📱 Cliente"]
    Controller["🎮 PaymentController"]
    Service["⚙️ PaymentService"]
    Repo["📦 PaymentRepository"]
    DB[("💾 Database")]

    Client -->|"1: GET /payment/invoice/:id"| Controller
    Controller -->|"2: findByInvoice(id)"| Service
    Service -->|"3: find({invoiceId})"| Repo
    Repo -->|"4: SELECT payments"| DB
    DB -->|"5: payment[]"| Repo
    Repo -->|"6: payment entities"| Service
    Service -->|"7: calcular total"| Service
    Service -->|"8: payments + total"| Controller
    Controller -->|"9: 200 OK"| Client

    style Client fill:#e1f5ff
    style Controller fill:#fff4e6
    style Service fill:#e8f5e9
    style Repo fill:#f3e5f5
    style DB fill:#ffebee
```

---

## 🔄 Flujos Complejos

### Ciclo Completo: Crear Factura con Detalles y Pago

```mermaid
graph TB
    Client["📱 Cliente"]
    InvCtrl["🎮 InvoiceController"]
    DetCtrl["🎮 DetailController"]
    PayCtrl["🎮 PaymentController"]
    InvSvc["⚙️ InvoiceService"]
    DetSvc["⚙️ DetailService"]
    PaySvc["⚙️ PaymentService"]
    Repos["📦 Repositories"]
    DB[("💾 Database")]

    Client -->|"1: POST /invoice"| InvCtrl
    InvCtrl -->|"2: create(dto)"| InvSvc
    InvSvc -->|"3: validaciones"| Repos
    Repos -->|"4: queries"| DB
    DB -->|"5: validation OK"| Repos
    Repos -->|"6: data"| InvSvc
    InvSvc -->|"7: save invoice"| Repos
    Repos -->|"8: INSERT"| DB
    DB -->|"9: invoice created"| Repos
    Repos -->|"10: invoice entity"| InvSvc
    InvSvc -->|"11: invoice"| InvCtrl
    InvCtrl -->|"12: 201 + invoice"| Client
    
    Client -->|"13: POST /detail (x3)"| DetCtrl
    DetCtrl -->|"14: create(dto)"| DetSvc
    DetSvc -->|"15: save + update total"| Repos
    Repos -->|"16: INSERT + UPDATE"| DB
    DB -->|"17: detail created"| Repos
    Repos -->|"18: detail entity"| DetSvc
    DetSvc -->|"19: detail"| DetCtrl
    DetCtrl -->|"20: 201 + detail"| Client
    
    Client -->|"21: POST /payment"| PayCtrl
    PayCtrl -->|"22: create(dto)"| PaySvc
    PaySvc -->|"23: validar + save"| Repos
    Repos -->|"24: INSERT + UPDATE"| DB
    DB -->|"25: payment + invoice PAID"| Repos
    Repos -->|"26: payment entity"| PaySvc
    PaySvc -->|"27: payment"| PayCtrl
    PayCtrl -->|"28: 201 + payment"| Client

    style Client fill:#e1f5ff
    style InvCtrl fill:#fff4e6
    style DetCtrl fill:#fff4e6
    style PayCtrl fill:#fff4e6
    style InvSvc fill:#e8f5e9
    style DetSvc fill:#e8f5e9
    style PaySvc fill:#e8f5e9
    style Repos fill:#f3e5f5
    style DB fill:#ffebee
```

---

### Consulta de Estadísticas

```mermaid
graph TB
    Client["📱 Cliente"]
    Controller["🎮 InvoiceController"]
    Service["⚙️ InvoiceService"]
    Repo["📦 InvoiceRepository"]
    QB["🔍 QueryBuilder"]
    DB[("💾 Database")]

    Client -->|"1: GET /stats/by-status"| Controller
    Controller -->|"2: getStatsByStatus()"| Service
    Service -->|"3: createQueryBuilder()"| Repo
    Repo -->|"4: QB instance"| Service
    Service -->|"5: select + groupBy"| QB
    QB -->|"6: complex query"| DB
    DB -->|"7: aggregated data"| QB
    QB -->|"8: raw results"| Service
    Service -->|"9: format data"| Service
    Service -->|"10: statistics"| Controller
    Controller -->|"11: 200 OK + stats"| Client
    
    Client -->|"12: GET /stats/monthly/:year"| Controller
    Controller -->|"13: getMonthlyStats(year)"| Service
    Service -->|"14: createQueryBuilder()"| Repo
    Repo -->|"15: QB instance"| Service
    Service -->|"16: temporal query"| QB
    QB -->|"17: query by month"| DB
    DB -->|"18: monthly data"| QB
    QB -->|"19: results"| Service
    Service -->|"20: format monthly"| Service
    Service -->|"21: monthly stats"| Controller
    Controller -->|"22: 200 OK + stats"| Client

    style Client fill:#e1f5ff
    style Controller fill:#fff4e6
    style Service fill:#e8f5e9
    style Repo fill:#f3e5f5
    style QB fill:#fff9c4
    style DB fill:#ffebee
```

---

### Búsqueda Avanzada con Múltiples Filtros

```mermaid
graph LR
    Client["📱 Cliente"]
    Controller["🎮 Controller"]
    Service["⚙️ Service"]
    QB["🔍 QueryBuilder"]
    Cache["💨 Cache"]
    DB[("💾 Database")]

    Client -->|"1: GET /search?complex_filters"| Controller
    Controller -->|"2: search(filters)"| Service
    Service -->|"3: checkCache(filters)"| Cache
    Cache -->|"4: cache miss"| Service
    Service -->|"5: createQueryBuilder()"| QB
    QB -->|"6: QB instance"| Service
    Service -->|"7.1: andWhere(status)"| QB
    Service -->|"7.2: andWhere(dates)"| QB
    Service -->|"7.3: andWhere(amount)"| QB
    Service -->|"7.4: leftJoin(relations)"| QB
    QB -->|"8: execute query"| DB
    DB -->|"9: filtered results"| QB
    QB -->|"10: entities"| Service
    Service -->|"11: setCache(results)"| Cache
    Service -->|"12: results + metadata"| Controller
    Controller -->|"13: 200 OK + data"| Client

    style Client fill:#e1f5ff
    style Controller fill:#fff4e6
    style Service fill:#e8f5e9
    style QB fill:#fff9c4
    style Cache fill:#e0f7fa
    style DB fill:#ffebee
```

---

### Eliminación Segura con Referencias NULL

```mermaid
graph TB
    Client["📱 Cliente"]
    Controller["🎮 Controller"]
    Service["⚙️ Service"]
    Repo["📦 Repository"]
    DB[("💾 Database")]

    Client -->|"1: DELETE /company/:id"| Controller
    Controller -->|"2: remove(id)"| Service
    
    Service -->|"3.1: findOne(id)"| Repo
    Repo -->|"3.2: SELECT company"| DB
    DB -->|"3.3: company exists"| Repo
    Repo -->|"3.4: company entity"| Service
    
    Service -->|"4.1: checkReferences(id)"| Repo
    Repo -->|"4.2: SELECT invoices"| DB
    DB -->|"4.3: has invoices"| Repo
    Repo -->|"4.4: reference count"| Service
    
    Service -->|"5: soft delete strategy"| Service
    
    Service -->|"6.1: delete(id)"| Repo
    Repo -->|"6.2: DELETE company"| DB
    DB -->|"6.3: CASCADE SET NULL"| DB
    DB -->|"6.4: UPDATE invoice.companyId = NULL"| DB
    DB -->|"6.5: deleted"| Repo
    Repo -->|"6.6: success"| Service
    
    Service -->|"7: deletion result"| Controller
    Controller -->|"8: 200 OK"| Client

    style Client fill:#e1f5ff
    style Controller fill:#fff4e6
    style Service fill:#e8f5e9
    style Repo fill:#f3e5f5
    style DB fill:#ffebee
```

---

## 🔄 Comunicación entre Módulos

### Interacción Multi-Módulo: Invoice → Company + Customer

```mermaid
graph TB
    InvCtrl["🎮 InvoiceController"]
    InvSvc["⚙️ InvoiceService"]
    CompSvc["⚙️ CompanyService"]
    CustSvc["⚙️ CustomerService"]
    InvRepo["📦 InvoiceRepository"]
    CompRepo["📦 CompanyRepository"]
    CustRepo["📦 CustomerRepository"]
    DB[("💾 Database")]

    InvCtrl -->|"1: create(invoice)"| InvSvc
    
    InvSvc -->|"2.1: findOne(companyId)"| CompSvc
    CompSvc -->|"2.2: findOne(id)"| CompRepo
    CompRepo -->|"2.3: SELECT"| DB
    DB -->|"2.4: company"| CompRepo
    CompRepo -->|"2.5: entity"| CompSvc
    CompSvc -->|"2.6: company"| InvSvc
    
    InvSvc -->|"3.1: findOne(customerId)"| CustSvc
    CustSvc -->|"3.2: findOne(id)"| CustRepo
    CustRepo -->|"3.3: SELECT"| DB
    DB -->|"3.4: customer"| CustRepo
    CustRepo -->|"3.5: entity"| CustSvc
    CustSvc -->|"3.6: customer"| InvSvc
    
    InvSvc -->|"4.1: save(invoice)"| InvRepo
    InvRepo -->|"4.2: INSERT"| DB
    DB -->|"4.3: created"| InvRepo
    InvRepo -->|"4.4: invoice"| InvSvc
    
    InvSvc -->|"5: invoice entity"| InvCtrl

    style InvCtrl fill:#fff4e6
    style InvSvc fill:#e8f5e9
    style CompSvc fill:#e8f5e9
    style CustSvc fill:#e8f5e9
    style InvRepo fill:#f3e5f5
    style CompRepo fill:#f3e5f5
    style CustRepo fill:#f3e5f5
    style DB fill:#ffebee
```

---

### Patrón Repository: Abstracción de Acceso a Datos

```mermaid
graph LR
    Service["⚙️ Service Layer"]
    IRepo["📋 IRepository<br/>Interface"]
    Repo["📦 TypeORM Repository"]
    QR["🔍 Query Runner"]
    DB[("💾 PostgreSQL")]

    Service -->|"1: findOne(id)"| IRepo
    IRepo -->|"2: delegate"| Repo
    Repo -->|"3: createQuery"| QR
    QR -->|"4: SELECT"| DB
    DB -->|"5: result set"| QR
    QR -->|"6: map to entity"| Repo
    Repo -->|"7: entity"| IRepo
    IRepo -->|"8: entity"| Service
    
    Service -->|"9: save(entity)"| IRepo
    IRepo -->|"10: delegate"| Repo
    Repo -->|"11: createInsert"| QR
    QR -->|"12: INSERT"| DB
    DB -->|"13: inserted"| QR
    QR -->|"14: entity with id"| Repo
    Repo -->|"15: entity"| IRepo
    IRepo -->|"16: entity"| Service

    style Service fill:#e8f5e9
    style IRepo fill:#fff9c4
    style Repo fill:#f3e5f5
    style QR fill:#e1f5ff
    style DB fill:#ffebee
```

---

## 📊 Convenciones de los Diagramas

### Numeración de Mensajes
- **Secuencial:** 1, 2, 3, 4...
- **Anidado:** 1.1, 1.2, 2.1, 2.2...
- **Condicional:** 1a, 1b (alternativas)
- **Iterativo:** 1*, 2* (repetición)

### Tipos de Comunicación
- **Síncrona:** Flecha sólida (→)
- **Asíncrona:** Flecha discontinua (⇢)
- **Retorno:** Flecha punteada (⤺)

### Iconos de Componentes
- 📱 Cliente HTTP
- 🎮 Controllers
- ⚙️ Services
- 📦 Repositories
- 🔍 Query Builders
- 💾 Base de Datos
- 🔐 Seguridad (BCrypt)
- ✅ Validadores
- 💨 Cache

### Código de Colores
- **Azul claro:** Cliente
- **Naranja claro:** Controllers
- **Verde claro:** Services
- **Púrpura claro:** Repositories
- **Rojo claro:** Base de Datos
- **Amarillo:** Query Builders

---

## 🎯 Patrones de Comunicación Identificados

### 1. Patrón Layered (Capas)
```
Cliente → Controller → Service → Repository → Database
```

### 2. Patrón Repository
```
Service → IRepository (interface) → ConcreteRepository → Database
```

### 3. Patrón Query Builder
```
Service → QueryBuilder → Database
```

### 4. Patrón de Validación
```
Controller → Validator → Service (si válido)
```

### 5. Patrón de Transacción
```
Service → Repository.beginTransaction()
Service → Repository.save()
Service → Repository.commit() | rollback()
```

---

## 🔍 Cómo Visualizar estos Diagramas

### Opción 1: GitHub / GitLab
Los diagramas Mermaid se renderizan automáticamente.

### Opción 2: VS Code
Instala la extensión **Markdown Preview Mermaid Support**:
```bash
code --install-extension bierner.markdown-mermaid
```

### Opción 3: Mermaid Live Editor
Visita: https://mermaid.live/

### Opción 4: Herramientas de Documentación
- MkDocs con plugin mermaid2
- Docusaurus con soporte Mermaid
- GitBook con soporte Mermaid

---

## 📚 Referencias

- **UML Communication Diagrams:** Muestra la interacción estructural entre objetos
- **Message Numbering:** Indica el orden temporal de los mensajes
- **Collaboration:** Enfoque en la organización de objetos que colaboran
- **Pattern Recognition:** Identificación de patrones arquitectónicos

---

**Generado:** 5 de Noviembre, 2025  
**Proyecto:** API-Factus  
**Versión:** 1.0.0  
**Arquitectura:** NestJS + TypeORM + PostgreSQL
