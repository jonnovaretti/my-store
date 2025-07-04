# Elecshop NestJS Authentication API

A robust authentication system built with NestJS, featuring JWT-based authentication with access and refresh tokens.

## Features

- 🔐 JWT Authentication
- 🔄 Refresh Token Rotation
- 👤 User Management
- 🛡️ Role-based Access Control (Admin/User)
- 📚 Swagger API Documentation
- 🔒 Secure Password Hashing with Argon2
- 🌍 CORS Enabled
- 🛡️ Helmet Security

## Prerequisites

- Node.js (v16 or higher)
- Docker (recommended)
- pnpm (preferred)

## Getting Started

1. Navigate to the server directory:

```bash
cd server
```

2. Create a `.env` file in the `server` directory:

```
ALLOWED_ORIGINS=* (if you want to allow all origins)
PORT=4000 (or any available port)
JWT_SECRET= (any secret key)
JWT_ACCESS_SECRET= (any secret key)
JWT_REFRESH_SECRET= (any secret key)
DATABASE_URL= (your postgres connection string)
```

3. Install dependencies

```bash
pnpm install
```

4. Start the NestJS server

```bash
pnpm start:dev
```

## API Documentation

Once the application is running, visit `http://localhost:4000/api` to access the Swagger documentation.

### Authentication Endpoints

- POST `/v1/auth/register` - Register a new user
- POST `/v1/auth/login` - Login with credentials
- POST `/v1/auth/refresh` - Refresh access token
- POST `/v1/auth/logout` - Logout user
- GET `/v1/auth/profile` - Get user profile
- more endpoints...

## Token System

The API uses a dual-token system:

- Access Token: Short-lived (15 minutes)
- Refresh Token: Long-lived (7 days)

When the access token expires, use the refresh token to obtain a new pair of tokens.

### Project Structure

```bash
src/
├── guards/ # Authentication guards
├── strategies/ # Passport strategies (JWT, Local)
├── users/ # Resources (User, Order, Product, etc.)
│ ├── controller/ # Route controllers
│ ├── dtos/ # Data transfer objects
│ ├── entities/ # TypeORM entities
│ └── services/ # Business logic
└── utils/ # Helper functions
```
