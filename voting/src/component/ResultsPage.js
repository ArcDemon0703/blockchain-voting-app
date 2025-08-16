import React, { useState, useEffect } from 'react';

const ResultsPage = ({ contract }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [winner, setWinner] = useState("N/A");
  const [isFinalized, setIsFinalized] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!contract) return;
      setLoading(true);
      try {
        const finalized = await contract.electionFinalized();
        setIsFinalized(finalized);

        // Use the correct public variable 'totalCandidates'
        const totalCandidates = await contract.totalCandidates();
        const fetchedResults = [];
        for (let i = 0; i < totalCandidates; i++) {
          const candidate = await contract.getCandidate(i);
          fetchedResults.push({ 
            id: i, 
            name: candidate.name, 
            votes: Number(candidate.count) // Convert BigInt to number for calculations
          });
        }
        setResults(fetchedResults);

        if (finalized) {
          // Use the contract's getWinner function as the source of truth
          const winnerData = await contract.getWinner();
          setWinner(`${winnerData.winnerName} with ${winnerData.voteTotal} votes`);
        } else {
            // If not finalized, determine the current leader
            if (fetchedResults.length > 0) {
                const currentLeader = fetchedResults.reduce((prev, current) => 
                    (prev.votes > current.votes) ? prev : current
                );
                setWinner(`${currentLeader.name} is currently leading`);
            }
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [contract]);

  const totalVotes = results.reduce((sum, candidate) => sum + candidate.votes, 0);

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading results...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Election Results</h2>

      <div className={`${isFinalized ? 'bg-green-600' : 'bg-blue-600'} text-white p-6 rounded-lg shadow-lg text-center mb-8`}>
        <h3 className="text-2xl font-bold">{isFinalized ? 'Winner' : 'Current Leader'}</h3>
        <p className="text-4xl font-extrabold mt-2">{winner}</p>
        <p className="text-lg mt-2">Total Votes Cast: {totalVotes}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Vote Breakdown</h3>
        <div className="space-y-4">
          {results.length > 0 ? results.map(candidate => (
            <div key={candidate.id} className="flex items-center">
              <span className="text-lg font-semibold w-1/3">{candidate.name}</span>
              <div className="w-2/3 bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-500 h-4 rounded-full" 
                  style={{ width: `${totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="ml-4 w-16 text-right font-bold">{candidate.votes}</span>
            </div>
          )) : <p>No candidates have been added yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;