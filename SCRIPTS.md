# Package.json Scripts Documentation

This document explains the npm scripts available in the ReTag Marketplace frontend.

## Available Scripts

### Development Scripts

- **`npm run dev`**
  - Command: `next dev --turbopack -p 9002`
  - Purpose: Starts the development server with Turbopack on port 9002
  - Use: Primary development command for frontend development

- **`npm run genkit:dev`**
  - Command: `genkit start -- tsx src/ai/dev.ts`
  - Purpose: Starts the AI development server for testing AI features
  - Use: When working on AI-powered pricing and analysis features

- **`npm run genkit:watch`**
  - Command: `genkit start -- tsx --watch src/ai/dev.ts`
  - Purpose: AI development server with file watching for auto-restart
  - Use: Continuous development of AI features with hot reload

### Production Scripts

- **`npm run build`**
  - Command: `next build`
  - Purpose: Creates an optimized production build
  - Use: Before deploying to production environments

- **`npm start`**
  - Command: `next start`
  - Purpose: Starts the production server
  - Use: Running the built application in production

### Code Quality Scripts

- **`npm run lint`**
  - Command: `next lint`
  - Purpose: Runs ESLint to check for code quality issues
  - Use: Code quality checks and maintaining coding standards

- **`npm run typecheck`**
  - Command: `tsc --noEmit`
  - Purpose: Runs TypeScript compiler to check for type errors
  - Use: Type safety validation without generating output files

## Usage Examples

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Check code quality
npm run lint
npm run typecheck

# AI development
npm run genkit:dev
```

## Port Configuration

- **Frontend Development**: Port 9002
- **Backend Development**: Port 8080 (configured in backend)
- **AI Services**: Managed by Genkit

## Notes

- The development server uses Turbopack for faster builds
- TypeScript and ESLint errors are ignored during builds (see next.config.ts)
- AI features require proper environment variables for Google AI services
