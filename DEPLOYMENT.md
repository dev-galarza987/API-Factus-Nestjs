# 🚀 Diagrama de Despliegue - API-Factus

Este documento contiene el diagrama de despliegue que muestra la arquitectura física del sistema de facturación API-Factus, incluyendo servidores, servicios cloud y componentes de infraestructura.

---

## 📋 Información de Despliegue

### Infraestructura Cloud
- **Servidor de Aplicación:** 2x AWS EC2 (Alta Disponibilidad)
- **Base de Datos:** PostgreSQL en Supabase
- **Cliente:** UI Web Externa (Frontend)

### Tecnologías
- **Backend:** NestJS + TypeScript
- **ORM:** TypeORM
- **Runtime:** Node.js 18+
- **Database:** PostgreSQL 16
- **Cloud Provider:** AWS + Supabase

---

## 🌐 Diagrama de Despliegue Principal

```mermaid
graph TB
    subgraph INTERNET["🌐 Internet"]
        CLIENT["💻 UI Web Externa<br/>React/Vue/Angular<br/>Browser"]
    end
    
    subgraph AWS["☁️ AWS Cloud"]
        subgraph LOAD_BALANCER["⚖️ Load Balancer"]
            ALB["AWS Application<br/>Load Balancer<br/>Port 443/HTTPS"]
        end
        
        subgraph AZ1["📍 Availability Zone 1<br/>us-east-1a"]
            subgraph EC2_1["🖥️ EC2 Instance 1<br/>t3.medium<br/>2 vCPU, 4GB RAM"]
                APP1["🚀 API-Factus<br/>NestJS Application<br/>Port 4500"]
                NODE1["⚙️ Node.js 18.x<br/>Runtime"]
                PM2_1["🔄 PM2<br/>Process Manager"]
            end
        end
        
        subgraph AZ2["📍 Availability Zone 2<br/>us-east-1b"]
            subgraph EC2_2["🖥️ EC2 Instance 2<br/>t3.medium<br/>2 vCPU, 4GB RAM"]
                APP2["🚀 API-Factus<br/>NestJS Application<br/>Port 4500"]
                NODE2["⚙️ Node.js 18.x<br/>Runtime"]
                PM2_2["🔄 PM2<br/>Process Manager"]
            end
        end
        
        subgraph SG["🔒 Security Groups"]
            SG1["SG-API<br/>Inbound: 4500<br/>Outbound: 5432"]
        end
    end
    
    subgraph SUPABASE["☁️ Supabase Cloud"]
        subgraph DB_SERVICE["💾 Database Service"]
            POSTGRES["🐘 PostgreSQL 16<br/>Managed Database<br/>Port 5432"]
            POOLER["🔄 Connection Pooler<br/>PgBouncer"]
            BACKUP["💿 Automated Backups<br/>Point-in-time Recovery"]
        end
        
        subgraph SUPA_FEATURES["✨ Supabase Features"]
            AUTH_SUPA["🔐 Auth (opcional)"]
            STORAGE["📦 Storage (opcional)"]
            REALTIME["⚡ Realtime (opcional)"]
        end
    end
    
    subgraph MONITORING["📊 Monitoring & Logs"]
        CW["📈 CloudWatch<br/>Metrics & Logs"]
        SUPA_DASH["📊 Supabase Dashboard<br/>DB Metrics"]
    end

    %% Conexiones principales
    CLIENT -->|"HTTPS<br/>REST API Calls"| ALB
    ALB -->|"HTTP<br/>Load Balancing"| APP1
    ALB -->|"HTTP<br/>Load Balancing"| APP2
    
    %% Conexiones internas EC2
    APP1 -.->|runs on| NODE1
    NODE1 -.->|managed by| PM2_1
    APP2 -.->|runs on| NODE2
    NODE2 -.->|managed by| PM2_2
    
    %% Conexiones a base de datos
    APP1 -->|"TCP 5432<br/>TypeORM<br/>SSL/TLS"| POOLER
    APP2 -->|"TCP 5432<br/>TypeORM<br/>SSL/TLS"| POOLER
    POOLER -->|"Connection Pool"| POSTGRES
    
    %% Seguridad
    EC2_1 -.->|protected by| SG1
    EC2_2 -.->|protected by| SG1
    
    %% Backups
    POSTGRES -.->|"Automatic"| BACKUP
    
    %% Monitoring
    APP1 -.->|logs & metrics| CW
    APP2 -.->|logs & metrics| CW
    POSTGRES -.->|metrics| SUPA_DASH
    
    style CLIENT fill:#e1f5ff
    style ALB fill:#ff9800
    style EC2_1 fill:#232f3e
    style EC2_2 fill:#232f3e
    style APP1 fill:#e74c3c,color:#fff
    style APP2 fill:#e74c3c,color:#fff
    style POSTGRES fill:#336791,color:#fff
    style POOLER fill:#2ecc71,color:#fff
    style BACKUP fill:#95a5a6,color:#fff
```

