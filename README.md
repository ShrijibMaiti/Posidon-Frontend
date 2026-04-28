# Posidon Frontend | AI-Driven Flood Accountability Ledger

Posidon is a next-generation disaster response and accountability platform. It integrates real-time machine learning flood simulations with a Web3 cryptographic ledger to ensure that environmental data and emergency responses are immutable, verifiable, and transparent.

## 🚀 Key Features

- **Dynamic Geospatial Visualization**: Real-time rendering of predicted vs. actual flood extents using Mapbox/GeoJSON.
- **ML-Web3 Integration**: Automated hashing of simulation payloads for on-chain anchoring.
- **Accountability Ledger**: Smart contract-based auditing system to prevent data tampering during emergencies.
- **Multilingual Support**: Integrated Bengali audio alerts for localized emergency broadcast simulations.
- **Decoupled Architecture**: High-performance React/Vite frontend architecturally separated from the EVM smart contract backend.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Web3**: Ethers.js, Hardhat, Solidity
- **Geospatial**: Mapbox GL JS

## 🏗️ Architecture

The system operates on a **Verification-First** principle:
1. **Simulation**: ML models generate flood extent predictions.
2. **Hashing**: The frontend generates a unique cryptographic hash of the simulation metadata.
3. **Anchoring**: This hash is submitted to the `AccountabilityChain` smart contract.
4. **Validation**: Stakeholders can verify the authenticity of flood data by comparing the live state against the on-chain anchor.

## 📦 Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/ShrijibMaiti/Posidon-Frontend.git](https://github.com/ShrijibMaiti/Posidon-Frontend.git)
