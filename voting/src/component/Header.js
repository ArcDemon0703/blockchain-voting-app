import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ currentAccount, connectWallet, isAdmin }) => {
  return (
    <header className="bg-blue-700 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold">
            🇮🇳 Blockchain Voting DApp
          </Link>
          <div className="ml-8 text-lg hidden md:block">
            <Link to="/" className="mr-6 hover:text-gray-300">Home</Link>
            <Link to="/vote" className="mr-6 hover:text-gray-300">Vote</Link>
            <Link to="/results" className="mr-6 hover:text-gray-300">Results</Link>
            {isAdmin && (
              <Link to="/admin" className="hover:text-gray-300">Admin</Link>
            )}
          </div>
        </div>
        <div>
          {currentAccount ? (
            <div className="flex items-center">
              <span className="mr-2 text-sm">Connected:</span>
              <span className="font-mono bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                {currentAccount.substring(0, 6)}...{currentAccount.substring(38)}
              </span>
            </div>
          ) : (
            <button 
              onClick={connectWallet} 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;