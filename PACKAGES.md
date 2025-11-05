# 📦 Diagrama de Paquetes - API-Factus

Este documento contiene los diagramas de paquetes y dependencias del sistema de facturación API-Factus.

---

## 📦 Diagrama de Paquetes Principal

```mermaid
graph TB
    subgraph "API-Factus Application"
        subgraph "app [Paquete Principal]"
            APP_CTRL[app.controller.ts<br/>Controlador raíz]
            APP_SVC[app.service.ts<br/>Servicio raíz]
            APP_MOD[app.module.ts<br/>Módulo principal]
            MAIN[main.ts<br/>Bootstrap]
        end

        subgraph "presentation [Capa de Presentación]"
            HOME_PKG[home/<br/>Página de inicio]
            API_PKG[api/<br/>Info de API]
        end

        subgraph "features [Módulos de Negocio]"
            COMP_PKG[company/<br/>Gestión de empresas]
            CUST_PKG[customer/<br/>Gestión de clientes]
            INV_PKG[invoice/<br/>Gestión de facturas]
            DET_PKG[invoice-detail/<br/>Detalles de factura]
            PAY_PKG[payment/<br/>Gestión de pagos]
            USER_PKG[user/<br/>Autenticación]
        end

        subgraph "infrastructure [Infraestructura]"
            DB_PKG[database/<br/>Configuración BD<br/>Seeders]
        end

        subgraph "shared [Compartido]"
            TYPES_PKG[types/<br/>Enums y tipos<br/>- PaymentMethod<br/>- StateInvoice<br/>- UserRole]
        end

        subgraph "testing [Pruebas]"
            TEST_PKG[test/<br/>Pruebas E2E<br/>Fixtures<br/>Helpers]
        end

        subgraph "static [Recursos Estáticos]"
            PUBLIC_PKG[public/<br/>CSS, JS]
            VIEWS_PKG[views/<br/>Templates HBS]
        end

        subgraph "config [Configuración]"
            ENV_PKG[.env<br/>Variables de entorno]
            TS_PKG[tsconfig.json<br/>TypeScript config]
            NEST_PKG[nest-cli.json<br/>NestJS config]
            PKG_JSON[package.json<br/>Dependencias]
        end
    end

    %% Dependencias entre paquetes
    MAIN --> APP_MOD
    APP_MOD --> HOME_PKG
    APP_MOD --> API_PKG
    APP_MOD --> COMP_PKG
    APP_MOD --> CUST_PKG
    APP_MOD --> INV_PKG
    APP_MOD --> DET_PKG
    APP_MOD --> PAY_PKG
    APP_MOD --> USER_PKG
    APP_MOD --> DB_PKG

    COMP_PKG --> TYPES_PKG
    CUST_PKG --> TYPES_PKG
    INV_PKG --> TYPES_PKG
    PAY_PKG --> TYPES_PKG
    USER_PKG --> TYPES_PKG

    COMP_PKG -.->|usa| DB_PKG
    CUST_PKG -.->|usa| DB_PKG
    INV_PKG -.->|usa| DB_PKG
    DET_PKG -.->|usa| DB_PKG
    PAY_PKG -.->|usa| DB_PKG
    USER_PKG -.->|usa| DB_PKG

    HOME_PKG -.->|sirve| VIEWS_PKG
    HOME_PKG -.->|sirve| PUBLIC_PKG

    TEST_PKG -.->|prueba| COMP_PKG
    TEST_PKG -.->|prueba| CUST_PKG
    TEST_PKG -.->|prueba| INV_PKG
    TEST_PKG -.->|prueba| DET_PKG
    TEST_PKG -.->|prueba| PAY_PKG
    TEST_PKG -.->|prueba| USER_PKG

    ENV_PKG -.->|configura| APP_MOD
    TS_PKG -.->|configura| APP_MOD
    NEST_PKG -.->|configura| APP_MOD
    PKG_JSON -.->|define| APP_MOD

    style APP_MOD fill:#e74c3c,color:#fff
    style DB_PKG fill:#3498db,color:#fff
    style TYPES_PKG fill:#9b59b6,color:#fff
```

