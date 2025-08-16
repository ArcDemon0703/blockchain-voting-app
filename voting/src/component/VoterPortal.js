import React, { useState, useEffect } from 'react';

const VoterPortal = ({ contract, currentAccount }) => {
  const [candidates, setCandidates] = useState([]);
  const [voterStatus, setVoterStatus] = useState({ isRegistered: false, hasVoted: false });
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTxnLoading, setIsTxnLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!contract || !currentAccount) return;
      setLoading(true);
      setMessage('');
      try {
        const totalCandidates = await contract.totalCandidates();
        const fetchedCandidates = [];
        for (let i = 0; i < totalCandidates; i++) {
          const candidate = await contract.getCandidate(i);
          fetchedCandidates.push({ id: i, name: candidate.name });
        }
        setCandidates(fetchedCandidates);

        const { isRegistered, voted } = await contract.getMyVotingStatus();
        setVoterStatus({ isRegistered, hasVoted: voted });
      } catch (error) {
        console.error('Error fetching voter data:', error);
        setMessage('Error fetching portal data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [contract, currentAccount]);

  // --- THIS FUNCTION IS NOW UPDATED ---
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!contract || !aadhaarInput) return;
    setIsTxnLoading(true);
    setMessage('Verifying and processing your registration...');
    try {
      // Step 1: Send Aadhaar number to our secure backend to get it hashed
      const response = await fetch('http://localhost:5000/hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aadhaarNumber: aadhaarInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get hash from server.');
      }
      
      const aadhaarHash = data.hash;

      // Step 2: Send the hash received from the backend to the smart contract
      const tx = await contract.registerMyself(aadhaarHash);
      await tx.wait();
      
      setMessage('Registration successful! You may now vote.');
      setVoterStatus(prev => ({ ...prev, isRegistered: true }));
      setAadhaarInput('');
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage(`Error: ${error.message || "Registration failed."}`);
    } finally {
      setIsTxnLoading(false);
    }
  };
  
  const handleVote = async () => {
    if (selectedCandidateId === null) {
      alert('Please select a candidate to vote for.');
      return;
    }
    if (!voterStatus.isRegistered || voterStatus.hasVoted) {
      alert('You are not eligible to vote.');
      return;
    }
    setIsTxnLoading(true);
    setMessage(`Casting your vote for candidate #${selectedCandidateId}...`);
    try {
      const tx = await contract.vote(selectedCandidateId);
      await tx.wait();
      setMessage('Vote cast successfully!');
      setVoterStatus(prev => ({ ...prev, hasVoted: true }));
    } catch (error) {
      console.error('Error casting vote:', error);
      setMessage(`Error: ${error.reason || "Transaction failed."}`);
    } finally {
      setIsTxnLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading Voter Portal...</div>;
  }
  
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Voter Portal</h2>
      
      {!voterStatus.isRegistered && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-2xl font-semibold mb-4">Register to Vote</h3>
          <p className="mb-4 text-gray-600">
            You are not registered. Please enter your Aadhaar number to register.
          </p>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="aadhaarInput" className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
              <input
                id="aadhaarInput"
                type="text"
                value={aadhaarInput}
                onChange={(e) => setAadhaarInput(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button type="submit" disabled={isTxnLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
              {isTxnLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      )}

      {voterStatus.isRegistered && (
        <div>
          <div className={`p-4 mb-6 rounded-lg text-white font-semibold ${
            voterStatus.hasVoted ? 'bg-blue-500' : 'bg-green-500'
          }`}>
            {voterStatus.hasVoted ? '✅ You have already voted.' : '✅ You are registered and eligible to vote!'}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map(candidate => (
              <div 
                key={candidate.id}
                onClick={() => !voterStatus.hasVoted && setSelectedCandidateId(candidate.id)}
                className={`p-6 rounded-lg border-2 transition-colors ${
                  voterStatus.hasVoted ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'cursor-pointer'
                } ${
                  selectedCandidateId === candidate.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-400'
                }`}
              >
                <h3 className="text-xl font-bold">{candidate.name}</h3>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button 
              onClick={handleVote} 
              disabled={voterStatus.hasVoted || isTxnLoading || selectedCandidateId === null}
              className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isTxnLoading ? 'Submitting...' : 'Submit Vote'}
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className={`mt-4 text-center p-4 rounded-md ${message.startsWith('Error:') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default VoterPortal;