---

## 🏗️ Arquitectura de Alta Disponibilidad

```mermaid
graph TB
    subgraph USERS["👥 Usuarios"]
        WEB["💻 Web UI<br/>https://app.factus.com"]
        MOBILE["📱 Mobile App<br/>(futuro)"]
    end
    
    subgraph DNS["🌐 DNS"]
        R53["Route 53<br/>DNS Service<br/>factus-api.com"]
    end
    
    subgraph AWS_HA["☁️ AWS - High Availability"]
        subgraph LB["Load Balancer"]
            ALB_HA["Application LB<br/>Health Checks<br/>SSL Termination"]
        end
        
        subgraph ZONE_A["AZ-1a"]
            EC2_A["EC2 Instance A<br/>10.0.1.10<br/>Status: Running"]
        end
        
        subgraph ZONE_B["AZ-1b"]
            EC2_B["EC2 Instance B<br/>10.0.2.10<br/>Status: Running"]
        end
        
        subgraph AUTO["Auto Scaling"]
            ASG["Auto Scaling Group<br/>Min: 2<br/>Max: 4<br/>Desired: 2"]
        end
    end
    
    subgraph SUPABASE_HA["☁️ Supabase - Database"]
        subgraph PRIMARY["Primary Region"]
            DB_MAIN["PostgreSQL Primary<br/>Read/Write<br/>us-east-1"]
        end
        
        subgraph REPLICA["Read Replicas"]
            DB_READ1["Read Replica 1<br/>Read Only"]
            DB_READ2["Read Replica 2<br/>Read Only"]
        end
    end
    
    WEB --> R53
    MOBILE -.-> R53
    R53 --> ALB_HA
    ALB_HA -->|"Health: OK"| EC2_A
    ALB_HA -->|"Health: OK"| EC2_B
    
    ASG -.->|"Manages"| EC2_A
    ASG -.->|"Manages"| EC2_B
    
    EC2_A -->|"Write Operations"| DB_MAIN
    EC2_B -->|"Write Operations"| DB_MAIN
    
    EC2_A -.->|"Read Operations"| DB_READ1
    EC2_B -.->|"Read Operations"| DB_READ2
    
    DB_MAIN -.->|"Replication"| DB_READ1
    DB_MAIN -.->|"Replication"| DB_READ2
    
    style WEB fill:#61dafb
    style ALB_HA fill:#ff9800
    style EC2_A fill:#232f3e,color:#fff
    style EC2_B fill:#232f3e,color:#fff
    style DB_MAIN fill:#336791,color:#fff
    style DB_READ1 fill:#5499c7,color:#fff
    style DB_READ2 fill:#5499c7,color:#fff
```

---

## 🔧 Componentes de EC2

```mermaid
graph TB
    subgraph EC2["🖥️ EC2 Instance (Amazon Linux 2)"]
        subgraph OS["Operating System Layer"]
            LINUX["Amazon Linux 2<br/>Kernel 5.10"]
            SECURITY["Security Updates<br/>Firewall: iptables"]
        end
        
        subgraph RUNTIME["Runtime Environment"]
            NODE["Node.js 18.19.0<br/>npm 10.2.3"]
            GLOBAL["Global Packages:<br/>- pm2<br/>- typescript"]
        end
        
        subgraph APP_LAYER["Application Layer"]
            NESTJS["NestJS Application<br/>Port: 4500"]
            TYPEORM["TypeORM<br/>Connection Pool"]
            MODULES["Módulos:<br/>- Company<br/>- Customer<br/>- Invoice<br/>- Payment<br/>- User"]
        end
        
        subgraph PROCESS["Process Management"]
            PM2["PM2 Daemon<br/>Cluster Mode<br/>Instances: 2"]
            LOGS["Logs:<br/>/var/log/api-factus/"]
        end
        
        subgraph CONFIG["Configuration"]
            ENV[".env<br/>Environment Variables"]
            PACKAGE["package.json<br/>Dependencies"]
        end
        
        subgraph MONITOR["Monitoring"]
            CW_AGENT["CloudWatch Agent<br/>Metrics & Logs"]
            HEALTH["Health Check<br/>/api/v1/health"]
        end
    end
    
    LINUX --> NODE
    NODE --> NESTJS
    NESTJS --> TYPEORM
    NESTJS --> MODULES
    PM2 --> NESTJS
    ENV -.-> NESTJS
    PACKAGE -.-> NODE
    CW_AGENT -.-> PM2
    HEALTH -.-> NESTJS
    LOGS -.-> CW_AGENT
    
    style EC2 fill:#232f3e,color:#fff
    style NESTJS fill:#e74c3c,color:#fff
    style NODE fill:#68a063,color:#fff
    style PM2 fill:#2b5797,color:#fff
```

