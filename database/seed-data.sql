-- ==========================================
-- SCRIPT DE INSERCIÓN DE DATOS DE EJEMPLO
-- Sistema de Facturación API-Factus
-- ==========================================

-- Limpiar datos existentes (opcional - comentar si no se desea)
-- DELETE FROM payment;
-- DELETE FROM invoice_detail;
-- DELETE FROM invoice;
-- DELETE FROM customer;
-- DELETE FROM company;

-- ==========================================
-- 1. INSERTAR EMPRESAS (COMPANY)
-- ==========================================

INSERT INTO company (id_company, business_name, tax_id, email, address) VALUES
-- Empresa 1: Empresa de Tecnología
(
  'a1b2c3d4-e5f6-7890-abcd-111111111111',
  'Tech Solutions S.A.C.',
  '20123456789',
  'contacto@techsolutions.com',
  'Av. Javier Prado 123, San Isidro, Lima, Perú'
),
-- Empresa 2: Empresa de Consultoría
(
  'a1b2c3d4-e5f6-7890-abcd-222222222222',
  'Consultoría Global Perú S.A.',
  '20987654321',
  'info@consultoriaglobal.com.pe',
  'Calle Los Negocios 456, Miraflores, Lima, Perú'
),
-- Empresa 3: Empresa de Retail
(
  'a1b2c3d4-e5f6-7890-abcd-333333333333',
  'Comercial del Sur E.I.R.L.',
  '20555666777',
  'ventas@comercialdelsur.com',
  'Jr. Comercio 789, Arequipa, Perú'
);

-- ==========================================
-- 2. INSERTAR CLIENTES (CUSTOMER)
-- ==========================================

INSERT INTO customer (id_customer, customer_name, tax_or_id, email) VALUES
-- Cliente 1: Empresa
(
  'b1b2c3d4-e5f6-7890-abcd-111111111111',
  'Corporación Industrial SAC',
  '20111222333',
  'compras@corporacionindustrial.com'
),
-- Cliente 2: Persona Natural con Negocio
(
  'b1b2c3d4-e5f6-7890-abcd-222222222222',
  'Juan Carlos Pérez González',
  '12345678',
  'jcperez@gmail.com'
),
-- Cliente 3: Empresa Mediana
(
  'b1b2c3d4-e5f6-7890-abcd-333333333333',
  'Distribuidora Lima S.R.L.',
  '20444555666',
  'contacto@distrilima.com'
),
-- Cliente 4: Persona Natural
(
  'b1b2c3d4-e5f6-7890-abcd-444444444444',
  'María Fernanda López Torres',
  '87654321',
  'mflopez@hotmail.com'
),
-- Cliente 5: Empresa Grande
(
  'b1b2c3d4-e5f6-7890-abcd-555555555555',
  'Grupo Empresarial del Norte SAC',
  '20777888999',
  'admin@gruponorte.com.pe'
);

-- ==========================================
-- 3. INSERTAR FACTURAS (INVOICE)
-- ==========================================

INSERT INTO invoice (id_invoice, invoice_number, issue_date, total_amount, status, companyId, customerId) VALUES
-- Factura 1: Tech Solutions -> Corporación Industrial (PAGADA)
(
  'c1b2c3d4-e5f6-7890-abcd-111111111111',
  'FAC-2025-0001',
  '2025-01-15 10:30:00',
  15750.00,
  'PAID',
  'a1b2c3d4-e5f6-7890-abcd-111111111111',
  'b1b2c3d4-e5f6-7890-abcd-111111111111'
),
-- Factura 2: Tech Solutions -> Juan Carlos Pérez (PENDIENTE)
(
  'c1b2c3d4-e5f6-7890-abcd-222222222222',
  'FAC-2025-0002',
  '2025-02-20 14:45:00',
  2500.00,
  'PENDING',
  'a1b2c3d4-e5f6-7890-abcd-111111111111',
  'b1b2c3d4-e5f6-7890-abcd-222222222222'
),
-- Factura 3: Consultoría Global -> Distribuidora Lima (PAGADA)
(
  'c1b2c3d4-e5f6-7890-abcd-333333333333',
  'FAC-2025-0003',
  '2025-02-25 09:15:00',
  8500.00,
  'PAID',
  'a1b2c3d4-e5f6-7890-abcd-222222222222',
  'b1b2c3d4-e5f6-7890-abcd-333333333333'
),
-- Factura 4: Comercial del Sur -> María López (PENDIENTE)
(
  'c1b2c3d4-e5f6-7890-abcd-444444444444',
  'FAC-2025-0004',
  '2025-03-01 11:00:00',
  1250.50,
  'PENDING',
  'a1b2c3d4-e5f6-7890-abcd-333333333333',
  'b1b2c3d4-e5f6-7890-abcd-444444444444'
),
-- Factura 5: Tech Solutions -> Grupo Norte (PAGADA)
(
  'c1b2c3d4-e5f6-7890-abcd-555555555555',
  'FAC-2025-0005',
  '2025-03-05 16:20:00',
  32400.00,
  'PAID',
  'a1b2c3d4-e5f6-7890-abcd-111111111111',
  'b1b2c3d4-e5f6-7890-abcd-555555555555'
),
-- Factura 6: Consultoría Global -> Corporación Industrial (CANCELADA)
(
  'c1b2c3d4-e5f6-7890-abcd-666666666666',
  'FAC-2025-0006',
  '2025-03-10 13:30:00',
  5000.00,
  'CANCELLED',
  'a1b2c3d4-e5f6-7890-abcd-222222222222',
  'b1b2c3d4-e5f6-7890-abcd-111111111111'
);

