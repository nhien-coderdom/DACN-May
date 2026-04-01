# may-api/src/categories - Backend API Layer

## 🎯 Folder Này Dùng Khi Nào?

**Mỗi khi Frontend (MAY-admin) gọi API endpoint `/categories`**

```
Frontend (MAY-admin)
    ↓ HTTP Request
    ├─ GET /categories
    ├─ POST /categories
    ├─ PATCH /categories/:id
    └─ DELETE /categories/:id
    ↓
Backend (may-api/src/categories) ← **XỬ LÝ Ở ĐÂY**
    ↓ Database Query (Prisma)
Database (PostgreSQL)
```

---

## 📁 Cấu Trúc Folder

```
may-api/src/categories/
├─ categories.controller.ts      # Định tuyến (routing)
├─ categories.service.ts         # Logic xử lý
├─ categories.module.ts          # Module định nghĩa
├─ categories.controller.spec.ts # Unit test controller
└─ categories.service.spec.ts    # Unit test service
```

---

## 📝 Giải Thích Từng File

### **1. categories.controller.ts** (Điểm vào)

**Nhiệm vụ:** Định tuyến và xử lý HTTP requests

```typescript
// may-api/src/categories/categories.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common'
import { CategoriesService } from './categories.service'

@Controller('categories')  // ← Base route: /categories
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  // GET /categories
  @Get()
  findAll() {
    return this.service.findAll()
    //     ↑ Gọi service method
  }

  // POST /categories
  @Post()
  create(@Body() data: CreateCategoryDTO) {
    return this.service.create(data)
  }

  // GET /categories/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id)
  }

  // PATCH /categories/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateCategoryDTO) {
    return this.service.update(+id, data)
  }

  // DELETE /categories/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id)
  }
}
```

**Khi Frontend gọi:**
```typescript
// Frontend (MAY-admin)
axiosClient.post('/categories', { name: 'Coffee' })
                ↓
          HTTP POST /categories
                ↓
Backend nhận → CategoriesController.create()
```

---

### **2. categories.service.ts** (Xử lý logic)

**Nhiệm vụ:** Validate, xử lý business logic, database queries

```typescript
// may-api/src/categories/categories.service.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // Lấy tất cả categories
  async findAll() {
    return this.prisma.category.findMany({
      where: { isDeleted: false }  // ← Soft delete check
    })
  }

  // Tạo category
  async create(data: CreateCategoryDTO) {
    // Validate
    if (!data.name) {
      throw new Error('Name is required')
    }

    // Tạo slug từ name
    const slug = data.name
      .toLowerCase()
      .replace(/\s+/g, '-')

    // Insert vào database
    return this.prisma.category.create({
      data: {
        name: data.name,
        slug: slug,
        order: 0,
        parentId: data.parentId || null
      }
    })
  }

  // Cập nhật category
  async update(id: number, data: UpdateCategoryDTO) {
    return this.prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        parentId: data.parentId,
        order: data.order
      }
    })
  }

  // Xóa category (soft delete)
  async remove(id: number) {
    return this.prisma.category.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    })
  }
}
```

**Khi Controller gọi:**
```
CategoriesController.create(data)
            ↓
    CategoriesService.create(data)
            ↓
    Validate & Transform data
            ↓
    Prisma.category.create()
            ↓
    SQL: INSERT INTO Category (...)
            ↓
    PostgreSQL thực thi
            ↓
    Trả về Category object
```

---

### **3. categories.module.ts** (DI Container)

**Nhiệm vụ:** Khai báo controller, service, dependencies

```typescript
// may-api/src/categories/categories.module.ts
import { Module } from '@nestjs/common'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { PrismaModule } from '@/prisma/prisma.module'

@Module({
  imports: [PrismaModule],              // ← Import dependencies
  controllers: [CategoriesController],  // ← Register controller
  providers: [CategoriesService],       // ← Register service
  exports: [CategoriesService]          // ← Export cho modules khác
})
export class CategoriesModule {}
```

**Khi ứng dụng khởi động:**
```
NestJS loads CategoriesModule
    ↓
Import PrismaService
    ↓
Create CategoriesService instance
    ↓
Inject vào CategoriesController
    ↓
Register routes /categories
    ↓
Sẵn sàng nhận requests!
```

---

### **4. categories.controller.spec.ts** (Test Controller)

**Nhiệm vụ:** Unit test cho controller

```typescript
// may-api/src/categories/categories.controller.spec.ts
import { Test } from '@nestjs/testing'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'

describe('CategoriesController', () => {
  let controller: CategoriesController
  let service: CategoriesService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              { id: 1, name: 'Coffee' }
            ])
          }
        }
      ]
    }).compile()

    controller = module.get<CategoriesController>(CategoriesController)
    service = module.get<CategoriesService>(CategoriesService)
  })

  it('should return categories', async () => {
    const result = await controller.findAll()
    expect(result).toEqual([{ id: 1, name: 'Coffee' }])
  })
})
```

---

### **5. categories.service.spec.ts** (Test Service)

**Nhiệm vụ:** Unit test cho service

