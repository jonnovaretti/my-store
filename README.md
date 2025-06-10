# Backoffice Chat - AI Integrated

### AI-Powered Features
- AI Product Creator for generating product listings (Vercel AI SDK)
- Image generation for product images (using Replicate)
- Expert chat interface

### Technical Highlights
- Modern monorepo structure with apps for web and server
- Type-safe API communication with shared types
- Real-time updates using modern state management
- Modern UI with Shadcn components and Tailwind CSS

## Tech Stack 💻

### Frontend
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Framer Motion for animations
- Chat interface with Vercel AI SDK

### Backend
- Nest.js with TypeScript
 - PostgreSQL with TypeORM
- JWT Authentication
- Swagger API Documentation
- Argon2 for password hashing
- Cloudinary for media storage
- OpenAI integration
- Text Vercel AI SDK
- Replicate for image generation

### DevOps & Tools
- Monorepo architecture
- pnpm for package management
- Docker support
- Railway for backend deployment
- Vercel for frontend deployment

### Prerequisites
- Node.js (v16 or higher)
- pnpm (preferred package manager)
 - PostgreSQL instance (Docker preferred)

## Running Locally 🖥️

Install dependencies (root)

```bash
pnpm install
```

Add Environment Variables - Client

<details>
  <summary>Click to expand!</summary>
  
  - `NEXT_PUBLIC_API_URL`
  - `OPENAI_API_KEY`
  - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
</details>

Add Environment Variables - Server

<details>
  <summary>Click to expand!</summary>

  - `ALLOWED_ORIGINS`
  - `PORT`
  - `JWT_SECRET`
  - `JWT_ACCESS_SECRET`
  - `JWT_REFRESH_SECRET`
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `DATABASE_URL`
  - `REPLICATE_API_TOKEN`
  - `OPENAI_API_KEY`
</details>

Start the server

```bash
pnpm start:server
```

Start the client

```bash
pnpm start:web
```

## Author
- [@achrafdev](https://achrafdev.com)

**Thanks for sharing** 🚀

