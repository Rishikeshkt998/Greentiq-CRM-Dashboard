# GreenTiq CRM - Advanced Customer Management Dashboard

A high-performance, enterprise-grade Customer Management Dashboard built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **TanStack Query (React Query)**, and **@hello-pangea/dnd**. Designed for real-time customer lifecycle management, advanced multi-dimensional filtering, interactive drag-and-drop reordering, and robust security.

---

## 🏗️ System Architecture

GreenTiq CRM follows a **Layered & Service-Repository Architecture** designed for high modularity, testability, and clear separation of concerns:

```
src/
├── app/                  # Next.js 14 App Router (Pages, Layouts, & Thin API Routes)
│   ├── api/              # RESTful API Endpoints (/api/customers, /api/saved-filters, /api/auth)
├── components/           # UI Components structured via Atomic Design
│   ├── atoms/            # Primitive UI components (Buttons, Inputs, Badges, Dropdowns)
│   ├── molecules/        # Form fields, search inputs, filter cards, row actions
│   ├── organisms/        # Complex views (Customer Table, Filter Drawer, Add/Edit Modals, Header, Sidebar)
├── services/             # Pure Business Logic Layer (Isolated from Next.js route handlers)
│   ├── auth/             # Token utilities and authentication logic
│   ├── customer/         # Customer querying, normalization, and service wrappers
│   ├── filter/           # Filter preset persistence and sync engine
├── repositories/         # Data Access Layer Abstraction
├── lib/                  # Platform Utilities & Storage Adapters
│   ├── db/               # Hybrid Database Adapter (In-Memory + MongoDB Fallback)
│   ├── security/         # Security suite (Rate Limiting, CSP Nonce Generator, JWT)
├── schemas/              # Zod validation schemas for forms, query params, and entities
├── hooks/                # Custom React Hooks & TanStack Query integrations
├── types/                # Strict TypeScript type definitions
└── config/               # Environment configuration and validation (env.ts)
```

---

## 🔐 Security, Rate Limiting & Nonce Architecture

The application includes enterprise security measures built directly into Next.js Edge Middleware (`src/middleware.ts`):

### 1. Token-Bucket Rate Limiting
- **Implementation**: Managed by `TokenBucketRateLimiter` (`src/lib/security/rate-limiter.ts`).
- **Enforcement**: Middleware intercepts all `/api/*` routes and checks requests per IP address (`x-forwarded-for` or `request.ip`).
- **Response**: Rejects requests exceeding rate limits with HTTP `429 Too Many Requests`.
- **Headers Included**:
  - `Retry-After`: Seconds to wait before retrying.
  - `X-RateLimit-Limit`: Maximum requests per window.
  - `X-RateLimit-Remaining`: Count of remaining requests.
- **Configurable**: Configured via `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_MS`.

