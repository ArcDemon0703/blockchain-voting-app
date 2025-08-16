import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 p-4 mt-8">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Blockchain Voting DApp. All rights reserved.</p>
        <p className="mt-1">Powered by Ethereum</p>
      </div>
    </footer>
  );
};

export default Footer;