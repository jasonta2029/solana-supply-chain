# TraceChain (Solana Supply Chain Tracker)

A real-time supply chain tracking DApp built on Solana with an Anchor smart contract, an IoT python simulator, and a Next.js frontend.

## Project Structure

- `program/`: Anchor Workspace for the Solana Rust Program (Smart Contract)
- `simulator/`: Python Script that simulates an IoT GPS/Env sensor posting transactions to Solana
- `frontend/`: Next.js 14 web application using Solana Wallet Adapter, React Leaflet, and Recharts

## Setup Instructions

### Pre-requisites
- [Rust & Cargo](https://rustup.rs/)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor CLI](https://www.anchor-lang.com/docs/installation)
- [Node.js](https://nodejs.org/)
- [Python 3](https://www.python.org/)

### 1. Anchor Program
Navigate to the `program` directory:
```bash
cd solana-supply-chain/program
yarn install
anchor build
anchor test
```
To deploy to devnet:
```bash
solana config set --url devnet
anchor deploy
```
Copy your deployed Program ID into `Anchor.toml` and `lib.rs`, and rebuild/redeploy.

### 2. Frontend
Navigate to the `frontend` directory:
```bash
cd solana-supply-chain/frontend
npm install

# Create `.env.local` based on `.env.example`
cp .env.example .env.local

npm run dev
```

### 3. IoT Simulator
Navigate to the `simulator` directory:
```bash
cd solana-supply-chain/simulator
pip install -r requirements.txt
python simulator.py
```
*Note: Make sure to fund the `.config/solana/id.json` with devnet SOL so the simulator can send transactions!*

## Features
- Immutability: Real-time sensor data is stored on-chain.
- Alerting System: Thresholds set at registration trigger auto-alerts if violated.
- QR Code Tracking: URLs with dynamic visualization.
- Interactive Map: Uses Leaflet for GPS waypoint rendering.
- Graphical Charts: Uses Recharts to map time-series telemetry.

