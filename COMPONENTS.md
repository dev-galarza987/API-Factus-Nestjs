# 📊 Diagramas del Sistema API-Factus

Este documento contiene los diagramas de arquitectura del sistema de facturación API-Factus.

---

## 📦 Diagrama de Componentes del Sistema

```mermaid
graph TB
    subgraph "Cliente / Frontend"
        CLIENT[Cliente HTTP/Browser]
    end

    subgraph "API-Factus Server - NestJS"
        subgraph "Capa de Presentación"
            HOME[HomeController<br/>Página Principal]
            API[ApiController<br/>Info de la API]
        end

        subgraph "Capa de Controladores REST"
            COMP_CTRL[CompanyController<br/>Gestión de Empresas]
            CUST_CTRL[CustomerController<br/>Gestión de Clientes]
            INV_CTRL[InvoiceController<br/>Gestión de Facturas]
            DET_CTRL[InvoiceDetailController<br/>Detalles de Factura]
            PAY_CTRL[PaymentController<br/>Gestión de Pagos]
            USER_CTRL[UserController<br/>Autenticación y Usuarios]
        end

        subgraph "Capa de Servicios"
            COMP_SVC[CompanyService<br/>Lógica de Negocio]
            CUST_SVC[CustomerService<br/>Lógica de Negocio]
            INV_SVC[InvoiceService<br/>Lógica de Negocio]
            DET_SVC[InvoiceDetailService<br/>Lógica de Negocio]
            PAY_SVC[PaymentService<br/>Lógica de Negocio]
            USER_SVC[UserService<br/>Lógica de Negocio]
            SEED_SVC[SeedService<br/>Inicialización de Datos]
        end

        subgraph "Capa de Datos - TypeORM"
            COMP_ENT[Company Entity<br/>Modelo de Datos]
            CUST_ENT[Customer Entity<br/>Modelo de Datos]
            INV_ENT[Invoice Entity<br/>Modelo de Datos]
            DET_ENT[InvoiceDetail Entity<br/>Modelo de Datos]
            PAY_ENT[Payment Entity<br/>Modelo de Datos]
            USER_ENT[User Entity<br/>Modelo de Datos]
        end

        subgraph "Módulos"
            APP[AppModule<br/>Módulo Principal]
            DB[DatabaseModule<br/>Configuración BD]
        end
    end

    subgraph "Base de Datos"
        POSTGRES[(PostgreSQL 16<br/>Base de Datos)]
    end

    subgraph "Documentación"
        SWAGGER[Swagger UI<br/>Documentación Interactiva]
    end

    %% Conexiones Cliente
    CLIENT -->|HTTP Requests| HOME
    CLIENT -->|HTTP Requests| API
    CLIENT -->|HTTP Requests| COMP_CTRL
    CLIENT -->|HTTP Requests| CUST_CTRL
    CLIENT -->|HTTP Requests| INV_CTRL
    CLIENT -->|HTTP Requests| DET_CTRL
    CLIENT -->|HTTP Requests| PAY_CTRL
    CLIENT -->|HTTP Requests| USER_CTRL
    CLIENT -->|Consultar Docs| SWAGGER

    %% Conexiones Controlador -> Servicio
    COMP_CTRL --> COMP_SVC
    CUST_CTRL --> CUST_SVC
    INV_CTRL --> INV_SVC
    DET_CTRL --> DET_SVC
    PAY_CTRL --> PAY_SVC
    USER_CTRL --> USER_SVC

    %% Conexiones Servicio -> Entidad
    COMP_SVC --> COMP_ENT
    CUST_SVC --> CUST_ENT
    INV_SVC --> INV_ENT
    DET_SVC --> DET_ENT
    PAY_SVC --> PAY_ENT
    USER_SVC --> USER_ENT
    SEED_SVC --> USER_ENT

    %% Conexiones Entidad -> Base de Datos
    COMP_ENT -->|TypeORM| POSTGRES
    CUST_ENT -->|TypeORM| POSTGRES
    INV_ENT -->|TypeORM| POSTGRES
    DET_ENT -->|TypeORM| POSTGRES
    PAY_ENT -->|TypeORM| POSTGRES
    USER_ENT -->|TypeORM| POSTGRES

    %% Gestión de módulos
    APP --> DB
    DB --> POSTGRES

    style CLIENT fill:#e1f5ff
    style POSTGRES fill:#336791,color:#fff
    style SWAGGER fill:#85ea2d
```