### 2. Content Security Policy (CSP) & Nonce Header
- **Implementation**: Dynamic CSP generator in `src/lib/security/csp.ts`.
- **Cryptographic Nonce**: Generates a unique per-request UUID nonce (`crypto.randomUUID()`) when `ENABLE_CSP_NONCE=true`.
- **Response Headers**: Sets `x-csp-nonce` response header for script hydrations.
- **CSP Directives**:
  - `script-src`: Restricts scripts to `'self'`, strict nonces, and `'strict-dynamic'`.
  - `style-src`: Restricts inline styles to nonce-validated blocks.
  - Security hardening headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy`.

### 3. JWT Authentication & Role-Based Permissions
- Dual-token architecture using short-lived Access JWTs and long-lived Refresh JWTs.
- Feature-flagged API authorization check via `ENABLE_AUTH`.
- Role-Based Access Control (RBAC) supporting **Admin**, **Manager**, and **Viewer** roles with dynamic action disabling.

---

## ✨ Features & Task Specifications

### 1. Customer List View & Real-Time Search
- **Data Grid & Card Layout**: Displays customer records with Name, Email, Phone, Company, Status (`Active`, `Inactive`, `Prospect`, `Archive`), Last Contact Date, and quick action menus.
- **Real-Time Search**: Instant search matching across customer name, email address, or company.
- **Column Sorting**: Interactive sorting by Name, Email, or Last Contact Date.
- **Configurable Pagination**: Supports 10, 25, or 50 entries per page with responsive pagination controls.

### 2. Advanced Filters Panel ⭐ (Key Requirement)
- **Multi-Dimensional Filter Interface**: Responsive slide-over drawer and modal panel featuring:
  - **Status Filter**: Multi-select checkboxes (`Active`, `Inactive`, `Prospect`, `Archive`).
  - **Company Filter**: Multi-select company tag selection.
  - **Date Range Picker**: Filter records by last contact date interval (From / To).
  - **Phone & Email Filters**: Partial string search matching.
- **Saved Filter Presets**: Save custom filter configurations with custom names.
- **Pre-built Templates**: One-click quick filters ("Active Customers", "Recent Contacts", "Inactive Leads", "High-value prospects").
- **Visual Feedback**: Active filter count badge, "Apply Filters" button, and one-click "Clear All Filters".

### 3. Customer Creation, Details & Management
- **Customer Creation Modal**: Modal with real-time form validation powered by React Hook Form & Zod. Fields include Name, Email, Phone, Company, Status, Last Contact Date, and Notes.
- **Duplicate Detection**: Prevents creation of records with duplicate emails or phone numbers, returning explicit inline toast errors.
- **Customer Details View**: Comprehensive detail drawer displaying contact metadata, interaction history timeline, total deal value, assigned account owner, and notes.
- **Customer Editing**: Inline and modal updating with optimistic UI feedback.
- **Deletion Dialog**: Destructive confirmation modal to prevent accidental record removal.

### 4. Data Fetching & Caching with TanStack Query
- **Custom Query Hooks**: Powered by `useCustomers`, `useCreateCustomer`, `useUpdateCustomer`, and `useDeleteCustomer`.
- **Smart Caching**: Configured `staleTime` (30 seconds) preventing unnecessary server requests.
- **Optimistic UI Updates**: Immediate client UI updates on edit and delete operations with automatic rollback on error.
- **Automatic Cache Invalidation**: Automatic background query refetching upon successful mutations.
- **Loading Skeletons**: Smooth loading states and fallback displays.

### 5. Form Validation & User Feedback
- Form controls built with `shadcn/ui` and `@hookform/resolvers/zod`.
- Strict validation rules: E.164 phone formatting, RFC-compliant email checks, required string lengths.
- Inline red error messages and accessibility attributes (`aria-invalid`).
- Rich toast notifications powered by `sonner` for operation success and duplicate warnings.
- Submit buttons disabled during active mutations to prevent double-submission.

### 6. Interactive Drag & Drop
- Powered by `@hello-pangea/dnd` for smooth drag-and-drop capabilities.
- Allows intuitive row reordering within the customer data table/card view.
- Supports drag-and-drop preset ordering within the saved filters management panel.

### 7. Bonus / Extended Capabilities
- **Bulk Actions**: Checkbox row selection allowing bulk status updates and bulk deletion.
- **CSV Export**: Export currently active and filtered customer lists to downloadable CSV files.
- **Dark / Light Mode**: Dynamic theme switcher with persistent user preference.
- **Keyboard Shortcuts**: Global `Cmd+K` / `Ctrl+K` shortcut to trigger global search/filter drawer instantly.
- **Debounced Search**: Debounced search input handling for smooth performance and lower server load.

---

## 🛠️ Required Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict mode enabled)
- **Styling**: Tailwind CSS & CSS Variables
- **Component Library**: `shadcn/ui` primitives & Lucide React icons
- **State & Data Fetching**: TanStack Query v5 (`@tanstack/react-query`)
- **Drag & Drop**: `@hello-pangea/dnd`
- **Validation**: Zod & React Hook Form
- **Toasts**: `sonner`

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory. **Do not put production secrets into version control.**

```env
# Server & Auth Settings
JWT_ACCESS_SECRET=your-jwt-access-secret-placeholder
JWT_REFRESH_SECRET=your-jwt-refresh-secret-placeholder
ENABLE_AUTH=false

# Security & Rate Limiting
ENABLE_CSP_NONCE=true
RATE_LIMIT_MAX_REQUESTS=60
RATE_LIMIT_WINDOW_MS=60000

# Storage Option (In-Memory or MongoDB)
DB_PROVIDER=memory # Options: 'memory' (pure in-memory mock store) or 'mongodb'
MONGODB_URI=
```

---

## 🚀 Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open application**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run linting & type checks**:
   ```bash
   npm run lint
   ```

