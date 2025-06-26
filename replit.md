# Merkle Tree Creator Application

## Overview

This is a full-stack web application for creating and managing Solana Merkle trees. The application provides a user-friendly interface for configuring Merkle tree parameters, connecting Solana wallets, and deploying compressed Merkle trees to the Solana blockchain. It's built with a modern React frontend and Express.js backend, utilizing Drizzle ORM for database operations and integrating with Solana's SPL Account Compression program.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared components:

- **Frontend**: React application with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Storage**: Client-side localStorage (no database required)
- **Blockchain Integration**: Solana Web3.js and SPL Account Compression
- **UI Components**: Radix UI primitives with Tailwind CSS styling
- **State Management**: TanStack Query for server state management
- **Wallet Integration**: Solana Wallet Adapter for Web3 connectivity

## Key Components

### Frontend Architecture
- **React SPA**: Single-page application using Wouter for routing
- **Component Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Wallet Integration**: Solana Wallet Adapter supporting Phantom and Solflare wallets

### Backend Architecture
- **Express Server**: RESTful API with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL
- **Storage Abstraction**: Interface-based storage layer with in-memory implementation
- **Route Handling**: Organized API routes for Merkle tree operations
- **Development Server**: Vite integration for hot module replacement

### Data Storage
- **Tree Configurations**: Saved in browser localStorage
  - User preferences for canopy depth, max depth, buffer size
  - Named configurations for quick setup
  - Default configuration support
- **Tree History**: Tracked on-chain only (no local storage)

### Solana Integration
- **Merkle Tree Creation**: Uses SPL Account Compression program
- **Network Support**: Both devnet and mainnet-beta
- **Custom RPC**: Optional custom RPC endpoint configuration
- **Cost Estimation**: Dynamic cost calculation based on tree parameters

## Data Flow

1. **User Connection**: Users connect their Solana wallet through the wallet adapter
2. **Parameter Configuration**: Users configure Merkle tree parameters via interactive sliders
3. **Cost Estimation**: Real-time cost estimation based on selected parameters
4. **Tree Creation**: Submits transaction to Solana network via connected wallet
5. **Status Tracking**: Monitors transaction confirmation and updates database
6. **History Management**: Stores created trees for future reference

## External Dependencies

### Blockchain
- **Solana Web3.js**: Core Solana blockchain interaction
- **SPL Account Compression**: Merkle tree creation and management
- **Browser localStorage**: Client-side data persistence
- **Solana Wallet Adapter**: Wallet connection management

### UI/UX
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Hook Form**: Form state management
- **TanStack Query**: Server state management

### Development
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **Drizzle Kit**: Database schema management
- **ESBuild**: Production bundling

## Deployment Strategy

The application is configured for deployment on Replit with autoscaling capabilities:

- **Build Process**: Vite builds the client, ESBuild bundles the server
- **Production Server**: Serves static files and API from single Express instance
- **Storage**: Client-side localStorage (no database required)
- **Environment**: Node.js 20 with Web and PostgreSQL modules
- **Port Configuration**: Internal port 5000 mapped to external port 80

## Changelog

- June 25, 2025. Initial setup
- June 25, 2025. Updated max depth minimum to 5 for safety (user requirement)
- June 25, 2025. Enhanced wallet connection for preview mode and mobile compatibility
- June 25, 2025. Added custom RPC requirement messaging to prevent access denied errors
- June 25, 2025. Implemented tree configuration save/load system with database storage
- June 25, 2025. Added project archive creation functionality in shared folder
- June 25, 2025. Updated source code download to serve existing ZIP archive from shared folder
- June 25, 2025. Fixed GitHub upload issue by excluding node_modules and providing proper Git setup instructions
- June 25, 2025. Removed database dependencies - converted to client-side localStorage for tree configurations
- June 25, 2025. Created professional landing page with routing: / = landing, /create = app interface
- June 25, 2025. Added static index.html in root for GitHub Pages compatibility
- June 25, 2025. Updated complete project archive with GitHub Pages landing page and latest fixes
- June 25, 2025. Added Git push conflict resolution instructions for initial repository setup
- June 25, 2025. Fixed GitHub Pages deployment structure to serve React app at root level
- June 25, 2025. Updated project archive with GitHub Pages deployment fixes and Git conflict resolution
- June 25, 2025. Fixed deployment workflow to properly handle Vite's dist/public output structure
- June 25, 2025. Updated final project archive with complete GitHub Pages deployment solution
- June 25, 2025. Aligned static HTML landing page design with React component for consistency
- June 25, 2025. Fixed GitHub Pages SPA routing with 404.html redirect and proper file structure
- June 25, 2025. Fixed asset paths in deployment workflow to match Vite build output structure
- June 25, 2025. Added Jekyll config to GitHub Pages deployment to properly serve HTML files

## User Preferences

Preferred communication style: Simple, everyday language.  
Max depth minimum: 5 (safety requirement)  
Mobile compatibility: Required for preview mode functionality  
Wallet adapters: Must work in Replit preview environment  
RPC requirement: Custom RPC endpoints required for reliable Merkle tree creation  
Data preference: Use on-chain data instead of database for tree discovery  
Storage preference: No database - use localStorage for configurations only