---

## 🗂️ Diagrama de Módulos de NestJS

```mermaid
graph LR
    subgraph "AppModule (Raíz)"
        APP[App Module]
    end

    subgraph "Módulos de Funcionalidad"
        HOME_MOD[Home Module]
        API_MOD[API Module]
        COMP_MOD[Company Module]
        CUST_MOD[Customer Module]
        INV_MOD[Invoice Module]
        DET_MOD[InvoiceDetail Module]
        PAY_MOD[Payment Module]
        USER_MOD[User Module]
    end

    subgraph "Módulos de Infraestructura"
        DB_MOD[Database Module]
        CONFIG[Config Module<br/>Variables de Entorno]
    end

    APP --> HOME_MOD
    APP --> API_MOD
    APP --> COMP_MOD
    APP --> CUST_MOD
    APP --> INV_MOD
    APP --> DET_MOD
    APP --> PAY_MOD
    APP --> USER_MOD
    APP --> DB_MOD
    APP --> CONFIG

    DB_MOD -.->|TypeORM| COMP_MOD
    DB_MOD -.->|TypeORM| CUST_MOD
    DB_MOD -.->|TypeORM| INV_MOD
    DB_MOD -.->|TypeORM| DET_MOD
    DB_MOD -.->|TypeORM| PAY_MOD
    DB_MOD -.->|TypeORM| USER_MOD

    style APP fill:#e74c3c,color:#fff
    style DB_MOD fill:#3498db,color:#fff
    style CONFIG fill:#9b59b6,color:#fff
```

---

## 🔄 Diagrama de Relaciones entre Entidades

```mermaid
erDiagram
    USER ||--o| COMPANY : "tiene (opcional)"
    USER ||--o| CUSTOMER : "tiene (opcional)"
    COMPANY ||--o{ INVOICE : "emite"
    CUSTOMER ||--o{ INVOICE : "recibe"
    INVOICE ||--|{ INVOICE_DETAIL : "contiene"
    INVOICE ||--o{ PAYMENT : "tiene"

    USER {
        uuid id PK
        string email UK
        string password
        enum role
        boolean isActive
        timestamp createdAt
        timestamp updatedAt
    }

    COMPANY {
        uuid id PK
        string businessName
        string taxId UK
        string email
        string address
        uuid userId FK
    }

    CUSTOMER {
        uuid id PK
        string name
        string taxOrId UK
        string email
        uuid userId FK
    }

    INVOICE {
        uuid id PK
        string number UK
        timestamp issueDate
        decimal totalAmount
        enum status
        uuid companyId FK
        uuid customerId FK
    }

    INVOICE_DETAIL {
        uuid id PK
        string description
        decimal quantity
        decimal unitPrice
        decimal subtotal
        uuid invoiceId FK
    }

    PAYMENT {
        uuid id PK
        enum method
        decimal amount
        timestamp date
        uuid invoiceId FK
    }
```

---

## 🏗️ Arquitectura en Capas

