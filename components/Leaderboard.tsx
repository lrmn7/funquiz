"use client";

interface LeaderboardEntry {
  player: `0x${string}`;
  score: bigint;
}

interface LeaderboardProps {
  quizId: number;
  isLoading: boolean;
  sortedLeaderboard: LeaderboardEntry[];
  refetch: () => void;
  isOwner: boolean;
  onDownload: () => void;
}

const Leaderboard = ({
  isLoading,
  sortedLeaderboard,
  refetch,
  isOwner,
  onDownload,
}: LeaderboardProps) => {
  return (
    <div className="bg-surface p-6 rounded-lg border border-border h-full flex flex-col">
      <h2 className="text-2xl font-bold text-primary mb-4 text-center">
        Leaderboard
      </h2>
      <div className="flex-grow">
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
                    {`${entry.player.substring(
                      0,
                      6
                    )}...${entry.player.substring(entry.player.length - 4)}`}
                  </p>
                </div>
                <span className="font-bold text-primary text-md">
                  {entry.score.toString()} PTS
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="text-center mt-4">
        {isOwner && (
          <button
            onClick={onDownload}
            className="w-full py-2 mb-3 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Download Leaderboard (CSV)
          </button>
        )}
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