---

## 🏗️ Estructura Detallada de Paquetes por Módulo

```mermaid
graph TB
    subgraph "company [Paquete Company]"
        COMP_MOD[company.module.ts]
        COMP_CTRL[company.controller.ts]
        COMP_SVC[company.service.ts]
        
        subgraph "company/entities"
            COMP_ENT[company.entity.ts]
        end
        
        subgraph "company/dto"
            COMP_CREATE[create-company.dto.ts]
            COMP_UPDATE[update-company.dto.ts]
        end
        
        subgraph "company/test"
            COMP_CTRL_TEST[company.controller.spec.ts]
            COMP_SVC_TEST[company.service.spec.ts]
        end
    end

    subgraph "customer [Paquete Customer]"
        CUST_MOD[customer.module.ts]
        CUST_CTRL[customer.controller.ts]
        CUST_SVC[customer.service.ts]
        
        subgraph "customer/entities"
            CUST_ENT[customer.entity.ts]
        end
        
        subgraph "customer/dto"
            CUST_CREATE[create-customer.dto.ts]
            CUST_UPDATE[update-customer.dto.ts]
        end
        
        subgraph "customer/test"
            CUST_CTRL_TEST[customer.controller.spec.ts]
            CUST_SVC_TEST[customer.service.spec.ts]
        end
    end

    subgraph "invoice [Paquete Invoice]"
        INV_MOD[invoice.module.ts]
        INV_CTRL[invoice.controller.ts]
        INV_SVC[invoice.service.ts]
        
        subgraph "invoice/entities"
            INV_ENT[invoice.entity.ts]
        end
        
        subgraph "invoice/dto"
            INV_CREATE[create-invoice.dto.ts]
            INV_UPDATE[update-invoice.dto.ts]
        end
        
        subgraph "invoice/test"
            INV_CTRL_TEST[invoice.controller.spec.ts]
            INV_SVC_TEST[invoice.service.spec.ts]
        end
    end

    subgraph "invoice-detail [Paquete InvoiceDetail]"
        DET_MOD[invoice-detail.module.ts]
        DET_CTRL[invoice-detail.controller.ts]
        DET_SVC[invoice-detail.service.ts]
        
        subgraph "invoice-detail/entities"
            DET_ENT[invoice-detail.entity.ts]
        end
        
        subgraph "invoice-detail/dto"
            DET_CREATE[create-invoice-detail.dto.ts]
            DET_UPDATE[update-invoice-detail.dto.ts]
        end
        
        subgraph "invoice-detail/test"
            DET_CTRL_TEST[invoice-detail.controller.spec.ts]
            DET_SVC_TEST[invoice-detail.service.spec.ts]
        end
    end

    subgraph "payment [Paquete Payment]"
        PAY_MOD[payment.module.ts]
        PAY_CTRL[payment.controller.ts]
        PAY_SVC[payment.service.ts]
        
        subgraph "payment/entities"
            PAY_ENT[payment.entity.ts]
        end
        
        subgraph "payment/dto"
            PAY_CREATE[create-payment.dto.ts]
            PAY_UPDATE[update-payment.dto.ts]
        end
        
        subgraph "payment/test"
            PAY_CTRL_TEST[payment.controller.spec.ts]
            PAY_SVC_TEST[payment.service.spec.ts]
        end
    end

    subgraph "user [Paquete User]"
        USER_MOD[user.module.ts]
        USER_CTRL[user.controller.ts]
        USER_SVC[user.service.ts]
        
        subgraph "user/entities"
            USER_ENT[user.entity.ts]
        end
        
        subgraph "user/dto"
            USER_CREATE[create-user.dto.ts]
            USER_UPDATE[update-user.dto.ts]
            USER_LOGIN[login-user.dto.ts]
        end
    end

    %% Relaciones dentro de cada paquete
    COMP_MOD --> COMP_CTRL
    COMP_MOD --> COMP_SVC
    COMP_CTRL --> COMP_SVC
    COMP_SVC --> COMP_ENT
    COMP_CTRL --> COMP_CREATE
    COMP_CTRL --> COMP_UPDATE

    CUST_MOD --> CUST_CTRL
    CUST_MOD --> CUST_SVC
    CUST_CTRL --> CUST_SVC
    CUST_SVC --> CUST_ENT
    CUST_CTRL --> CUST_CREATE
    CUST_CTRL --> CUST_UPDATE

    INV_MOD --> INV_CTRL
    INV_MOD --> INV_SVC
    INV_CTRL --> INV_SVC
    INV_SVC --> INV_ENT
    INV_CTRL --> INV_CREATE
    INV_CTRL --> INV_UPDATE

    DET_MOD --> DET_CTRL
    DET_MOD --> DET_SVC
    DET_CTRL --> DET_SVC
    DET_SVC --> DET_ENT
    DET_CTRL --> DET_CREATE
    DET_CTRL --> DET_UPDATE

    PAY_MOD --> PAY_CTRL
    PAY_MOD --> PAY_SVC
    PAY_CTRL --> PAY_SVC
    PAY_SVC --> PAY_ENT
    PAY_CTRL --> PAY_CREATE
    PAY_CTRL --> PAY_UPDATE

    USER_MOD --> USER_CTRL
    USER_MOD --> USER_SVC
    USER_CTRL --> USER_SVC
    USER_SVC --> USER_ENT
    USER_CTRL --> USER_CREATE
    USER_CTRL --> USER_UPDATE
    USER_CTRL --> USER_LOGIN

    style COMP_MOD fill:#3498db,color:#fff
    style CUST_MOD fill:#2ecc71,color:#fff
    style INV_MOD fill:#e74c3c,color:#fff
    style DET_MOD fill:#f39c12,color:#fff
    style PAY_MOD fill:#9b59b6,color:#fff
    style USER_MOD fill:#1abc9c,color:#fff
```