```mermaid
graph TB
    subgraph "Capa 1: Presentación"
        A1[Controllers<br/>- CompanyController<br/>- CustomerController<br/>- InvoiceController<br/>- InvoiceDetailController<br/>- PaymentController<br/>- UserController]
        A2[DTOs<br/>- CreateDto<br/>- UpdateDto<br/>- Validaciones]
    end

    subgraph "Capa 2: Lógica de Negocio"
        B1[Services<br/>- CompanyService<br/>- CustomerService<br/>- InvoiceService<br/>- InvoiceDetailService<br/>- PaymentService<br/>- UserService]
        B2[Validaciones<br/>class-validator<br/>class-transformer]
    end

    subgraph "Capa 3: Acceso a Datos"
        C1[Repositories<br/>TypeORM Repositories]
        C2[Entities<br/>- Company<br/>- Customer<br/>- Invoice<br/>- InvoiceDetail<br/>- Payment<br/>- User]
    end

    subgraph "Capa 4: Base de Datos"
        D1[(PostgreSQL<br/>Tablas y Relaciones)]
    end

    A1 --> B1
    A2 --> A1
    B1 --> C1
    B2 --> B1
    C1 --> C2
    C2 --> D1

    style A1 fill:#3498db,color:#fff
    style B1 fill:#2ecc71,color:#fff
    style C1 fill:#f39c12,color:#fff
    style D1 fill:#e74c3c,color:#fff
```

---

## 🔀 Flujo de Datos: Crear Factura

```mermaid
sequenceDiagram
    participant Client as Cliente HTTP
    participant Controller as InvoiceController
    participant Service as InvoiceService
    participant CompanyRepo as Company Repository
    participant CustomerRepo as Customer Repository
    participant InvoiceRepo as Invoice Repository
    participant DB as PostgreSQL

    Client->>Controller: POST /api/v1/invoice/create
    activate Controller
    
    Controller->>Controller: Validar DTO
    Controller->>Service: create(createInvoiceDto)
    activate Service
    
    Service->>CompanyRepo: findOne(companyId)
    activate CompanyRepo
    CompanyRepo->>DB: SELECT * FROM company WHERE id=?
    DB-->>CompanyRepo: Company data
    CompanyRepo-->>Service: Company entity
    deactivate CompanyRepo
    
    Service->>CustomerRepo: findOne(customerId)
    activate CustomerRepo
    CustomerRepo->>DB: SELECT * FROM customer WHERE id=?
    DB-->>CustomerRepo: Customer data
    CustomerRepo-->>Service: Customer entity
    deactivate CustomerRepo
    
    Service->>InvoiceRepo: save(invoice)
    activate InvoiceRepo
    InvoiceRepo->>DB: INSERT INTO invoice...
    DB-->>InvoiceRepo: Invoice created
    InvoiceRepo-->>Service: Invoice entity
    deactivate InvoiceRepo
    
    Service-->>Controller: Invoice entity
    deactivate Service
    
    Controller-->>Client: 201 Created + Invoice JSON
    deactivate Controller
```

---

## 🔐 Flujo de Autenticación

```mermaid
sequenceDiagram
    participant Client as Cliente
    participant Controller as UserController
    participant Service as UserService
    participant UserRepo as User Repository
    participant BCrypt as BCrypt Library
    participant DB as PostgreSQL

    Note over Client,DB: Registro de Usuario
    Client->>Controller: POST /api/v1/user/register
    Controller->>Service: register(createUserDto)
    Service->>BCrypt: hash(password)
    BCrypt-->>Service: hashedPassword
    Service->>UserRepo: save(user)
    UserRepo->>DB: INSERT INTO user...
    DB-->>UserRepo: User created
    UserRepo-->>Service: User entity
    Service-->>Controller: User entity
    Controller-->>Client: 201 Created

    Note over Client,DB: Inicio de Sesión
    Client->>Controller: POST /api/v1/user/auth/login
    Controller->>Service: login(email, password)
    Service->>UserRepo: findOneByEmail(email)
    UserRepo->>DB: SELECT * FROM user WHERE email=?
    DB-->>UserRepo: User data
    UserRepo-->>Service: User entity
    Service->>BCrypt: compare(password, hashedPassword)
    BCrypt-->>Service: isValid
    
    alt Contraseña válida
        Service-->>Controller: {user, message: "Login exitoso"}
        Controller-->>Client: 200 OK + User data
    else Contraseña inválida
        Service-->>Controller: Error
        Controller-->>Client: 400 Bad Request
    end
```

