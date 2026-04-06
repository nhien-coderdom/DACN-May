# Users Management Components

## Overview
Complete user management module for the admin panel with role management and CRUD operations.

## Components Structure

### 1. **UsersList.tsx** - Main Container
- Displays list of all users in a table format
- Manages modals for creating/editing users and updating roles
- Handles user interactions (edit, delete, change role)
- Props:
  - `users`: User[]
  - `onEdit`: (userId, data) => void
  - `onDelete`: (userId) => void
  - `onUpdateRole`: (userId, data) => void
  - `isLoading`: boolean

### 2. **UserRow.tsx** - Table Row Component
- Renders individual user row in table
- Shows user details: ID, Email, Name, Phone, Role, Orders count, Status
- Role badge with color coding:
  - **ADMIN**: Red
  - **STAFF**: Blue
  - **CUSTOMER**: Gray
- Action buttons: Edit Info, Change Role, Delete/Restore
- Props:
  - `user`: User
  - `onEdit`: () => void
  - `onDelete`: () => void
  - `onChangeRole`: () => void

### 3. **UserForm.tsx** - Create/Update Form
- Handles creating new users and updating user information
- For **Create**:
  - Required fields: email, name, phone, password, role
  - Optional field: address
  - All fields enabled
- For **Update**:
  - Fields: email (disabled), name, phone, address
  - Password field not shown (separate endpoint)
  - Role change not in this form (use UpdateRoleModal)
- Props:
  - `initialData`: User | null
  - `onSubmit`: (data) => void
  - `onClose`: () => void

### 4. **UpdateRoleModal.tsx** - Role Change Modal
- Dedicated modal for changing user roles
- Applies role change rules enforce by backend:
  - ✅ STAFF → ADMIN: Allowed (only admin can execute)
  - ✅ ADMIN → STAFF: Allowed (only if ≥1 active admin remains)
  - ❌ CUSTOMER → ADMIN/STAFF: Not allowed
- Shows warning/info messages based on role transition
- Props:
  - `user`: User
  - `onSubmit`: (data) => void
  - `onClose`: () => void

## Hooks Usage

### Get all users
```typescript
const { data: users, isLoading } = useUsers()
```

### Create user
```typescript
const createMutation = useCreateUser()
createMutation.mutate({ email, name, phone, password, role })
```

### Update user info
```typescript
const updateMutation = useUpdateUser(userId)
updateMutation.mutate({ name, phone, email })
```

### Delete user
```typescript
const deleteMutation = useDeleteUser()
deleteMutation.mutate(userId)
```

### Update user role
```typescript
const roleUpdateMutation = useUpdateUserRole(userId)
roleUpdateMutation.mutate({ role: 'ADMIN' })
```

## Utilities

- `getRoleBadgeColor(role)`: Get CSS classes for role badge
- `getRoleDescription(role)`: Get human-readable role description
- `formatCurrency(amount)`: Format number as Vietnamese currency
- `formatDate(dateString)`: Format date to Vietnamese locale

## Backend Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users (admin only) |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create new user (admin only) |
| PATCH | `/users/:id` | Update user info (admin only) - NEW |
| PATCH | `/users/:id/role` | Update user role (admin only) |
| DELETE | `/users/:id` | Soft delete user (admin only) |
| PATCH | `/users/:id/restore` | Restore deleted user (admin only) |

## Data Flow

```
Users.tsx (Page)
  ↓
  useUsers (fetch all)
  useCreateUser, useUpdateUser, useDeleteUser, useUpdateUserRole
  ↓
UsersList (Container)
  ├─ UserForm (Create/Edit Modal)
  ├─ UpdateRoleModal (Role Change Modal)
  └─ UserRow (Table Row)
      ├─ Edit → UserForm
      ├─ Change Role → UpdateRoleModal
      └─ Delete → Confirmation
```

## Role Management Rules

### Rule 1: CUSTOMER → ADMIN/STAFF
- ❌ **Not allowed** - Frontend blocks, Backend validates
- Backend throws: `ForbiddenException`

### Rule 2: ADMIN → STAFF
- ✅ **Allowed only if ≥1 active admin remains**
- Backend checks: `isDeleted = false & role = ADMIN & id != userId`
- If fails: `ForbiddenException('Cannot demote the last active admin...')`

### Rule 3: STAFF → ADMIN
- ✅ **Allowed** (no additional checks)
- Only admins can execute (already guarded by `@Roles(UserRole.ADMIN)`)

### Rule 4: ADMIN → ADMIN, CUSTOMER → CUSTOMER, STAFF → STAFF
- ✅ **Allowed** (no-op)

## Notes
- All timestamps are formatted to Vietnamese locale
- Currency shown in VND
- Soft delete: `isDeleted = true, deletedAt = timestamp`
- Password is hashed with bcrypt (10 rounds) on backend
- Deleted users can be restored via `PATCH /users/:id/restore`