-- ==========================================
-- 4. INSERTAR DETALLES DE FACTURA (INVOICE_DETAIL)
-- ==========================================

-- Detalles de Factura 1 (FAC-2025-0001)
INSERT INTO invoice_detail (id_invoice_detail, description, quantity, unit_price, subtotal, invoiceId) VALUES
(
  'd1b2c3d4-e5f6-7890-abcd-111111111111',
  'Laptop HP EliteBook 840 G8 - Intel Core i7, 16GB RAM, 512GB SSD',
  5.00,
  2500.00,
  12500.00,
  'c1b2c3d4-e5f6-7890-abcd-111111111111'
),
(
  'd1b2c3d4-e5f6-7890-abcd-111111111112',
  'Mouse Logitech MX Master 3',
  10.00,
  150.00,
  1500.00,
  'c1b2c3d4-e5f6-7890-abcd-111111111111'
),
(
  'd1b2c3d4-e5f6-7890-abcd-111111111113',
  'Teclado Mecánico Logitech MX Keys',
  5.00,
  350.00,
  1750.00,
  'c1b2c3d4-e5f6-7890-abcd-111111111111'
);

-- Detalles de Factura 2 (FAC-2025-0002)
INSERT INTO invoice_detail (id_invoice_detail, description, quantity, unit_price, subtotal, invoiceId) VALUES
(
  'd1b2c3d4-e5f6-7890-abcd-222222222221',
  'Servicio de Desarrollo Web - Página corporativa',
  1.00,
  2500.00,
  2500.00,
  'c1b2c3d4-e5f6-7890-abcd-222222222222'
);

-- Detalles de Factura 3 (FAC-2025-0003)
INSERT INTO invoice_detail (id_invoice_detail, description, quantity, unit_price, subtotal, invoiceId) VALUES
(
  'd1b2c3d4-e5f6-7890-abcd-333333333331',
  'Consultoría en Gestión Empresarial - 40 horas',
  40.00,
  150.00,
  6000.00,
  'c1b2c3d4-e5f6-7890-abcd-333333333333'
),
(
  'd1b2c3d4-e5f6-7890-abcd-333333333332',
  'Auditoría Financiera - Informe completo',
  1.00,
  2500.00,
  2500.00,
  'c1b2c3d4-e5f6-7890-abcd-333333333333'
);

-- Detalles de Factura 4 (FAC-2025-0004)
INSERT INTO invoice_detail (id_invoice_detail, description, quantity, unit_price, subtotal, invoiceId) VALUES
(
  'd1b2c3d4-e5f6-7890-abcd-444444444441',
  'Impresora Multifuncional Epson L3250',
  1.00,
  850.00,
  850.00,
  'c1b2c3d4-e5f6-7890-abcd-444444444444'
),
(
  'd1b2c3d4-e5f6-7890-abcd-444444444442',
  'Resma de Papel Bond A4 - Paquete de 10',
  2.00,
  200.25,
  400.50,
  'c1b2c3d4-e5f6-7890-abcd-444444444444'
);

-- Detalles de Factura 5 (FAC-2025-0005)
INSERT INTO invoice_detail (id_invoice_detail, description, quantity, unit_price, subtotal, invoiceId) VALUES
(
  'd1b2c3d4-e5f6-7890-abcd-555555555551',
  'Servidor Dell PowerEdge R740 - 32GB RAM, 2TB HDD',
  2.00,
  12000.00,
  24000.00,
  'c1b2c3d4-e5f6-7890-abcd-555555555555'
),
(
  'd1b2c3d4-e5f6-7890-abcd-555555555552',
  'Switch de Red Cisco 48 puertos Gigabit',
  1.00,
  3500.00,
  3500.00,
  'c1b2c3d4-e5f6-7890-abcd-555555555555'
),
(
  'd1b2c3d4-e5f6-7890-abcd-555555555553',
  'Licencias Microsoft Office 365 Business - 50 usuarios',
  1.00,
  4900.00,
  4900.00,
  'c1b2c3d4-e5f6-7890-abcd-555555555555'
);

-- Detalles de Factura 6 (FAC-2025-0006) - CANCELADA
INSERT INTO invoice_detail (id_invoice_detail, description, quantity, unit_price, subtotal, invoiceId) VALUES
(
  'd1b2c3d4-e5f6-7890-abcd-666666666661',
  'Consultoría Estratégica - Proyecto cancelado',
  20.00,
  250.00,
  5000.00,
  'c1b2c3d4-e5f6-7890-abcd-666666666666'
);