---

## 📊 Diagrama de Estados de Factura

```mermaid
stateDiagram-v2
    [*] --> PENDING: Crear Factura
    
    PENDING --> PAID: Pago Completo<br/>(mark-as-paid)
    PENDING --> CANCELLED: Cancelar<br/>(cancel)
    
    PAID --> PENDING: Revertir<br/>(mark-as-pending)
    
    CANCELLED --> [*]: Factura Cancelada
    PAID --> [*]: Factura Completada
    
    note right of PENDING
        Estado inicial
        Esperando pago
    end note
    
    note right of PAID
        Pago completado
        Monto total pagado
    end note
    
    note right of CANCELLED
        Factura anulada
        No se procesará
    end note
```

---

## 🔧 Componentes Técnicos

```mermaid
graph TB
    subgraph "Tecnologías Core"
        NEST[NestJS 11.x<br/>Framework Principal]
        TS[TypeScript 5.x<br/>Lenguaje]
        NODE[Node.js<br/>Runtime]
    end

    subgraph "ORM y Base de Datos"
        TYPEORM[TypeORM 0.3.x<br/>ORM]
        PG[pg<br/>Driver PostgreSQL]
        POSTGRES[(PostgreSQL 16.x<br/>Base de Datos)]
    end

    subgraph "Validación y Transformación"
        VALIDATOR[class-validator<br/>Validaciones]
        TRANSFORMER[class-transformer<br/>Transformaciones]
    end

    subgraph "Seguridad"
        BCRYPT[BCrypt<br/>Hash de Contraseñas]
    end

    subgraph "Documentación"
        SWAGGER[Swagger/OpenAPI<br/>Documentación API]
        HBS[Handlebars<br/>Templates]
    end

    subgraph "Desarrollo"
        JEST[Jest<br/>Testing]
        ESLINT[ESLint<br/>Linting]
        PRETTIER[Prettier<br/>Formateo]
    end

    NODE --> NEST
    TS --> NEST
    NEST --> TYPEORM
    TYPEORM --> PG
    PG --> POSTGRES
    NEST --> VALIDATOR
    NEST --> TRANSFORMER
    NEST --> BCRYPT
    NEST --> SWAGGER
    NEST --> HBS

    style NEST fill:#e74c3c,color:#fff
    style POSTGRES fill:#336791,color:#fff
    style TYPEORM fill:#fcad03,color:#000
    style TS fill:#3178c6,color:#fff
```

---

## 📁 Estructura de Directorios

```mermaid
graph TB
    ROOT[API-Factus/]
    
    ROOT --> SRC[src/]
    ROOT --> TEST[test/]
    ROOT --> DB[database/]
    ROOT --> PUBLIC[public/]
    ROOT --> VIEWS[views/]
    ROOT --> CONFIG[Config Files]
    
    SRC --> MODULES[Módulos/]
    MODULES --> COMP[company/]
    MODULES --> CUST[customer/]
    MODULES --> INV[invoice/]
    MODULES --> DET[invoice-detail/]
    MODULES --> PAY[payment/]
    MODULES --> USER[user/]
    MODULES --> HOME[home/]
    MODULES --> API[api/]
    MODULES --> DBMOD[database/]
    
    COMP --> COMP_CTRL[*.controller.ts]
    COMP --> COMP_SVC[*.service.ts]
    COMP --> COMP_ENT[entities/]
    COMP --> COMP_DTO[dto/]
    
    TEST --> E2E[e2e tests]
    TEST --> HELPERS[helpers/]
    TEST --> FIXTURES[fixtures/]
    
    DB --> SQL[seed-data.sql]
    
    PUBLIC --> CSS[css/]
    PUBLIC --> JS[js/]
    
    VIEWS --> HBS[*.hbs templates]
    
    CONFIG --> PKG[package.json]
    CONFIG --> TS_CONFIG[tsconfig.json]
    CONFIG --> NEST_CLI[nest-cli.json]

    style ROOT fill:#e74c3c,color:#fff
    style SRC fill:#3498db,color:#fff
    style MODULES fill:#2ecc71,color:#fff
```

