import React, { useState, useEffect } from 'react';

function LandingPage({ contract }) {
  const [status, setStatus] = useState('Loading election details...');
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const getStatus = async () => {
      if (!contract) return;
      try {
        const started = await contract.electionStarted();
        const finalized = await contract.electionFinalized();
        setIsStarted(started);
        
        if (finalized) {
          setStatus('The election has ended.');
        } else if (started) {
          setStatus('The election is currently in progress.');
        } else {
          setStatus('The election has not started yet.');
        }
      } catch (error) {
        console.error("Error fetching landing page status:", error);
        setStatus('Failed to load election details.');
      }
    };
    getStatus();
  }, [contract]);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Decentralized Voting System</h1>
      <p className={`text-xl ${isStarted ? 'text-green-600' : 'text-red-600'}`}>
        {status}
      </p>
    </div>
  );
}

export default LandingPage;