---

## 💾 Arquitectura de Base de Datos Supabase

```mermaid
graph TB
    subgraph SUPA["☁️ Supabase Platform"]
        subgraph API_LAYER["API Layer"]
            REST_API["PostgREST<br/>Auto-generated REST API"]
            GRAPHQL["GraphQL API<br/>(opcional)"]
        end
        
        subgraph AUTH_LAYER["Authentication"]
            GOTRUE["GoTrue<br/>Auth Service"]
            JWT["JWT Tokens"]
        end
        
        subgraph DB_LAYER["Database Layer"]
            POSTGRES_MAIN["🐘 PostgreSQL 16<br/>Primary Database"]
            EXTENSIONS["Extensions:<br/>- uuid-ossp<br/>- pgcrypto<br/>- pg_stat_statements"]
        end
        
        subgraph CONNECTION["Connection Management"]
            PGBOUNCER["PgBouncer<br/>Connection Pooler<br/>Max Connections: 1000"]
            POOL_MODE["Pool Mode: Transaction<br/>Default Pool Size: 15"]
        end
        
        subgraph STORAGE_LAYER["Storage"]
            FILE_STORAGE["File Storage<br/>S3-compatible"]
        end
        
        subgraph BACKUP_LAYER["Backup & Recovery"]
            DAILY_BACKUP["Daily Backups<br/>Retention: 7 days"]
            PITR["Point-in-Time Recovery<br/>Up to 7 days"]
        end
        
        subgraph MONITORING_LAYER["Monitoring"]
            METRICS["Database Metrics<br/>CPU, Memory, Disk"]
            QUERY_PERF["Query Performance<br/>Slow Query Log"]
        end
    end
    
    subgraph EXTERNAL["External Connections"]
        API_FACTUS["API-Factus<br/>TypeORM Client"]
    end
    
    API_FACTUS -->|"SSL/TLS<br/>Port 5432"| PGBOUNCER
    PGBOUNCER --> POSTGRES_MAIN
    POSTGRES_MAIN -.-> EXTENSIONS
    POSTGRES_MAIN -.-> DAILY_BACKUP
    DAILY_BACKUP -.-> PITR
    POSTGRES_MAIN -.-> METRICS
    POSTGRES_MAIN -.-> QUERY_PERF
    
    style POSTGRES_MAIN fill:#336791,color:#fff
    style PGBOUNCER fill:#2ecc71,color:#fff
    style API_FACTUS fill:#e74c3c,color:#fff
    style DAILY_BACKUP fill:#95a5a6,color:#fff
```

---

## 🔒 Seguridad y Networking