---

## 📚 Dependencias entre Paquetes de Dominio

```mermaid
graph LR
    subgraph "Paquetes de Dominio"
        USER[user<br/>👤 Usuario]
        COMP[company<br/>🏢 Empresa]
        CUST[customer<br/>👥 Cliente]
        INV[invoice<br/>📄 Factura]
        DET[invoice-detail<br/>📋 Detalle]
        PAY[payment<br/>💰 Pago]
    end

    subgraph "Paquetes Compartidos"
        TYPES[types<br/>Enums y Tipos]
        DB[database<br/>TypeORM Config]
    end

    %% Dependencias de negocio
    COMP -->|creado por| USER
    CUST -->|creado por| USER
    INV -->|emitida por| COMP
    INV -->|emitida a| CUST
    DET -->|pertenece a| INV
    PAY -->|aplica a| INV

    %% Dependencias técnicas
    USER -.->|usa| TYPES
    INV -.->|usa| TYPES
    PAY -.->|usa| TYPES

    USER -.->|usa| DB
    COMP -.->|usa| DB
    CUST -.->|usa| DB
    INV -.->|usa| DB
    DET -.->|usa| DB
    PAY -.->|usa| DB

    style USER fill:#1abc9c,color:#fff
    style COMP fill:#3498db,color:#fff
    style CUST fill:#2ecc71,color:#fff
    style INV fill:#e74c3c,color:#fff
    style DET fill:#f39c12,color:#fff
    style PAY fill:#9b59b6,color:#fff
    style TYPES fill:#95a5a6,color:#fff
    style DB fill:#34495e,color:#fff
```

---

## 📦 Dependencias de NPM (package.json)