-- ==========================================
-- 5. INSERTAR PAGOS (PAYMENT)
-- ==========================================

-- Pagos de Factura 1 (PAGADA - Total: 15750.00)
INSERT INTO payment (id_payment, payment_method, amount, payment_date, invoiceId) VALUES
(
  'e1b2c3d4-e5f6-7890-abcd-111111111111',
  'BANK_TRANSFER',
  10000.00,
  '2025-01-20 15:30:00',
  'c1b2c3d4-e5f6-7890-abcd-111111111111'
),
(
  'e1b2c3d4-e5f6-7890-abcd-111111111112',
  'BANK_TRANSFER',
  5750.00,
  '2025-01-25 10:15:00',
  'c1b2c3d4-e5f6-7890-abcd-111111111111'
);

-- Pagos de Factura 3 (PAGADA - Total: 8500.00)
INSERT INTO payment (id_payment, payment_method, amount, payment_date, invoiceId) VALUES
(
  'e1b2c3d4-e5f6-7890-abcd-333333333331',
  'CREDIT_CARD',
  8500.00,
  '2025-03-01 11:45:00',
  'c1b2c3d4-e5f6-7890-abcd-333333333333'
);

-- Pagos de Factura 5 (PAGADA - Total: 32400.00)
INSERT INTO payment (id_payment, payment_method, amount, payment_date, invoiceId) VALUES
(
  'e1b2c3d4-e5f6-7890-abcd-555555555551',
  'CHECK',
  15000.00,
  '2025-03-08 14:20:00',
  'c1b2c3d4-e5f6-7890-abcd-555555555555'
),
(
  'e1b2c3d4-e5f6-7890-abcd-555555555552',
  'BANK_TRANSFER',
  17400.00,
  '2025-03-12 09:30:00',
  'c1b2c3d4-e5f6-7890-abcd-555555555555'
);

-- Pago parcial de Factura 2 (PENDIENTE - Total: 2500.00, Pagado: 1000.00)
INSERT INTO payment (id_payment, payment_method, amount, payment_date, invoiceId) VALUES
(
  'e1b2c3d4-e5f6-7890-abcd-222222222221',
  'CASH',
  1000.00,
  '2025-02-22 16:00:00',
  'c1b2c3d4-e5f6-7890-abcd-222222222222'
);

-- ==========================================
-- RESUMEN DE DATOS INSERTADOS
-- ==========================================

-- 3 Empresas (Company)
-- 5 Clientes (Customer)
-- 6 Facturas (Invoice)
--   - 3 PAGADAS
--   - 2 PENDIENTES
--   - 1 CANCELADA
-- 13 Detalles de Factura (InvoiceDetail)
-- 6 Pagos (Payment)
--   - Múltiples métodos de pago
--   - Pagos completos y parciales

-- ==========================================
-- CONSULTAS DE VERIFICACIÓN
-- ==========================================

-- Verificar empresas insertadas
-- SELECT * FROM company ORDER BY business_name;

-- Verificar clientes insertados
-- SELECT * FROM customer ORDER BY customer_name;

-- Verificar facturas con sus relaciones
-- SELECT 
--   i.invoice_number,
--   i.issue_date,
--   i.total_amount,
--   i.status,
--   c.business_name as empresa,
--   cu.customer_name as cliente
-- FROM invoice i
-- INNER JOIN company c ON i."companyId" = c.id_company
-- INNER JOIN customer cu ON i."customerId" = cu.id_customer
-- ORDER BY i.issue_date;

-- Verificar detalles de facturas
-- SELECT 
--   i.invoice_number,
--   id.description,
--   id.quantity,
--   id.unit_price,
--   id.subtotal
-- FROM invoice_detail id
-- INNER JOIN invoice i ON id."invoiceId" = i.id_invoice
-- ORDER BY i.invoice_number;

-- Verificar pagos
-- SELECT 
--   i.invoice_number,
--   p.payment_method,
--   p.amount,
--   p.payment_date
-- FROM payment p
-- INNER JOIN invoice i ON p."invoiceId" = i.id_invoice
-- ORDER BY p.payment_date;

-- Estadísticas por empresa
-- SELECT 
--   c.business_name,
--   COUNT(i.id_invoice) as total_facturas,
--   SUM(i.total_amount) as total_facturado,
--   SUM(CASE WHEN i.status = 'PAID' THEN 1 ELSE 0 END) as facturas_pagadas,
--   SUM(CASE WHEN i.status = 'PENDING' THEN 1 ELSE 0 END) as facturas_pendientes,
--   SUM(CASE WHEN i.status = 'CANCELLED' THEN 1 ELSE 0 END) as facturas_canceladas
-- FROM company c
-- LEFT JOIN invoice i ON c.id_company = i."companyId"
-- GROUP BY c.business_name
-- ORDER BY total_facturado DESC;