```mermaid
graph TB
    subgraph INTERNET_ZONE["🌐 Internet Zone"]
        USERS["Users<br/>HTTPS Traffic"]
    end
    
    subgraph AWS_VPC["☁️ AWS VPC (10.0.0.0/16)"]
        subgraph PUBLIC_SUBNET["Public Subnet (10.0.1.0/24)"]
            IGW["Internet Gateway"]
            NAT["NAT Gateway"]
            ALB_SEC["Application LB<br/>Security Group:<br/>Inbound: 443<br/>Outbound: Any"]
        end
        
        subgraph PRIVATE_SUBNET_1["Private Subnet 1 (10.0.10.0/24)"]
            EC2_SEC_1["EC2 Instance 1<br/>Security Group:<br/>Inbound: 4500 (from ALB)<br/>Outbound: 5432 (to Supabase)<br/>Outbound: 443 (for updates)"]
        end
        
        subgraph PRIVATE_SUBNET_2["Private Subnet 2 (10.0.20.0/24)"]
            EC2_SEC_2["EC2 Instance 2<br/>Security Group:<br/>Inbound: 4500 (from ALB)<br/>Outbound: 5432 (to Supabase)<br/>Outbound: 443 (for updates)"]
        end
        
        subgraph NACL["Network ACL"]
            RULES["Rules:<br/>- Allow HTTP/HTTPS in<br/>- Allow PostgreSQL out<br/>- Deny all by default"]
        end
    end
    
    subgraph SUPABASE_NET["☁️ Supabase Network"]
        DB_FIREWALL["Database Firewall<br/>Allowed IPs:<br/>- EC2 Instance 1 IP<br/>- EC2 Instance 2 IP"]
        SSL_TLS["SSL/TLS Encryption<br/>Certificate Validation"]
    end
    
    USERS -->|"HTTPS:443"| ALB_SEC
    ALB_SEC -->|"HTTP:4500"| EC2_SEC_1
    ALB_SEC -->|"HTTP:4500"| EC2_SEC_2
    
    EC2_SEC_1 -->|"TLS:5432"| DB_FIREWALL
    EC2_SEC_2 -->|"TLS:5432"| DB_FIREWALL
    DB_FIREWALL -->|"Encrypted"| SSL_TLS
    
    IGW -.->|"Route"| ALB_SEC
    NAT -.->|"Outbound"| EC2_SEC_1
    NAT -.->|"Outbound"| EC2_SEC_2
    
    NACL -.->|"Controls"| PRIVATE_SUBNET_1
    NACL -.->|"Controls"| PRIVATE_SUBNET_2
    
    style USERS fill:#e1f5ff
    style ALB_SEC fill:#ff9800
    style EC2_SEC_1 fill:#232f3e,color:#fff
    style EC2_SEC_2 fill:#232f3e,color:#fff
    style DB_FIREWALL fill:#e74c3c,color:#fff
    style SSL_TLS fill:#2ecc71,color:#fff
```

---

## 🔄 Flujo de Despliegue CI/CD

```mermaid
graph LR
    subgraph DEV["👨‍💻 Desarrollo"]
        CODE["Código Fuente<br/>GitHub Repository"]
        COMMIT["Git Commit<br/>Push to main"]
    end
    
    subgraph CI["🔨 Continuous Integration"]
        GH_ACTIONS["GitHub Actions<br/>Workflow"]
        BUILD["Build:<br/>- npm install<br/>- npm run build<br/>- npm test"]
        LINT["Lint & Format:<br/>- ESLint<br/>- Prettier"]
    end
    
    subgraph CD["🚀 Continuous Deployment"]
        ARTIFACT["Build Artifact<br/>dist/ folder"]
        DEPLOY["Deploy Script<br/>SSH to EC2"]
    end
    
    subgraph PROD["☁️ Producción"]
        EC2_DEPLOY_1["EC2 Instance 1<br/>1. Stop PM2<br/>2. Update code<br/>3. Install deps<br/>4. Start PM2"]
        EC2_DEPLOY_2["EC2 Instance 2<br/>1. Stop PM2<br/>2. Update code<br/>3. Install deps<br/>4. Start PM2"]
        HEALTH_CHECK["Health Check<br/>Verify endpoints"]
    end
    
    subgraph ROLLBACK["⏪ Rollback"]
        PREVIOUS["Previous Version<br/>Backup available"]
    end
    
    CODE --> COMMIT
    COMMIT --> GH_ACTIONS
    GH_ACTIONS --> BUILD
    BUILD --> LINT
    LINT --> ARTIFACT
    ARTIFACT --> DEPLOY
    
    DEPLOY -->|"Sequential Deploy"| EC2_DEPLOY_1
    EC2_DEPLOY_1 --> HEALTH_CHECK
    HEALTH_CHECK -->|"Success"| EC2_DEPLOY_2
    EC2_DEPLOY_2 --> HEALTH_CHECK
    
    HEALTH_CHECK -.->|"Failure"| PREVIOUS
    PREVIOUS -.->|"Restore"| EC2_DEPLOY_1
    
    style CODE fill:#f39c12
    style BUILD fill:#3498db,color:#fff
    style ARTIFACT fill:#2ecc71,color:#fff
    style EC2_DEPLOY_1 fill:#232f3e,color:#fff
    style EC2_DEPLOY_2 fill:#232f3e,color:#fff
    style PREVIOUS fill:#e74c3c,color:#fff
```

---

## 📊 Especificaciones Técnicas