```mermaid
graph TB
    subgraph API["API-Factus"]
        APP[Application]
    end

    subgraph NEST["NestJS Framework"]
        NEST_CORE["@nestjs/core"]
        NEST_COMMON["@nestjs/common"]
        NEST_PLATFORM["@nestjs/platform-express"]
        NEST_TYPEORM["@nestjs/typeorm"]
        NEST_CONFIG["@nestjs/config"]
        NEST_SWAGGER["@nestjs/swagger"]
    end

    subgraph ORM["ORM y Base de Datos"]
        TYPEORM[typeorm]
        PG["pg - PostgreSQL Driver"]
    end

    subgraph VALID["Validación y Transformación"]
        CLASS_VAL[class-validator]
        CLASS_TRANS[class-transformer]
    end

    subgraph SEC["Seguridad"]
        BCRYPT[bcrypt]
        BCRYPT_TYPES["@types/bcrypt"]
    end

    subgraph VIEW["Vistas y Templates"]
        HBS["hbs - Handlebars"]
    end

    subgraph UTIL["Utilidades"]
        RXJS[rxjs]
        REFLECT[reflect-metadata]
    end

    subgraph TEST["Testing"]
        JEST["@nestjs/testing"]
        JEST_CORE["@jest/globals"]
        SUPERTEST[supertest]
        TS_JEST[ts-jest]
    end

    subgraph DEV["Desarrollo"]
        TS_NODE[ts-node]
        TYPESCRIPT[typescript]
        ESLINT["@typescript-eslint"]
        PRETTIER[prettier]
    end

    APP --> NEST_CORE
    APP --> NEST_COMMON
    APP --> NEST_PLATFORM
    APP --> NEST_TYPEORM
    APP --> NEST_CONFIG
    APP --> NEST_SWAGGER

    NEST_TYPEORM --> TYPEORM
    TYPEORM --> PG

    APP --> CLASS_VAL
    APP --> CLASS_TRANS
    APP --> BCRYPT
    APP --> HBS
    APP --> RXJS
    APP --> REFLECT

    JEST --> JEST_CORE
    JEST --> SUPERTEST
    JEST --> TS_JEST

    style APP fill:#e74c3c,color:#fff
    style NEST_CORE fill:#e74c3c,color:#fff
    style TYPEORM fill:#fcad03,color:#000
    style PG fill:#336791,color:#fff
```

---

## 🔗 Diagrama de Dependencias Detallado

```mermaid
graph TB
    subgraph PROD["Production Dependencies"]
        subgraph FCORE["Framework Core"]
            PC1["NestJS 11.0.2"]
            PC2["TypeScript 5.7.2"]
            PC3["Node.js Runtime"]
        end

        subgraph DBLAYER["Database Layer"]
            PD1["TypeORM 0.3.20"]
            PD2["pg 8.13.1"]
            PD3["PostgreSQL 16.x"]
        end

        subgraph VALLAYER["Validation Layer"]
            PV1["class-validator 0.14.1"]
            PV2["class-transformer 0.5.1"]
        end

        subgraph SECLAYER["Security Layer"]
            PS1["bcrypt 5.1.1"]
        end

        subgraph DOC["Documentation"]
            PDOC1["@nestjs/swagger 8.0.6"]
            PDOC2["swagger-ui-express"]
        end

        subgraph VENG["View Engine"]
            PVE1["hbs 4.2.0"]
            PVE2["@nestjs/platform-express"]
        end

        subgraph REACTIVE["Reactive Programming"]
            PR1["rxjs 7.8.1"]
        end
    end

    subgraph DEVDEP["Development Dependencies"]
        subgraph TESTFW["Testing Framework"]
            DT1["Jest 30.0.0-alpha.6"]
            DT2["@nestjs/testing 11.0.2"]
            DT3["supertest 7.0.0"]
            DT4["ts-jest 29.2.5"]
        end

        subgraph QUALITY["Code Quality"]
            DQ1["ESLint 9.17.0"]
            DQ2["Prettier 3.4.2"]
            DQ3["@typescript-eslint/plugin"]
            DQ4["@typescript-eslint/parser"]
        end

        subgraph TYPES["Type Definitions"]
            DTD1["@types/node"]
            DTD2["@types/jest"]
            DTD3["@types/express"]
            DTD4["@types/bcrypt"]
            DTD5["@types/supertest"]
        end

        subgraph BUILD["Build Tools"]
            DB1["ts-node 10.9.2"]
            DB2["tsconfig-paths 4.2.0"]
        end
    end

    PC1 --> PC2
    PC1 --> PD1
    PC1 --> PV1
    PC1 --> PS1
    PC1 --> PDOC1
    PC1 --> PVE2
    PC1 --> PR1

    PD1 --> PD2
    PD2 --> PD3

    PV1 --> PC2
    PV2 --> PC2

    PVE2 --> PVE1

    DT2 --> PC1
    DT1 --> DT3
    DT1 --> DT4

    DQ1 --> DQ3
    DQ1 --> DQ4

    style PC1 fill:#e74c3c,color:#fff
    style PD1 fill:#fcad03,color:#000
    style PD3 fill:#336791,color:#fff
    style DT1 fill:#99425b,color:#fff
```

