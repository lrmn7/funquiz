"use client";

import { useFunQuizContract } from "@/hooks/useFunQuizContract";
import { useMemo } from "react";

interface LeaderboardProps {
  quizId: number;
}

const Leaderboard = ({ quizId }: LeaderboardProps) => {
  const { useGetLeaderboard } = useFunQuizContract();
  const {
    data: rawLeaderboardData,
    isLoading,
    refetch,
  } = useGetLeaderboard(quizId);
  const sortedLeaderboard = useMemo(() => {
    if (
      !rawLeaderboardData ||
      !rawLeaderboardData[0] ||
      !rawLeaderboardData[1]
    ) {
      return [];
    }

    const addresses = rawLeaderboardData[0] as `0x${string}`[];
    const scores = rawLeaderboardData[1] as bigint[];

    const combined = addresses.map((address, index) => ({
      player: address,
      score: scores[index],
    }));

    return combined.sort((a, b) => Number(b.score) - Number(a.score));
  }, [rawLeaderboardData]);

  return (
    <div className="bg-surface p-6 rounded-lg border border-border h-full">
      <h2 className="text-2xl font-bold text-primary mb-4 text-center">
        Leaderboard
      </h2>
      {isLoading && <p className="text-center text-secondary">Loading...</p>}
      {!isLoading && sortedLeaderboard.length === 0 ? (
        <p className="text-center text-secondary">
          Be the first to get on the leaderboard!
        </p>
      ) : (
        <ul className="space-y-3">
          {sortedLeaderboard.slice(0, 10).map((entry, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-800 p-3 rounded-md"
            >
              <div className="flex items-center">
                <span
                  className={`font-bold text-lg w-8 ${
                    index === 0
                      ? "text-yellow-400"
                      : index === 1
                      ? "text-gray-300"
                      : index === 2
                      ? "text-yellow-600"
                      : "text-primary"
                  }`}
                >
                  #{index + 1}
                </span>
                <p
                  className="text-white ml-3 text-sm truncate"
                  title={entry.player}
                >
                  {`${entry.player.substring(0, 6)}...${entry.player.substring(
                    entry.player.length - 4
                  )}`}
                </p>
              </div>
              <span className="font-bold text-primary text-md">
                {entry.score.toString()} PTS
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="text-center mt-4">
        <button
          onClick={() => refetch()}
          className="text-sm text-secondary hover:text-primary transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
