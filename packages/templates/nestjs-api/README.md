# Fusion NestJS API

Complete NestJS 10 backend with authentication, Prisma ORM, and CRUD operations.

## Features

- ✅ JWT Authentication
- ✅ Prisma ORM (SQLite for development)
- ✅ User Management
- ✅ Todo CRUD Operations
- ✅ Fusion Decorators for Auto API Client Generation
- ✅ Fastify Adapter
- ✅ Input Validation

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run start:dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user (protected)

### Todos
- `GET /todos` - Get all todos (protected)
- `GET /todos/:id` - Get single todo (protected)
- `POST /todos` - Create todo (protected)
- `PUT /todos/:id` - Update todo (protected)
- `DELETE /todos/:id` - Delete todo (protected)

### Users
- `GET /users/me` - Get current user profile (protected)

## Environment Variables

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=5050
```

## Database

Using Prisma with SQLite for development. To create a new migration:

```bash
npm run prisma:migrate
```

To view database in Prisma Studio:

```bash
npm run prisma:studio
```

## Building for Production

```bash
npm run build
npm run start:prod
```