---

## 📊 Paquetes por Capa de Arquitectura

```mermaid
graph TB
    subgraph "Layer 1: Presentation Layer"
        L1P1[Controllers Package]
        L1P2[DTOs Package]
        L1P3[Decorators Package]
        L1P4[Views Package]
    end

    subgraph "Layer 2: Business Logic Layer"
        L2P1[Services Package]
        L2P2[Use Cases Package]
        L2P3[Domain Models Package]
    end

    subgraph "Layer 3: Data Access Layer"
        L3P1[Entities Package]
        L3P2[Repositories Package]
        L3P3[Migrations Package]
        L3P4[Seeders Package]
    end

    subgraph "Layer 4: Infrastructure Layer"
        L4P1[Database Module]
        L4P2[Config Module]
        L4P3[Logger Module]
    end

    subgraph "Cross-Cutting Concerns"
        CCP1[Types Package]
        CCP2[Validators Package]
        CCP3[Transformers Package]
        CCP4[Exception Filters]
    end

    L1P1 --> L2P1
    L1P2 --> L1P1
    L2P1 --> L3P2
    L3P2 --> L3P1
    L3P1 --> L4P1

    L1P1 -.->|usa| CCP1
    L2P1 -.->|usa| CCP1
    L3P1 -.->|usa| CCP1

    L1P2 -.->|usa| CCP2
    L1P2 -.->|usa| CCP3

    style L1P1 fill:#3498db,color:#fff
    style L2P1 fill:#2ecc71,color:#fff
    style L3P1 fill:#f39c12,color:#fff
    style L4P1 fill:#e74c3c,color:#fff
    style CCP1 fill:#95a5a6,color:#fff
```

---

## 🧩 Paquetes de Pruebas (Testing)

