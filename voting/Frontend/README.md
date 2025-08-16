# Blockchain Voting DApp

A decentralized voting application built with React, Ethers.js, and Solidity smart contracts.

## 🚀 Features

- **Secure Voting**: Blockchain-based voting with immutable records
- **Admin Dashboard**: Manage candidates, register voters, and control elections
- **Voter Portal**: Easy-to-use interface for casting votes
- **Real-time Results**: Live election results with statistics
- **Wallet Integration**: MetaMask integration for secure transactions

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS
- **Blockchain**: Ethers.js v6
- **Smart Contracts**: Solidity
- **Build Tool**: Create React App

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- A Web3-enabled browser

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voting
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the smart contract**
   - Deploy the Voting smart contract to your preferred network
   - Update the contract address in `src/App.js`:
     ```javascript
     const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
     const ADMIN_ADDRESS = 'YOUR_ADMIN_WALLET_ADDRESS';
     ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
voting/
├── public/
│   └── index.html
├── src/
│   ├── component/
│   │   ├── AdminDashboard.js    # Admin interface
│   │   ├── Footer.js           # Footer component
│   │   ├── Header.js           # Navigation header
│   │   ├── LandingPage.js      # Home page
│   │   ├── ResultsPage.js      # Election results
│   │   └── VoterPortal.js      # Voting interface
│   ├── contracts/
│   │   └── Voting.json         # Smart contract ABI
│   ├── App.js                  # Main application component
│   ├── index.js                # Application entry point
│   └── index.css               # Global styles with Tailwind
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 🔐 Smart Contract Functions

The Voting smart contract includes the following functions:

### Admin Functions
- `addCandidate(string memory candidateName)` - Add a new candidate
- `registerVoter(address voterAddress)` - Register a voter
- `startElection()` - Start the voting process
- `finalizeElection()` - End and finalize the election

### View Functions
- `electionTitle()` - Get election title
- `getElectionStatus()` - Get current election status
- `getCandidatesCount()` - Get total number of candidates
- `getCandidate(uint256 candidateId)` - Get candidate details
- `isVoterRegistered(address voter)` - Check if address is registered
- `hasVoted(address voter)` - Check if voter has already voted

### Voter Functions
- `vote(uint256 candidateId)` - Cast a vote for a candidate

## 🎯 Usage

### For Administrators
1. Connect your admin wallet
2. Navigate to the Admin Dashboard
3. Add candidates to the election
4. Register eligible voters
5. Start the election when ready
6. Finalize the election when voting ends

### For Voters
1. Connect your registered wallet
2. Navigate to the Voting Portal
3. Select your preferred candidate
4. Cast your vote
5. View real-time results

## 🐛 Recent Fixes Applied

The following issues were identified and resolved:

1. **Duplicate Entry Points**: Removed conflicting `index.js` and `main.jsx` files
2. **Missing Tailwind CSS**: Added proper Tailwind directives to `index.css`
3. **Empty Components**: Implemented missing `Header.js`, `VoterPortal.js`, and `ResultsPage.js`
4. **Ethers.js Compatibility**: Updated code to work with Ethers.js v6
5. **Import Path Issues**: Fixed component import paths in `App.js`
6. **Missing Contract Functions**: Added complete ABI with all required functions
7. **Dependency Conflicts**: Downgraded React to v18 for better compatibility
8. **Tailwind Configuration**: Fixed PostCSS and Tailwind configuration for v3
9. **Build Issues**: Resolved entry point and build configuration problems

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_CONTRACT_ADDRESS=your_contract_address
REACT_APP_ADMIN_ADDRESS=your_admin_address
```

### Network Configuration
The app is configured to work with Ethereum networks. Update the network configuration in your MetaMask wallet to connect to the appropriate network.

## 🚨 Security Notes

- Always verify the smart contract address before voting
- Ensure you're connected to the correct network
- Never share your private keys or seed phrases
- Verify transaction details before confirming

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.
