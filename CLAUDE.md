# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Donation Village is a blockchain-based transparent donation platform that gamifies charitable giving through a village system. It combines React frontend, Supabase backend, and Ethereum smart contracts deployed on Arbitrum Sepolia.

**Tech Stack:**
- Frontend: React 18.3.1 + Vite 6.3.5 + TypeScript
- Backend: Supabase (BaaS) + Hono (serverless functions)
- Blockchain: Solidity + Hardhat 2.22.16 + Ethers.js 6.9.0 + OpenZeppelin 5.0.0
- Network: Arbitrum Sepolia (Testnet, Chain ID: 421614)
- UI: Radix UI + Tailwind CSS
- Auth: DID (Decentralized Identity) + Supabase Auth

## Architecture

### Monorepo Structure

This is a workspace-based monorepo with three main sections:

```
Inudonationbcg/
├── frontend/              # React app (port 5173)
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── ui/       # Radix UI components
│   │   │   ├── common/   # Shared components
│   │   │   └── figma/    # Figma design components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Core libraries
│   │   │   ├── auth-context.tsx    # Auth state management
│   │   │   ├── api.ts              # API communication
│   │   │   ├── contract.ts         # Blockchain integration
│   │   │   ├── did.ts              # DID management
│   │   │   ├── supabase-api.ts     # Supabase data layer
│   │   │   └── supabase-client.ts  # Supabase client config
│   │   ├── types/        # TypeScript definitions
│   │   └── App.tsx       # Main app with routing
│   └── vite.config.ts
├── backend/               # Supabase backend
│   ├── lib/              # Auth and API logic
│   ├── supabase/
│   │   ├── functions/    # Edge Functions
│   │   ├── schema.sql    # Database schema
│   │   └── seed-data.sql # Seed data
│   └── utils/
└── blockchain/            # Smart contracts
    ├── contracts/
    │   ├── DonationVillage.sol  # Main donation contract
    │   └── DonationLedger.sol   # Audit ledger
    ├── scripts/
    │   └── deploy.js            # Deployment script
    └── hardhat-setup/
        ├── hardhat.config.js    # Network configs
        └── package.json

workspaces: ["frontend", "backend", "blockchain/hardhat-setup"]
```

### Data Flow Architecture

**Dual Storage Pattern:**
- Donations are stored in BOTH blockchain (for transparency/immutability) AND Supabase (for fast queries)
- Campaign data lives in Supabase for admin CRUD operations
- User data (DID, points, badges) managed by Supabase with Auth integration

**Authentication Flow:**
1. User logs in via DID or OAuth (Google)
2. Supabase Auth creates/validates session
3. `auth-context.tsx` manages global auth state
4. User type (`isOrganization`) determines UI access level

**Donation Flow:**
1. User initiates donation in frontend
2. Transaction sent to Arbitrum Sepolia via ethers.js
3. On success, donation record created in Supabase
4. Campaign `current_amount` updated
5. User `points` incremented
6. UI reflects changes immediately

### Key Integration Points

**Frontend ↔ Supabase:**
- `lib/supabase-api.ts` handles all Supabase queries
- Real-time subscriptions for live campaign updates
- RLS (Row Level Security) enforces data access rules

**Frontend ↔ Blockchain:**
- `lib/contract.ts` manages smart contract interactions
- Uses ethers.js v6 with provider/signer pattern
- Contract ABI imported from hardhat artifacts
- Fallback to wallet-mock for testing without wallet

**Supabase ↔ Blockchain:**
- No direct connection
- Frontend acts as bridge, writing blockchain results to Supabase

## Common Commands

### Frontend Development
```bash
# Install all workspace dependencies
npm run install:all

# Start frontend dev server (http://localhost:5173)
cd frontend && npm run dev
# OR from root:
npm run frontend:dev

# Build frontend for production
npm run frontend:build

# Preview production build
cd frontend && npm run preview
```