```mermaid
graph TB
    subgraph "test/ [Paquete de Pruebas]"
        subgraph "E2E Tests"
            E2E1[app.e2e-spec.ts<br/>Pruebas de aplicación]
            E2E2[basic-app.e2e-spec.ts<br/>Pruebas básicas]
            E2E3[company.e2e-spec.ts<br/>Pruebas de empresa]
            E2E4[customer.e2e-spec.ts<br/>Pruebas de cliente]
            E2E5[invoice.e2e-spec.ts<br/>Pruebas de factura]
            E2E6[invoice-detail.e2e-spec.ts<br/>Pruebas de detalle]
            E2E7[payment.e2e-spec.ts<br/>Pruebas de pago]
            E2E8[user.e2e-spec.ts<br/>Pruebas de usuario]
        end

        subgraph "Simple Tests"
            S1[company-simple.e2e-spec.ts]
            S2[customer-simple.e2e-spec.ts]
            S3[invoice-simple.e2e-spec.ts]
            S4[payment-simple.e2e-spec.ts]
            S5[user-simple.e2e-spec.ts]
        end

        subgraph "Mock Tests"
            M1[company-mock.e2e-spec.ts]
        end

        subgraph "helpers/"
            H1[test-helper.ts<br/>Utilidades generales]
            H2[simple-test-helper.ts<br/>Utilidades simplificadas]
        end

        subgraph "fixtures/"
            F1[test-fixtures.ts<br/>Datos de prueba]
        end

        subgraph "config/"
            C1[jest-e2e.json<br/>Configuración Jest]
        end
    end

    E2E3 --> H1
    E2E4 --> H1
    E2E5 --> H1
    E2E6 --> H1
    E2E7 --> H1
    E2E8 --> H1

    S1 --> H2
    S2 --> H2
    S3 --> H2
    S4 --> H2
    S5 --> H2

    M1 --> H1

    E2E3 --> F1
    E2E4 --> F1
    E2E5 --> F1
    E2E6 --> F1
    E2E7 --> F1
    E2E8 --> F1

    H1 --> F1

    style E2E1 fill:#99425b,color:#fff
    style H1 fill:#3498db,color:#fff
    style F1 fill:#2ecc71,color:#fff
    style C1 fill:#f39c12,color:#fff
```

---

## 🗂️ Paquetes de Configuración

```mermaid
graph TB
    subgraph "Configuration Packages"
        subgraph "TypeScript Config"
            TS1[tsconfig.json<br/>Config principal]
            TS2[tsconfig.build.json<br/>Config de build]
        end

        subgraph "NestJS Config"
            NEST1[nest-cli.json<br/>CLI configuration]
        end

        subgraph "ESLint Config"
            ES1[eslint.config.mjs<br/>Linting rules]
        end

        subgraph "Prettier Config"
            PR1[.prettierrc<br/>Format rules]
        end

        subgraph "Package Config"
            PKG1[package.json<br/>Dependencies<br/>Scripts<br/>Metadata]
        end

        subgraph "Environment Config"
            ENV1[.env<br/>Environment variables]
            ENV2[.env.example<br/>Template]
        end

        subgraph "Git Config"
            GIT1[.gitignore<br/>Ignored files]
        end

        subgraph "Database Config"
            DB1[database/seed-data.sql<br/>Initial data]
        end
    end

    subgraph "Runtime"
        APP[Application]
    end

    PKG1 --> TS1
    PKG1 --> NEST1
    PKG1 --> ES1
    PKG1 --> PR1

    TS1 --> TS2

    ENV1 -.->|configura| APP
    TS1 -.->|compila| APP
    NEST1 -.->|genera| APP
    ES1 -.->|valida| APP
    PR1 -.->|formatea| APP
    DB1 -.->|inicializa| APP

    style PKG1 fill:#e74c3c,color:#fff
    style ENV1 fill:#2ecc71,color:#fff
    style TS1 fill:#3178c6,color:#fff
    style NEST1 fill:#e74c3c,color:#fff
```

---

## 🎯 Paquetes por Responsabilidad

