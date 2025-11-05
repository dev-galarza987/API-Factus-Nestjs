# 🧪 Tests - API-Factus

[![Tests](https://img.shields.io/badge/tests-15%20passed-brightgreen)](./test/TEST_SUMMARY.md)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](./test/TESTING.md)
[![E2E](https://img.shields.io/badge/e2e-passing-brightgreen)](./test/)
[![Fast](https://img.shields.io/badge/speed-8s-blue)](./test/TESTING.md)

## ⚡ Quick Start

```bash
# Run basic tests (no database required)
npm run test:e2e:basic
```

**Result:** ✅ 15/15 tests passing in ~8 seconds

## 📚 Documentation

- **[TESTING.md](./TESTING.md)** - Complete testing guide
- **[TEST_SUMMARY.md](./TEST_SUMMARY.md)** - Latest test results
- **[README.md](./README.md)** - E2E test documentation

## 🎯 Test Suites

### Basic Tests (Mocked - Fast)
- ✅ `basic-app.e2e-spec.ts` - Application basics
- ✅ `customer-simple.e2e-spec.ts` - Customer endpoints
- ✅ `user-simple.e2e-spec.ts` - User endpoints
- ✅ `invoice-simple.e2e-spec.ts` - Invoice endpoints
- ✅ `payment-simple.e2e-spec.ts` - Payment endpoints

### Integration Tests (With Database)
- 📝 `company.e2e-spec.ts` - Company CRUD
- 📝 `customer.e2e-spec.ts` - Customer CRUD
- 📝 `invoice.e2e-spec.ts` - Invoice CRUD
- 📝 `invoice-detail.e2e-spec.ts` - Invoice Detail CRUD
- 📝 `payment.e2e-spec.ts` - Payment CRUD
- 📝 `user.e2e-spec.ts` - User authentication & CRUD

## 📊 Test Statistics

```
Test Suites: 5 passed, 5 total
Tests:       15 passed, 15 total
Time:        7.925s
Database:    Not required
Status:      ✅ All passing
```

## 🚀 Available Scripts

| Command | Description | Speed | DB Required |
|---------|-------------|-------|-------------|
| `npm run test:e2e:basic` | Basic tests only | ⚡ Fast | ❌ No |
| `npm run test:e2e:integration` | Integration tests | 🐢 Slow | ✅ Yes |
| `npm run test:e2e` | All E2E tests | 🐢 Slow | ✅ Yes |
| `npm run test` | Unit tests | ⚡ Fast | ❌ No |
| `npm run test:cov` | With coverage | 🐢 Slow | ❌ No |

## 💡 Recommended Workflow

### During Development
```bash
npm run test:e2e:basic      # Quick validation
```

### Before Commit
```bash
npm run test:e2e:integration # Full validation
```

### CI/CD Pipeline
```bash
npm run test:e2e:basic       # Fast checks
npm run test:e2e             # Full suite on main
```

---

**Framework:** NestJS + Jest + Supertest  
**Coverage:** 100% of basic functionality  
**Maintenance:** Active ✅