### Blockchain Development
```bash
# Install blockchain dependencies
npm run blockchain:install

# Compile smart contracts
cd blockchain/hardhat-setup && npm run compile
# OR from root:
npm run blockchain:compile

# Run tests
npm run blockchain:test

# Deploy to local Hardhat network
npm run blockchain:deploy:local

# Deploy to Arbitrum Sepolia testnet
cd blockchain/hardhat-setup && npm run deploy:sepolia
# OR from root:
npm run blockchain:deploy:sepolia

# Start local Hardhat node
cd blockchain/hardhat-setup && npm run node

# Verify contract on Arbiscan
cd blockchain/hardhat-setup && npm run verify -- --network arbitrumSepolia <CONTRACT_ADDRESS>
```

### Backend/Supabase
```bash
# Initialize Supabase project (requires Supabase CLI)
cd backend && supabase init

# Start local Supabase (Docker required)
cd backend && supabase start

# Deploy Edge Functions
cd backend && supabase functions deploy

# Run database migrations
cd backend && supabase db push

# Generate TypeScript types from database
cd backend && supabase gen types typescript --local
```

## Environment Variables

### Frontend (.env in frontend/)
```env
VITE_SUPABASE_URL=https://dnhuzjztsujeuiykvlya.supabase.co
VITE_SUPABASE_ANON_KEY=<your_anon_key>
VITE_CONTRACT_ADDRESS=<deployed_contract_address>
VITE_ALCHEMY_API_KEY=<alchemy_api_key>
VITE_CHAIN_ID=421614
VITE_CHAIN_NAME=Arbitrum Sepolia
VITE_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
VITE_ENABLE_BACKEND=true
```

### Blockchain (.env in blockchain/hardhat-setup/)
```env
DEPLOYER_PRIVATE_KEY=<wallet_private_key>
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ARBISCAN_API_KEY=<arbiscan_api_key>
```

**Security:** Never commit .env files. Use .env.example as template.

## Critical Implementation Details

### Smart Contract Compatibility

**OpenZeppelin v5.0.0:** Contracts use the latest OpenZeppelin standards. Import paths differ from v4:
```solidity
import "@openzeppelin/contracts/access/Ownable.sol";  // v5 syntax
```

**Solidity Version:** Locked to `0.8.20` with optimizer enabled (200 runs).

**Hardhat Version:** Must use `2.22.x` for OpenZeppelin v5 compatibility. Do NOT upgrade to v3.x without testing.

### Frontend State Management

**React Context API Pattern:**
- `AuthContext` (lib/auth-context.tsx) manages user session, DID, wallet connection
- No Redux/Zustand - keep state in Context or component-level
- Supabase handles real-time state sync

**Component Organization:**
- `/components/ui/` - Primitive Radix UI components (button, dialog, card, etc.)
- `/components/common/` - Shared business logic components
- `/components/figma/` - Design system components from Figma
- `/pages/` - Full page components (LoginPage, VillagePage, MyHousePage, etc.)

### Supabase Database Schema

**Key Tables:**
- `campaigns` - Donation campaigns (CRUD by organizations)
- `users` - User profiles linked to DID/email
- `donations` - Donation records (mirrored from blockchain)
- `furniture_owned` - User inventory (gamification)
- `user_badges` - Achievement system

**RLS Policies:** All tables have Row Level Security enabled. Check `backend/supabase/schema.sql` for policy definitions.

### DID Authentication

DID (Decentralized Identity) is implemented via `lib/did.ts`:
- Generates DIDs from wallet addresses
- Stores DID in Supabase user metadata
- Used as primary user identifier across the app
- Fallback to email-based auth for non-crypto users

## Common Development Workflows

### Adding a New Page
1. Create component in `frontend/src/pages/`
2. Import and add route in `App.tsx`
3. Update navigation in relevant components
4. Add any required API calls to `lib/supabase-api.ts`