```mermaid
graph TB
    subgraph "Business Packages"
        BP1[company<br/>Gestión empresarial]
        BP2[customer<br/>Gestión de clientes]
        BP3[invoice<br/>Facturación]
        BP4[invoice-detail<br/>Líneas de factura]
        BP5[payment<br/>Gestión de pagos]
    end

    subgraph "Security Packages"
        SP1[user<br/>Autenticación<br/>Autorización]
        SP2[bcrypt<br/>Hash de contraseñas]
    end

    subgraph "Data Packages"
        DP1[database<br/>Configuración BD]
        DP2[entities<br/>Modelos de datos]
        DP3[dto<br/>Data Transfer Objects]
    end

    subgraph "Utility Packages"
        UP1[types<br/>Tipos y Enums]
        UP2[validators<br/>Validaciones]
        UP3[transformers<br/>Transformaciones]
    end

    subgraph "UI Packages"
        UI1[home<br/>Interfaz web]
        UI2[views<br/>Templates]
        UI3[public<br/>Recursos estáticos]
    end

    subgraph "API Packages"
        API1[api<br/>Info de API]
        API2[swagger<br/>Documentación]
    end

    subgraph "Quality Packages"
        QP1[test<br/>Pruebas]
        QP2[eslint<br/>Linting]
        QP3[prettier<br/>Formateo]
    end

    BP1 --> DP1
    BP2 --> DP1
    BP3 --> DP1
    BP4 --> DP1
    BP5 --> DP1
    SP1 --> DP1

    BP1 --> UP1
    BP3 --> UP1
    BP5 --> UP1
    SP1 --> UP1

    BP1 --> DP3
    BP2 --> DP3
    BP3 --> DP3
    BP4 --> DP3
    BP5 --> DP3
    SP1 --> DP3

    DP3 --> UP2
    DP3 --> UP3

    UI1 --> UI2
    UI1 --> UI3

    API2 --> BP1
    API2 --> BP2
    API2 --> BP3
    API2 --> BP4
    API2 --> BP5
    API2 --> SP1

    QP1 -.->|prueba| BP1
    QP1 -.->|prueba| BP2
    QP1 -.->|prueba| BP3
    QP1 -.->|prueba| BP4
    QP1 -.->|prueba| BP5
    QP1 -.->|prueba| SP1

    style BP1 fill:#3498db,color:#fff
    style SP1 fill:#e74c3c,color:#fff
    style DP1 fill:#f39c12,color:#fff
    style UP1 fill:#9b59b6,color:#fff
    style UI1 fill:#1abc9c,color:#fff
    style QP1 fill:#95a5a6,color:#fff
```

---

## 📈 Métricas de Paquetes

```mermaid
graph LR
    subgraph "Módulos de Negocio"
        M1[company: 6 archivos]
        M2[customer: 6 archivos]
        M3[invoice: 6 archivos]
        M4[invoice-detail: 6 archivos]
        M5[payment: 6 archivos]
        M6[user: 5 archivos]
    end

    subgraph "Módulos de Infraestructura"
        I1[database: 2 archivos]
        I2[home: 2 archivos]
        I3[api: 2 archivos]
    end

    subgraph "Paquetes Compartidos"
        S1[types: 3 archivos]
    end

    subgraph "Pruebas"
        T1[test: 17+ archivos]
    end

    subgraph "Configuración"
        C1[config: 8+ archivos]
    end

    subgraph "Total"
        TOTAL[~70+ archivos TypeScript<br/>~20+ archivos de configuración<br/>~15+ archivos de prueba]
    end

    M1 --> TOTAL
    M2 --> TOTAL
    M3 --> TOTAL
    M4 --> TOTAL
    M5 --> TOTAL
    M6 --> TOTAL
    I1 --> TOTAL
    I2 --> TOTAL
    I3 --> TOTAL
    S1 --> TOTAL
    T1 --> TOTAL
    C1 --> TOTAL

    style TOTAL fill:#e74c3c,color:#fff
```

---

## 🔄 Flujo de Dependencias de Paquetes

