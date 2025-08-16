import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ethers } from 'ethers';
import LandingPage from './component/LandingPage';
import AdminDashboard from './component/AdminDashboard';
import VoterPortal from './component/VoterPortal';
import ResultsPage from './component/ResultsPage';
import Header from './component/Header';
import Footer from './component/Footer';
import contractAbi from './contracts/Voting.json';

// IMPORTANT: Make sure this is the address from your latest deployment!
const CONTRACT_ADDRESS = '0x716ee60BB389CEd762b843097735Eb2396634eC3';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const updateEthers = async () => {
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);

      const accounts = await newProvider.send("eth_accounts", []);
      if (accounts.length > 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        
        const newSigner = await newProvider.getSigner();
        setSigner(newSigner);

        const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, newProvider);
        setContract(newContract);
        
        try {
          const ownerAddress = await newContract.owner();
          setIsAdmin(account.toLowerCase() === ownerAddress.toLowerCase());
        } catch (error) {
          console.error("Could not get contract owner. Is the contract address correct and are you on the right network?", error);
        }
      } else {
        setCurrentAccount(null);
        setIsAdmin(false);
      }
    }
  };

  useEffect(() => {
    updateEthers();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      alert('MetaMask is not installed or available.');
      return;
    }
    try {
      await provider.send("eth_requestAccounts", []);
      updateEthers();
    } catch (error) {
      console.error('User denied account access:', error);
    }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header currentAccount={currentAccount} connectWallet={connectWallet} isAdmin={isAdmin} />
        <main className="flex-grow container mx-auto p-4">
          <Routes>
            <Route path="/" element={<LandingPage contract={contract} />} />
            <Route path="/results" element={<ResultsPage contract={contract} />} />
            <Route path="/admin" element={<AdminDashboard contract={contract && signer ? contract.connect(signer) : null} isAdmin={isAdmin} />} />
            <Route path="/vote" element={<VoterPortal contract={contract && signer ? contract.connect(signer) : null} currentAccount={currentAccount} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;