### Modifying Smart Contract
1. Edit contract in `blockchain/contracts/`
2. Update tests if needed
3. Compile: `npm run blockchain:compile`
4. Test: `npm run blockchain:test`
5. Deploy to testnet: `npm run blockchain:deploy:sepolia`
6. Update `VITE_CONTRACT_ADDRESS` in frontend .env
7. If ABI changes, update contract imports in `lib/contract.ts`

### Adding a Database Table
1. Add CREATE TABLE to `backend/supabase/schema.sql`
2. Add RLS policies
3. Create TypeScript types in `frontend/src/types/`
4. Add query functions to `lib/supabase-api.ts`
5. Apply migration: `supabase db push`

### Testing Donations End-to-End
1. Get Arbitrum Sepolia ETH from faucet: https://www.alchemy.com/faucets/arbitrum-sepolia
2. Ensure wallet is connected in frontend
3. Ensure Supabase is configured correctly
4. Create campaign as organization user
5. Make donation as regular user
6. Verify transaction on Arbiscan: https://sepolia.arbiscan.io
7. Verify donation record in Supabase Table Editor
8. Confirm campaign `current_amount` updated

## Deployment

### Frontend (Vercel)
- Connected to Git (auto-deploy on push)
- Set environment variables in Vercel dashboard
- Build command: `npm run frontend:build`
- Output directory: `frontend/build`
- Framework preset: Vite

### Smart Contracts (Arbitrum Sepolia)
```bash
cd blockchain/hardhat-setup
npx hardhat run scripts/deploy.js --network arbitrumSepolia
```
Save deployed contract address and update frontend .env.

### Backend (Supabase)
- Database migrations: `supabase db push`
- Edge Functions: `supabase functions deploy`
- No separate server deployment needed (BaaS)

## Troubleshooting

**"Cannot find module" errors in blockchain:**
- Ensure you're in `blockchain/hardhat-setup/` directory
- Run `npm install` in that directory specifically
- Check `hardhat.config.js` paths match your structure

**Frontend can't connect to contract:**
- Verify `VITE_CONTRACT_ADDRESS` is set
- Verify wallet is on Arbitrum Sepolia (Chain ID: 421614)
- Check contract is deployed: visit address on https://sepolia.arbiscan.io
- Check browser console for ethers.js errors

**Supabase queries failing:**
- Check RLS policies in Supabase dashboard
- Verify user is authenticated (check `supabase.auth.getSession()`)
- Check `VITE_ENABLE_BACKEND=true` in .env
- Check browser network tab for 403/401 errors

**Hardhat version conflicts:**
- This project uses Hardhat 2.22.x (NOT 3.x)
- OpenZeppelin 5.0.0 requires Hardhat ^2.22.0
- If upgrading, test thoroughly as migration to Hardhat 3 breaks plugins

## Important Files

**DO NOT MODIFY WITHOUT UNDERSTANDING:**
- `backend/supabase/functions/server/kv_store.tsx` - Protected KV store logic
- `blockchain/hardhat-setup/hardhat.config.js` - Network configurations
- `frontend/src/lib/auth-context.tsx` - Core auth state
- `backend/supabase/schema.sql` - Database structure

**Reference Documentation:**
- `/docs/deployment/` - Deployment guides
- `/docs/setup/` - Initial setup instructions
- `/docs/guides/` - Feature guides
- `/docs/fixes/` - Troubleshooting solutions

## Testing

No formal test suite configured yet for frontend. Blockchain has Hardhat test setup.

**Manual testing checklist:**
- Login flow (DID + OAuth)
- Campaign CRUD (organization users)
- Donation flow (blockchain + DB)
- Points accumulation
- Inventory/badge system
- Real-time updates

## Code Style

- TypeScript strict mode enabled
- Functional React components (no class components)
- Async/await over .then() for promises
- Tailwind CSS for styling (no CSS modules)
- ESM imports throughout (no require() except hardhat.config.js)