```mermaid
graph TD
    START["main.ts<br/>Entry Point"]
    APP_MOD[AppModule]
    CONFIG["ConfigModule<br/>@nestjs/config"]
    TYPEORM_MOD["TypeOrmModule<br/>@nestjs/typeorm"]
    DB_CONFIG["DatabaseModule<br/>Configuration"]
    FEATURE_MODS[Feature Modules]
    
    COMP_MOD[CompanyModule]
    CUST_MOD[CustomerModule]
    INV_MOD[InvoiceModule]
    DET_MOD[InvoiceDetailModule]
    PAY_MOD[PaymentModule]
    USER_MOD[UserModule]
    
    COMP_REPO["CompanyRepository<br/>TypeORM"]
    CUST_REPO["CustomerRepository<br/>TypeORM"]
    INV_REPO["InvoiceRepository<br/>TypeORM"]
    DET_REPO["InvoiceDetailRepository<br/>TypeORM"]
    PAY_REPO["PaymentRepository<br/>TypeORM"]
    USER_REPO["UserRepository<br/>TypeORM"]
    
    PG["PostgreSQL Driver<br/>pg"]
    POSTGRES[("PostgreSQL 16")]
    
    SWAGGER["SwaggerModule<br/>@nestjs/swagger"]
    HBS_ENGINE["Handlebars Engine<br/>hbs"]
    
    START --> APP_MOD
    APP_MOD --> CONFIG
    APP_MOD --> TYPEORM_MOD
    TYPEORM_MOD --> DB_CONFIG
    APP_MOD --> FEATURE_MODS
    
    FEATURE_MODS --> COMP_MOD
    FEATURE_MODS --> CUST_MOD
    FEATURE_MODS --> INV_MOD
    FEATURE_MODS --> DET_MOD
    FEATURE_MODS --> PAY_MOD
    FEATURE_MODS --> USER_MOD
    
    COMP_MOD --> COMP_REPO
    CUST_MOD --> CUST_REPO
    INV_MOD --> INV_REPO
    DET_MOD --> DET_REPO
    PAY_MOD --> PAY_REPO
    USER_MOD --> USER_REPO
    
    COMP_REPO --> PG
    CUST_REPO --> PG
    INV_REPO --> PG
    DET_REPO --> PG
    PAY_REPO --> PG
    USER_REPO --> PG
    
    PG --> POSTGRES
    APP_MOD --> SWAGGER
    APP_MOD --> HBS_ENGINE

    style START fill:#e74c3c,color:#fff
    style APP_MOD fill:#e74c3c,color:#fff
    style POSTGRES fill:#336791,color:#fff
    style SWAGGER fill:#85ea2d,color:#000
```

---

## 📦 Resumen de Paquetes

| Categoría | Paquetes | Descripción |
|-----------|----------|-------------|
| **Negocio** | company, customer, invoice, invoice-detail, payment, user | Lógica de dominio y casos de uso |
| **Infraestructura** | database, config | Configuración de base de datos y entorno |
| **Presentación** | home, api, views, public | Interfaz web y API REST |
| **Compartido** | types | Tipos, enums e interfaces compartidas |
| **Validación** | dto | Data Transfer Objects con validaciones |
| **Datos** | entities | Modelos de TypeORM |
| **Pruebas** | test | Pruebas unitarias y E2E |
| **Configuración** | config files | Archivos de configuración del proyecto |

---

## 🎨 Convenciones de Paquetes

### Estructura de un Paquete de Dominio:
```
<feature>/
├── <feature>.module.ts          # Módulo NestJS
├── <feature>.controller.ts      # Controlador REST
├── <feature>.service.ts         # Lógica de negocio
├── <feature>.controller.spec.ts # Pruebas unitarias controlador
├── <feature>.service.spec.ts    # Pruebas unitarias servicio
├── dto/
│   ├── create-<feature>.dto.ts  # DTO de creación
│   └── update-<feature>.dto.ts  # DTO de actualización
└── entities/
    └── <feature>.entity.ts      # Entidad TypeORM
```

### Principios de Diseño:
- **Alta Cohesión**: Cada paquete agrupa elementos relacionados
- **Bajo Acoplamiento**: Dependencias mínimas entre paquetes
- **Separación de Responsabilidades**: Cada paquete tiene un propósito único
- **Reutilización**: Paquetes compartidos para código común
- **Testabilidad**: Cada paquete es independientemente testeable

---

## 🔍 Cómo Visualizar estos Diagramas

### Opción 1: GitHub / GitLab
Los diagramas Mermaid se renderizan automáticamente en GitHub y GitLab.

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

**Generado:** 4 de Noviembre, 2025  
**Proyecto:** API-Factus  
**Versión:** 1.0.0  
**Arquitectura:** NestJS + TypeORM + PostgreSQL