### EC2 Instances
| Característica | Valor |
|----------------|-------|
| **Tipo de Instancia** | t3.medium |
| **vCPU** | 2 |
| **RAM** | 4 GB |
| **Almacenamiento** | 20 GB gp3 SSD |
| **Sistema Operativo** | Amazon Linux 2 |
| **Cantidad** | 2 (Alta Disponibilidad) |
| **Zonas** | us-east-1a, us-east-1b |

### Supabase PostgreSQL
| Característica | Valor |
|----------------|-------|
| **Versión** | PostgreSQL 16 |
| **Tipo de Servicio** | Managed Database |
| **Almacenamiento** | 8 GB (inicial) |
| **Conexiones Máximas** | 1000 (con PgBouncer) |
| **Backup** | Diario, retención 7 días |
| **PITR** | Point-in-Time Recovery (7 días) |
| **Región** | us-east-1 |

### Application Load Balancer
| Característica | Valor |
|----------------|-------|
| **Tipo** | Application Load Balancer |
| **Protocolo** | HTTPS (443) → HTTP (4500) |
| **Health Check** | GET /api/v1/health |
| **Health Check Interval** | 30 segundos |
| **Healthy Threshold** | 2 |
| **Unhealthy Threshold** | 2 |

### Network Configuration
| Característica | Valor |
|----------------|-------|
| **VPC CIDR** | 10.0.0.0/16 |
| **Public Subnet** | 10.0.1.0/24 |
| **Private Subnet 1** | 10.0.10.0/24 |
| **Private Subnet 2** | 10.0.20.0/24 |
| **NAT Gateway** | 1 por zona |

---

## 🌍 Comunicación entre Componentes

```mermaid
sequenceDiagram
    participant User as 👤 Usuario Web
    participant ALB as ⚖️ Load Balancer
    participant EC2_1 as 🖥️ EC2 Instance 1
    participant EC2_2 as 🖥️ EC2 Instance 2
    participant Pool as 🔄 PgBouncer
    participant DB as 💾 PostgreSQL

    User->>ALB: HTTPS Request<br/>GET /api/v1/invoice
    activate ALB
    
    ALB->>ALB: Health Check<br/>Select healthy instance
    
    alt Instance 1 available
        ALB->>EC2_1: HTTP Request<br/>Port 4500
        activate EC2_1
        EC2_1->>Pool: Query via TypeORM<br/>TLS Port 5432
        activate Pool
        Pool->>DB: Execute Query<br/>Connection from pool
        activate DB
        DB-->>Pool: Result Set
        deactivate DB
        Pool-->>EC2_1: Query Result
        deactivate Pool
        EC2_1-->>ALB: JSON Response
        deactivate EC2_1
    else Instance 2 available
        ALB->>EC2_2: HTTP Request<br/>Port 4500
        activate EC2_2
        EC2_2->>Pool: Query via TypeORM<br/>TLS Port 5432
        activate Pool
        Pool->>DB: Execute Query<br/>Connection from pool
        activate DB
        DB-->>Pool: Result Set
        deactivate DB
        Pool-->>EC2_2: Query Result
        deactivate Pool
        EC2_2-->>ALB: JSON Response
        deactivate EC2_2
    end
    
    ALB-->>User: HTTPS Response<br/>200 OK + Data
    deactivate ALB
```

---

## 📈 Escalabilidad y Rendimiento

### Capacidad Actual
- **Usuarios Concurrentes:** ~500-1000
- **Requests por segundo:** ~100-200 RPS
- **Latencia promedio:** <100ms
- **Disponibilidad:** 99.5%

### Escalabilidad Horizontal
```mermaid
graph LR
    CURRENT["Configuración Actual<br/>2 EC2 Instances<br/>4 vCPU total<br/>8 GB RAM total"]
    
    SCALE_UP["Escalar a 4 Instancias<br/>8 vCPU total<br/>16 GB RAM total<br/>Soporta: 2000+ usuarios"]
    
    SCALE_MORE["Escalar a 6+ Instancias<br/>Auto Scaling<br/>12+ vCPU<br/>24+ GB RAM<br/>Soporta: 5000+ usuarios"]
    
    CURRENT -->|"Carga alta"| SCALE_UP
    SCALE_UP -->|"Demanda mayor"| SCALE_MORE
    
    style CURRENT fill:#3498db,color:#fff
    style SCALE_UP fill:#2ecc71,color:#fff
    style SCALE_MORE fill:#e74c3c,color:#fff
```

### Optimizaciones de Base de Datos
- **Connection Pooling:** PgBouncer (1000 conexiones)
- **Read Replicas:** Para consultas de solo lectura
- **Índices:** Optimizados en tablas principales
- **Query Optimization:** Análisis con pg_stat_statements

