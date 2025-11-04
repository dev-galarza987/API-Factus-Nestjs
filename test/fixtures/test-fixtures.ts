import { UserRole } from '../../src/types/UserRole';
import { PaymentMethod } from '../../src/types/PaymentMethod';
import { StateInvoice } from '../../src/types/StateInvoice';

export const TestFixtures = {
  // Company fixtures
  companies: {
    valid: {
      businessName: 'Test Company SRL',
      taxId: '123456789',
      email: 'test@company.com',
      address: 'Test Street 123',
      phone: '+591 70123456',
      description: 'Test company description',
    },
    another: {
      businessName: 'Another Company LTDA',
      taxId: '987654321',
      email: 'another@company.com',
      address: 'Another Street 456',
      phone: '+591 70654321',
      description: 'Another test company',
    },
    invalid: {
      businessName: '', // Empty name
      taxId: '123456789',
      email: 'invalid-email',
      address: 'Test Street 123',
      phone: '+591 70123456',
      description: 'Invalid company',
    },
  },

  // Customer fixtures
  customers: {
    valid: {
      fullName: 'Juan Pérez',
      taxOrId: '12345678',
      email: 'juan@email.com',
      address: 'Customer Street 789',
      phone: '+591 70789123',
    },
    another: {
      fullName: 'María García',
      taxOrId: '87654321',
      email: 'maria@email.com',
      address: 'García Street 321',
      phone: '+591 70321987',
    },
    invalid: {
      fullName: '',
      taxOrId: '',
      email: 'invalid-email',
      address: 'Customer Street 789',
      phone: '+591 70789123',
    },
  },

  // User fixtures
  users: {
    company: {
      email: 'company@test.com',
      password: 'Test123!',
      firstName: 'Company',
      lastName: 'User',
      phone: '+591 70111222',
      role: UserRole.COMPANY,
      isActive: true,
    },
    customer: {
      email: 'customer@test.com',
      password: 'Test123!',
      firstName: 'Customer',
      lastName: 'User',
      phone: '+591 70333444',
      role: UserRole.CUSTOMER,
      isActive: true,
    },
    invalid: {
      email: 'invalid-email',
      password: '123', // Too short
      firstName: '',
      lastName: 'User',
      phone: '+591 70111222',
      role: UserRole.CUSTOMER,
      isActive: true,
    },
  },

  // Invoice fixtures
  invoices: {
    valid: {
      invoiceNumber: 'INV-001',
      issueDate: new Date('2025-01-01'),
      dueDate: new Date('2025-01-31'),
      subtotal: 1000.0,
      taxAmount: 130.0,
      totalAmount: 1130.0,
      status: StateInvoice.PENDING,
      notes: 'Test invoice notes',
    },
    another: {
      invoiceNumber: 'INV-002',
      issueDate: new Date('2025-01-02'),
      dueDate: new Date('2025-02-01'),
      subtotal: 2000.0,
      taxAmount: 260.0,
      totalAmount: 2260.0,
      status: StateInvoice.PAID,
      notes: 'Another test invoice',
    },
  },

  // Invoice Detail fixtures
  invoiceDetails: {
    valid: {
      description: 'Test Product 1',
      quantity: 5,
      unitPrice: 200.0,
      subtotal: 1000.0,
    },
    another: {
      description: 'Test Service 1',
      quantity: 2,
      unitPrice: 500.0,
      subtotal: 1000.0,
    },
  },

  // Payment fixtures
  payments: {
    valid: {
      amount: 500.0,
      paymentDate: new Date('2025-01-15'),
      paymentMethod: PaymentMethod.CREDIT_CARD,
      transactionReference: 'TXN-001',
      notes: 'Partial payment',
    },
    full: {
      amount: 1130.0,
      paymentDate: new Date('2025-01-20'),
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      transactionReference: 'TXN-002',
      notes: 'Full payment',
    },
  },
};
