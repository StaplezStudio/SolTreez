# Soltree Project Archive

This folder contains compressed archives of the complete Soltree project.

## Archive Compatibility

The ZIP file is created with standard compression and is compatible with:
- **Windows**: WinRAR, 7-Zip, WinZip, built-in Windows extractor
- **macOS**: Archive Utility, The Unarchiver, Keka
- **Linux**: unzip command, Archive Manager, Ark
- **Online**: Any web-based ZIP extractor

## Contents

The archives include:
- Complete React/TypeScript frontend
- Express.js backend with PostgreSQL integration
- Solana blockchain integration
- Wallet adapter support (Phantom, Solflare)
- Tree configuration save/load system
- On-chain Merkle tree discovery
- Source code download functionality
- Mobile-responsive design
- Complete documentation

## Files Excluded

The following files are excluded from archives to reduce size:
- `node_modules/` - Dependencies (can be restored with `npm install`)
- `.git/` - Git history
- `.replit` and `replit.nix` - Replit-specific files
- Log files and build artifacts
- Environment variables

## Usage

1. Extract the archive: `unzip soltree-complete-[timestamp].zip`
2. Navigate to project: `cd workspace/`
3. Install dependencies: `npm install`
4. Set up environment variables (DATABASE_URL, etc.)
5. Push database schema: `npm run db:push`
6. Run the application: `npm run dev`

## Project Details

- **Repository**: https://github.com/StaplezStudio/Soltree.git
- **Technology Stack**: React, TypeScript, Express.js, PostgreSQL, Solana Web3.js
- **Features**: Merkle tree creation, wallet integration, configuration management
- **Deployment Ready**: Configured for Replit and other platforms