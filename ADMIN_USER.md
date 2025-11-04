# 🔐 Usuario Administrador

## Credenciales por Defecto

El sistema crea automáticamente un usuario administrador al iniciar la aplicación:

```
📧 Email:    admin@factus.com
🔑 Password: galarza987#
👤 Rol:      COMPANY
✅ Estado:   Activo
```

## Características

- **ID fijo**: `admin-0000-0000-0000-000000000001`
- **Creación automática**: Se crea al iniciar la aplicación si no existe
- **Rol COMPANY**: Puede emitir facturas como empresa
- **Contraseña hasheada**: Almacenada con bcrypt (10 rounds)

## Cómo funciona

### 1. Seed Automático (TypeScript)

El servicio `SeedService` se ejecuta automáticamente al iniciar la aplicación (`OnModuleInit`):

```typescript
// src/database/seed.service.ts
async onModuleInit() {
  await this.createAdminUser();
}
```

Este servicio:
- Verifica si existe el usuario `admin@factus.com`
- Si NO existe, lo crea con las credenciales por defecto
- Si YA existe, no hace nada

### 2. Seed Manual (SQL)

También puedes insertar el usuario administrador manualmente ejecutando:

```bash
psql -U postgres -d factus_db -f database/seed-data.sql
```

El archivo `database/seed-data.sql` incluye el INSERT del usuario admin en la sección 0.

## Login

Para iniciar sesión como administrador, usa el endpoint:

```http
POST http://localhost:3000/api/v1/user/auth/login
Content-Type: application/json

{
  "email": "admin@factus.com",
  "password": "galarza987#"
}
```

## Seguridad

⚠️ **IMPORTANTE**: 
- Cambia la contraseña del administrador en producción
- Este usuario tiene permisos completos en el sistema
- La contraseña está hasheada con bcrypt en la base de datos

## Cambiar Contraseña

Para cambiar la contraseña del administrador:

```http
PATCH http://localhost:3000/api/v1/user/admin-0000-0000-0000-000000000001
Content-Type: application/json

{
  "password": "nueva_contraseña_segura"
}
```

La nueva contraseña será hasheada automáticamente por el sistema.
