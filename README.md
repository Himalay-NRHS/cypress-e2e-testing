# ShopNext - E-Commerce Application

A full-stack production-style e-commerce web application built with Next.js, TypeScript, Prisma, PostgreSQL, and TailwindCSS.

## Features

### Authentication
- User signup and login
- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (USER / ADMIN)
- Protected routes middleware

### Products
- Product listing with pagination
- Search functionality
- Price range filtering
- Product detail pages
- Admin: Create, edit, delete products

### Shopping Cart
- Add items to cart
- Update quantities
- Remove items
- Persistent cart per user

### Orders
- Checkout process
- Order history
- Order status tracking (PENDING → PAID → SHIPPED)
- Admin: View all orders, update status

### Admin Panel
- Product management
- Order management
- Protected admin routes

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon compatible)
- **ORM:** Prisma 7
- **Styling:** TailwindCSS
- **Authentication:** JWT (custom implementation)
- **Validation:** Zod

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon, Supabase, or local)

### Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Create a `.env` file with:
   ```env
   DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Setup database:**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Seed database with sample data
   npm run db:seed
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Database Commands

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Create migration
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database
```

## Test Accounts

After seeding, you can use these accounts:

| Role  | Email           | Password |
|-------|-----------------|----------|
| Admin | admin@test.com  | admin123 |
| User  | user@test.com   | user123  |

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - List products (with pagination, search, filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `PUT /api/cart/update` - Update cart item (protected)
- `DELETE /api/cart/remove` - Remove cart item (protected)

### Orders
- `GET /api/orders` - Get orders (protected, admin sees all)
- `POST /api/orders/checkout` - Create order from cart (protected)
- `PUT /api/orders/:id` - Update order status (admin)

## API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message"
}
```

## Project Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── cart/           # Cart endpoints
│   │   ├── orders/         # Order endpoints
│   │   └── products/       # Product endpoints
│   ├── admin/              # Admin pages
│   ├── cart/               # Cart page
│   ├── checkout/           # Checkout page
│   ├── login/              # Login page
│   ├── orders/             # Orders page
│   ├── product/[id]/       # Product detail page
│   ├── signup/             # Signup page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
├── context/                # React context providers
├── lib/                    # Utility functions
│   ├── api-response.ts     # API response helpers
│   ├── auth.ts             # Authentication utilities
│   ├── middleware.ts       # Route protection
│   ├── prisma.ts           # Prisma client
│   └── validations.ts      # Zod schemas
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
└── prisma.config.ts        # Prisma 7 configuration
```

## Testing Scenarios

The application supports these test scenarios:

1. **Signup validation errors** - Try empty fields or invalid email
2. **Login wrong password** - Use incorrect password
3. **Access protected page without token** - Visit /cart, /orders without login
4. **Access admin route as normal user** - Login as user, try /admin

## License

MIT