```typescript
// may-api/src/categories/categories.service.spec.ts
import { Test } from '@nestjs/testing'
import { CategoriesService } from './categories.service'
import { PrismaService } from '@/prisma/prisma.service'

describe('CategoriesService', () => {
  let service: CategoriesService
  let prisma: PrismaService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              create: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Coffee',
                slug: 'coffee'
              })
            }
          }
        }
      ]
    }).compile()

    service = module.get<CategoriesService>(CategoriesService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('should create category', async () => {
    const result = await service.create({ name: 'Coffee' })
    expect(result.name).toBe('Coffee')
  })
})
```

---

## 🔄 Complete Flow: Frontend → Backend → Database

### **Ví dụ: POST /categories (Tạo category)**

```
STEP 1: FRONTEND (MAY-admin)
├─ User click "Create Category"
├─ Input: { name: "Coffee" }
└─ Call: axiosClient.post('/categories', data)

        ↓ HTTP POST /categories
        
STEP 2: BACKEND RECEIVE (may-api)
├─ categories.controller.ts receives POST request
├─ @Post() create(@Body() data) được triggered
└─ Call: this.service.create(data)

        ↓ Xử lý logic
        
STEP 3: SERVICE LOGIC (CategoriesService)
├─ Validate: name không trống
├─ Transform: 
│  ├─ slug = "coffee"
│  ├─ order = 0
│  └─ parentId = null
├─ Call: prisma.category.create({...})
└─ Return: Category object

        ↓ Database query
        
STEP 4: DATABASE (PostgreSQL)
├─ Prisma converts to SQL:
│  INSERT INTO Category (name, slug, order, createdAt, isDeleted, updatedAt, ...)
│  VALUES ('Coffee', 'coffee', 0, NOW(), false, NOW(), ...)
├─ PostgreSQL executes
├─ Returns new row with id = 1
└─ RETURNING id, name, slug, ...

        ↓ Response ngược lại
        
STEP 5: RESPONSE (Backend → Frontend)
├─ PostgreSQL: { id: 1, name: 'Coffee', slug: 'coffee', ... }
├─ Prisma: Category object
├─ Service returns it
├─ Controller returns JSON response
├─ HTTP 200 OK
└─ Body: { id: 1, name: 'Coffee', ... }

        ↓ Frontend nhận response
        
STEP 6: FRONTEND UPDATE (MAY-admin)
├─ axiosClient response interceptor
├─ React Query onSuccess callback
├─ Update cache
├─ Component re-render
└─ UI hiển thị category mới! 🎉
```

---

## 📊 Request → Response Mapping

| Layer | File | Input | Process | Output |
|-------|------|-------|---------|--------|
| Frontend | categories.service.ts | `CreateCategoryDTO` | HTTP POST | `Promise<Category>` |
| Backend Routing | controller.ts | HTTP Body | Route match | Controller method |
| Backend Logic | service.ts | `CreateCategoryDTO` | Validate + Transform | `Category` object |
| Database | Prisma | SQL params | Query execute | Row from DB |
| Response | controller.ts | Category object | JSON serialize | HTTP Response |
| Frontend | Hook | HTTP response | Parse JSON | Typed `Category` |

---

## 🎯 Tóm Tắt

### **may-api/src/categories được dùng khi:**

1.  Frontend call `GET /categories` → controller.findAll()
2.  Frontend call `POST /categories` → controller.create()
3.  Frontend call `PATCH /categories/:id` → controller.update()
4.  Frontend call `DELETE /categories/:id` → controller.remove()

### **Quy trình xử lý:**

```
Frontend Request
    ↓
CategoriesController (Routing)
    ↓
CategoriesService (Logic)
    ↓ Prisma (ORM)
PostgreSQL (Database)
    ↓ Response ngược lại
Frontend Update UI
```

### **Mỗi file có vai trò:**

| File | Vai Trò |
|------|---------|
| `controller.ts` | Định tuyến HTTP requests |
| `service.ts` | Xử lý business logic |
| `module.ts` | Dependency injection |
| `*.spec.ts` | Unit tests |

---

## 💡 Ví Dụ Thực Tế

### **Frontend Tạo Category**

```typescript
// MAY-admin
const { mutate } = useCreateCategory()

mutate({ name: 'Coffee' })
//      ↓
// Service call: POST /categories
// API endpoint: http://localhost:3000/categories
```

### **Backend Nhận & Xử Lý**

```typescript
// may-api
@Post()
create(@Body() data: CreateCategoryDTO) {
  // data = { name: 'Coffee' }
  return this.service.create(data)
  // ↓
  // Validate, slug = 'coffee'
  // ↓
  // Prisma.category.create({ name: 'Coffee', slug: 'coffee', ... })
  // ↓
  // Database: INSERT INTO Category VALUES (...)
  // ↓
  // Return: { id: 1, name: 'Coffee', slug: 'coffee', ... }
}
```

### **Frontend Nhận Response**

```typescript
// MAY-admin
onSuccess: (category) => {
  // category = { id: 1, name: 'Coffee', slug: 'coffee', ... }
  // React Query cache
  // Component re-render
  // UI update
}
```

---

## ✨ Key Takeaway

**Frontend ↔ Backend Communication:**

```
MAY-admin/src/categories/services/categories.service.ts
    ↓ (axios HTTP call)
may-api/src/categories/
    ├─ controller.ts (Router)
    ├─ service.ts (Logic)
    └─ Database (Prisma)
    ↓ (HTTP response)
MAY-admin React Component update
```

**Không có FE thì không gọi BE!**
**Không có BE thì FE lỗi!**
**Backend xử lý mọi business logic & database!**