---

## 🔍 Monitoreo y Alertas

```mermaid
graph TB
    subgraph SOURCES["📡 Fuentes de Datos"]
        EC2_METRICS["EC2 Metrics<br/>CPU, Memory, Disk"]
        APP_LOGS["Application Logs<br/>PM2, NestJS"]
        DB_METRICS["Database Metrics<br/>Connections, Queries"]
        ALB_METRICS["ALB Metrics<br/>Requests, Targets"]
    end
    
    subgraph COLLECTION["📊 Recolección"]
        CW_AGENT["CloudWatch Agent"]
        SUPA_MON["Supabase Monitoring"]
    end
    
    subgraph ANALYSIS["🔍 Análisis"]
        CW_DASHBOARDS["CloudWatch Dashboards"]
        SUPA_DASH["Supabase Dashboard"]
        LOG_INSIGHTS["CloudWatch Log Insights"]
    end
    
    subgraph ALERTS["🚨 Alertas"]
        SNS["SNS Topics"]
        EMAIL["Email Notifications"]
        SLACK["Slack Webhooks"]
    end
    
    EC2_METRICS --> CW_AGENT
    APP_LOGS --> CW_AGENT
    ALB_METRICS --> CW_AGENT
    DB_METRICS --> SUPA_MON
    
    CW_AGENT --> CW_DASHBOARDS
    CW_AGENT --> LOG_INSIGHTS
    SUPA_MON --> SUPA_DASH
    
    CW_DASHBOARDS -.->|"Threshold exceeded"| SNS
    LOG_INSIGHTS -.->|"Error pattern"| SNS
    SUPA_DASH -.->|"DB alert"| SNS
    
    SNS --> EMAIL
    SNS --> SLACK
    
    style CW_DASHBOARDS fill:#ff9800
    style SUPA_DASH fill:#2ecc71,color:#fff
    style SNS fill:#e74c3c,color:#fff
```

---

## 💰 Estimación de Costos Mensuales

| Servicio | Especificación | Costo Mensual (USD) |
|----------|----------------|---------------------|
| **EC2 Instances** | 2x t3.medium (on-demand) | ~$60 |
| **EBS Storage** | 2x 20GB gp3 | ~$4 |
| **Application Load Balancer** | 1 ALB | ~$22 |
| **Data Transfer** | ~100 GB/month | ~$9 |
| **CloudWatch** | Logs + Metrics | ~$10 |
| **Supabase PostgreSQL** | Free tier / Pro | $0 - $25 |
| **NAT Gateway** | 2 NAT (opcional) | ~$64 |
| **Route 53** | Hosted Zone + Queries | ~$2 |
| **Total Estimado** | | **~$171 - $196** |

*Nota: Precios aproximados, pueden variar según región y uso real*

---

## 🔧 Scripts de Despliegue

### deploy.sh (Deployment Script)
```bash
#!/bin/bash
# API-Factus Deployment Script

# Variables
APP_DIR="/home/ec2-user/api-factus"
REPO_URL="git@github.com:dev-galarza987/API-Factus-Nestjs.git"
BRANCH="main"

echo "🚀 Starting deployment..."

# Backup current version
echo "📦 Creating backup..."
cp -r $APP_DIR $APP_DIR-backup-$(date +%Y%m%d_%H%M%S)

# Pull latest code
echo "📥 Pulling latest code..."
cd $APP_DIR
git pull origin $BRANCH

# Install dependencies
echo "📚 Installing dependencies..."
npm ci --production

# Build application
echo "🔨 Building application..."
npm run build

# Restart PM2
echo "🔄 Restarting application..."
pm2 restart api-factus

# Health check
echo "🏥 Running health check..."
sleep 5
curl -f http://localhost:4500/api/v1/health || exit 1

echo "✅ Deployment completed successfully!"
```

### ecosystem.config.js (PM2 Configuration)
```javascript
module.exports = {
  apps: [{
    name: 'api-factus',
    script: './dist/main.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4500
    },
    error_file: '/var/log/api-factus/error.log',
    out_file: '/var/log/api-factus/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M',
    autorestart: true,
    watch: false
  }]
};
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

---

**Generado:** 5 de Noviembre, 2025  
**Proyecto:** API-Factus  
**Versión:** 1.0.0  
**Infraestructura:** AWS EC2 + Supabase PostgreSQL  
**Alta Disponibilidad:** Multi-AZ Deployment
