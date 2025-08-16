import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

function AdminDashboard({ contract, isAdmin }) {
  const [candidateName, setCandidateName] = useState('');
  const [voterAddress, setVoterAddress] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [electionStatus, setElectionStatus] = useState({ started: false, finalized: false });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchElectionData = useCallback(async () => {
    if (!contract) return;
    try {
      const started = await contract.electionStarted();
      const finalized = await contract.electionFinalized();
      setElectionStatus({ started, finalized });
      
      const totalCandidates = await contract.totalCandidates();
      const candidatesArray = [];
      for (let i = 0; i < totalCandidates; i++) {
        // Use getCandidate() for structs as direct access can be tricky
        const candidate = await contract.getCandidate(i);
        candidatesArray.push({ name: candidate.name, voteCount: candidate.count.toString() });
      }
      setCandidates(candidatesArray);
    } catch (error) {
      console.error("Error fetching election data:", error);
      setMessage("Error: Could not fetch election data. Check console for details.");
    }
  }, [contract]);

  useEffect(() => {
    fetchElectionData();
  }, [contract, fetchElectionData]);

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!contract || !candidateName) return;
    setIsLoading(true);
    setMessage(`Adding candidate "${candidateName}"...`);
    try {
      const tx = await contract.addCandidate(candidateName);
      await tx.wait();
      setMessage(`Candidate "${candidateName}" added successfully!`);
      setCandidateName('');
      await fetchElectionData(); // Refresh data
    } catch (error) {
      console.error("Error adding candidate:", error);
      setMessage(`Error: ${error.reason || "Transaction failed."}`);
    }
    setIsLoading(false);
  };

  const handleRegisterVoter = async (e) => {
    e.preventDefault();
    if (!contract || !voterAddress || !aadhaarNumber) return;
    setIsLoading(true);
    setMessage(`Registering voter ${voterAddress}...`);
    try {
      const aadhaarHash = ethers.solidityPackedKeccak256(['string'], [aadhaarNumber]);
      const tx = await contract.registerVoter(voterAddress, aadhaarHash);
      await tx.wait();
      setMessage(`Voter ${voterAddress} registered successfully!`);
      setVoterAddress('');
      setAadhaarNumber('');
    } catch (error) {
      console.error("Error registering voter:", error);
      setMessage(`Error: ${error.reason || "Transaction failed."}`);
    }
    setIsLoading(false);
  };

  const handleStartElection = async () => {
    if (!contract) return;
    setIsLoading(true);
    setMessage('Starting election...');
    try {
      const tx = await contract.startElection();
      await tx.wait();
      setMessage('Election started successfully!');
      await fetchElectionData(); // Refresh data
    } catch (error) {
      console.error("Error starting election:", error);
      setMessage(`Error: ${error.reason || "Transaction failed."}`);
    }
    setIsLoading(false);
  };

  const handleFinalizeElection = async () => {
    if (!contract) return;
    setIsLoading(true);
    setMessage('Finalizing election...');
    try {
      const tx = await contract.finalizeElection();
      await tx.wait();
      setMessage('Election finalized successfully!');
      await fetchElectionData(); // Refresh data
    } catch (error) {
      console.error("Error finalizing election:", error);
      setMessage(`Error: ${error.reason || "Transaction failed."}`);
    }
    setIsLoading(false);
  };

  if (!isAdmin) {
    return <div className="text-center text-red-600 font-bold">Access Denied: You are not the admin.</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      {/* Forms and buttons go here, the JSX is correct */}
      {/* ... The rest of your JSX from the previous file is fine ... */}
            {/* --- ELECTION CONTROL --- */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Election Control</h2>
        <div className="flex space-x-4">
          <button
            onClick={handleStartElection}
            disabled={isLoading || electionStatus.started}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            Start Election
          </button>
          <button
            onClick={handleFinalizeElection}
            disabled={isLoading || !electionStatus.started || electionStatus.finalized}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
          >
            Finalize Election
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
            Status: {electionStatus.finalized ? 'Finalized' : electionStatus.started ? 'In Progress' : 'Not Started'}
        </p>
      </div>

      {/* --- MANAGE CANDIDATES --- */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Manage Candidates</h2>
        <form onSubmit={handleAddCandidate} className="space-y-4">
          <div>
            <label htmlFor="candidateName" className="block text-sm font-medium text-gray-700">Candidate Name</label>
            <input
              id="candidateName"
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              disabled={electionStatus.started}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200"
            />
          </div>
          <button type="submit" disabled={isLoading || electionStatus.started} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
            Add Candidate
          </button>
        </form>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Current Candidates:</h3>
          <ul className="list-disc list-inside mt-2">
            {candidates.map((candidate, index) => (
              <li key={index}>{candidate.name} (Votes: {candidate.voteCount})</li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- REGISTER VOTERS --- */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Register Voters</h2>
        <form onSubmit={handleRegisterVoter} className="space-y-4">
          <div>
            <label htmlFor="voterAddress" className="block text-sm font-medium text-gray-700">Voter Wallet Address</label>
            <input
              id="voterAddress"
              type="text"
              value={voterAddress}
              onChange={(e) => setVoterAddress(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="aadhaarNumber" className="block text-sm font-medium text-gray-700">Aadhaar Number (will be hashed)</label>
            <input
              id="aadhaarNumber"
              type="text"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
            Register Voter
          </button>
        </form>
      </div>

      {/* --- STATUS MESSAGE --- */}
      {message && (
        <div className={`p-4 rounded-md ${message.startsWith('Error:') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;