---

## 🌐 Flujo Completo: Ciclo de Vida de una Factura

```mermaid
graph TD
    START([Inicio]) --> CREATE[Crear Factura<br/>POST /invoice/create]
    CREATE --> ADD_DETAILS[Agregar Detalles<br/>POST /invoice-detail/create]
    ADD_DETAILS --> PENDING{Estado:<br/>PENDING}
    
    PENDING --> ADD_PAYMENT[Registrar Pago<br/>POST /payment/create]
    ADD_PAYMENT --> CHECK_TOTAL{¿Pago<br/>Completo?}
    
    CHECK_TOTAL -->|Sí| MARK_PAID[Marcar como PAID<br/>PATCH /invoice/:id/mark-as-paid]
    CHECK_TOTAL -->|No| PENDING
    
    PENDING -.->|Cancelar| CANCEL[Estado: CANCELLED<br/>PATCH /invoice/:id/cancel]
    
    MARK_PAID --> PAID{Estado:<br/>PAID}
    PAID --> REPORT[Generar Reportes<br/>GET /invoice/stats/*]
    
    CANCEL --> CANCELLED{Estado:<br/>CANCELLED}
    
    REPORT --> END([Fin])
    CANCELLED --> END

    style CREATE fill:#3498db,color:#fff
    style PENDING fill:#f39c12,color:#fff
    style PAID fill:#2ecc71,color:#fff
    style CANCELLED fill:#e74c3c,color:#fff
```

---

## 📈 Casos de Uso Principales

```mermaid
graph LR
    subgraph "Actores"
        ADMIN[Administrador]
        COMPANY[Empresa]
        CUSTOMER[Cliente]
    end

    subgraph "Casos de Uso"
        UC1[Gestionar Empresas]
        UC2[Gestionar Clientes]
        UC3[Crear Facturas]
        UC4[Registrar Pagos]
        UC5[Ver Estadísticas]
        UC6[Autenticar Usuario]
        UC7[Consultar Estado<br/>de Cuenta]
    end

    ADMIN --> UC1
    ADMIN --> UC6
    ADMIN --> UC5
    
    COMPANY --> UC3
    COMPANY --> UC4
    COMPANY --> UC5
    COMPANY --> UC6
    
    CUSTOMER --> UC7
    CUSTOMER --> UC6

    UC3 -.->|requiere| UC1
    UC3 -.->|requiere| UC2
    UC4 -.->|requiere| UC3

    style ADMIN fill:#e74c3c,color:#fff
    style COMPANY fill:#3498db,color:#fff
    style CUSTOMER fill:#2ecc71,color:#fff
```

---

## 🔍 Cómo Visualizar estos Diagramas

### Opción 1: GitHub / GitLab
Los diagramas Mermaid se renderizan automáticamente cuando ves este archivo en GitHub o GitLab.

### Opción 2: VS Code
Instala la extensión **Markdown Preview Mermaid Support**:
```bash
code --install-extension bierner.markdown-mermaid
```

### Opción 3: Mermaid Live Editor
Copia el código Mermaid y pégalo en: https://mermaid.live/

### Opción 4: Documentación Markdown
Muchos generadores de documentación (MkDocs, Docusaurus, etc.) soportan Mermaid nativamente.

---

**Generado:** 4 de Noviembre, 2025  
**Proyecto:** API-Factus  
**Versión:** 1.0.0
