"use client";
export const runtime = "edge";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useFunQuizContract } from "@/hooks/useFunQuizContract";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import Button from "@/components/ui/Button";
import Leaderboard from "@/components/Leaderboard";
import PlayQuizGame from "@/components/PlayQuizGame";
import { toast } from "react-toastify";
import { formatEther } from "viem";
import { FiAlertTriangle } from "react-icons/fi";

const QuizLobbyPage = () => {
  const params = useParams();
  const quizId = parseInt(params.id as string);

  const { address, isConnected } = useAccount();
  const [gameState, setGameState] = useState<"lobby" | "playing">("lobby");

  const {
    useGetQuizById,
    useGetPlayQuizFee,
    useGetHasPaidStatus,
    payToPlay,
    hash,
    isPending,
    useGetLeaderboard,
    useGetPlayerScore,
  } = useFunQuizContract();

  const {
    data: rawQuizData,
    isLoading: isQuizLoading,
    isError: isQuizError,
    error: quizError,
  } = useGetQuizById(quizId);

  const { data: playerScore, isLoading: isScoreLoading } =
    useGetPlayerScore(quizId);
  const hasPlayed = useMemo(
    () => playerScore !== undefined && Number(playerScore) > 0,
    [playerScore]
  );

  const {
    data: rawLeaderboardData,
    isLoading: isLeaderboardLoading,
    refetch: refetchLeaderboard,
  } = useGetLeaderboard(quizId);
  const sortedLeaderboard = useMemo(() => {
    if (!rawLeaderboardData || !rawLeaderboardData[0] || !rawLeaderboardData[1])
      return [];
    const addresses = rawLeaderboardData[0] as `0x${string}`[];
    const scores = rawLeaderboardData[1] as bigint[];
    const combined = addresses.map((address, index) => ({
      player: address,
      score: scores[index],
    }));
    return combined.sort((a, b) => Number(b.score) - Number(a.score));
  }, [rawLeaderboardData]);

  const { data: playFee, isLoading: isFeeLoading } = useGetPlayQuizFee();
  const { data: hasPaid, refetch: refetchPaidStatus } =
    useGetHasPaidStatus(quizId);
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const formattedQuizData = useMemo(() => {
    if (!rawQuizData) return null;
    return {
      id: (rawQuizData as any).id,
      title: (rawQuizData as any).title,
      description: (rawQuizData as any).description,
      creator: (rawQuizData as any).creator,
      questions: (rawQuizData as any).questions,
    };
  }, [rawQuizData]);

  const isOwner = useMemo(() => {
    if (!address || !formattedQuizData?.creator) return false;
    return address.toLowerCase() === formattedQuizData.creator.toLowerCase();
  }, [address, formattedQuizData?.creator]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Payment successful! You can now play the quiz.");
      refetchPaidStatus();
    }
  }, [isConfirmed, refetchPaidStatus]);

  const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) return "";
    const headers = ["rank", "player", "score"];
    const csvRows = [
      headers.join(","),
      ...data.map((row, index) => {
        const rank = index + 1;
        const score = row.score.toString();
        return [rank, row.player, score].join(",");
      }),
    ];
    return csvRows.join("\r\n");
  };

  const handleDownloadLeaderboard = () => {
    if (sortedLeaderboard.length === 0) {
      toast.error("No leaderboard data to download.");
      return;
    }
    const csvData = convertToCSV(sortedLeaderboard);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const quizTitle = formattedQuizData?.title.replace(/\s+/g, "_") || "quiz";
    link.setAttribute("download", `leaderboard_${quizTitle}_${quizId}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Leaderboard downloaded!");
  };

  const handlePayToPlay = () => {
    if (!isConnected) return toast.error("Please connect your wallet.");
    if (playFee === undefined) return toast.error("Could not fetch play fee.");
    toast.info("Please confirm the transaction in your wallet to pay the fee.");
    payToPlay(quizId, playFee as bigint);
  };

  const handleShare = () => {
    if (!formattedQuizData) return;
    const quizTitle = formattedQuizData.title;
    const quizDescription = formattedQuizData.description;
    const currentPageUrl = window.location.href;
    const caption = `📝 quiz: "${quizTitle}"\n📜 about: ${quizDescription}\n ⚡ dare to try? ${currentPageUrl}\n\n #FunQuiz #SomniaNetwork`;
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      caption
    )}`;
    window.open(twitterIntentUrl, "_blank", "noopener,noreferrer");
  };

  if (isNaN(quizId)) {
    return (
      <div className="text-center text-red-500 text-xl">Invalid Quiz ID.</div>
    );
  }

  if (isQuizLoading || isFeeLoading || isLeaderboardLoading || isScoreLoading) {
    return (
      <div className="text-center text-primary text-xl">
        Loading Quiz Details...
      </div>
    );
  }

  if (isQuizError) {
    return (
      <div className="text-center text-red-500 bg-surface p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Failed to Load Quiz</h2>
        <p className="text-xs font-mono mt-2 break-all">
          Error Details: {quizError?.message}
        </p>
      </div>
    );
  }

  if (
    !formattedQuizData ||
    formattedQuizData.creator === "0x0000000000000000000000000000000000000000"
  ) {
    return (
      <div className="text-center text-red-500 text-xl">
        Quiz not found on this contract.
      </div>
    );
  }

  if (gameState === "playing" && (!hasPaid || hasPlayed)) {
    setGameState("lobby");
  }

  if (gameState === "playing" && hasPaid && !hasPlayed) {
    return (
      <PlayQuizGame
        quizId={quizId}
        quizData={formattedQuizData as any}
        onQuizFinish={() => {
          setGameState("lobby");
        }}
      />
    );
  }

  const feeInEther =
    playFee !== undefined ? formatEther(playFee as bigint) : "...";

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 bg-surface p-6 md:p-8 rounded-lg border border-border">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 break-words">
            {formattedQuizData.title}
          </h1>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
            <p className="text-sm text-secondary break-all">
              Created by:{" "}
              <span className="font-mono">
                {formattedQuizData.creator &&
                  `${formattedQuizData.creator.substring(
                    0,
                    6
                  )}...${formattedQuizData.creator.substring(
                    formattedQuizData.creator.length - 4
                  )}`}
              </span>
            </p>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <svg
                viewBox="0 0 1200 1227"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-4 h-4"
                fill="currentColor"
              >
                <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"></path>
              </svg>
              Share
            </button>
          </div>

          <div className="prose prose-invert text-gray-300 mb-10 max-w-none">
            <p className="whitespace-pre-wrap break-words">
              {formattedQuizData.description}
            </p>
          </div>

          {hasPaid ? (
            hasPlayed ? (
              <div className="w-full text-center bg-gray-800 text-yellow-400 border border-yellow-500 rounded-lg p-4 flex items-center justify-center gap-3">
                <FiAlertTriangle size={24} />
                <span className="font-semibold">
                  You've already taken this quiz
                </span>
              </div>
            ) : (
              <Button
                onClick={() => setGameState("playing")}
                className="w-full py-3 text-lg bg-green-600 hover:bg-green-700"
              >
                Play Quiz
              </Button>
            )
          ) : (
            <Button
              onClick={handlePayToPlay}
              isLoading={isPending || isConfirming}
              className="w-full py-3 text-lg leading-tight"
            >
              {isConfirming ? (
                "Processing Payment..."
              ) : isPending ? (
                "Waiting for Wallet..."
              ) : (
                <div className="flex flex-col items-center">
                  <span>Play Quiz</span>
                  <span className="text-xs font-normal opacity-80 mt-1">
                    Fee {feeInEther} STT
                  </span>
                </div>
              )}
            </Button>
          )}
        </div>

        <div className="lg:col-span-1">
          <Leaderboard
            isLoading={isLeaderboardLoading}
            sortedLeaderboard={sortedLeaderboard}
            refetch={refetchLeaderboard}
            isOwner={isOwner}
            onDownload={handleDownloadLeaderboard}
            quizId={quizId}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizLobbyPage;
