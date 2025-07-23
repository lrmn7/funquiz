"use client";
export const runtime = "edge";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFunQuizContract } from "@/hooks/useFunQuizContract";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import Button from "@/components/ui/Button";
import Leaderboard from "@/components/Leaderboard";
import PlayQuizGame from "@/components/PlayQuizGame";
import { toast } from "react-toastify";
import { formatEther } from "viem";

const QuizLobbyPage = () => {
  const params = useParams();
  const router = useRouter();
  const quizId = parseInt(params.id as string);

  const { isConnected } = useAccount();
  const [gameState, setGameState] = useState<"lobby" | "playing">("lobby");

  const {
    useGetQuizById,
    useGetPlayQuizFee,
    useGetHasPaidStatus,
    payToPlay,
    hash,
  } = useFunQuizContract();

  const {
    data: rawQuizData,
    isLoading: isQuizLoading,
    isError: isQuizError,
    error: quizError,
  } = useGetQuizById(quizId);

  console.log("DIAGNOSTIK KUIS:", {
    id: quizId,
    isLoading: isQuizLoading,
    isError: isQuizError,
    error: quizError,
    rawData: rawQuizData,
  });

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
      creator: (rawQuizData as any).creator,
      questions: (rawQuizData as any).questions,
    };
  }, [rawQuizData]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Payment successful! You can now play the quiz.");
      refetchPaidStatus();
    }
  }, [isConfirmed, refetchPaidStatus]);

  const handlePayToPlay = () => {
    if (!isConnected) return toast.error("Please connect your wallet.");
    if (playFee === undefined) return toast.error("Could not fetch play fee.");
    toast.info("Please confirm the transaction in your wallet to pay the fee.");
    payToPlay(quizId, playFee as bigint);
  };

const handleShare = () => {
  if (!formattedQuizData) return;

  const quizTitle = formattedQuizData.title;
  const currentPageUrl = window.location.href;

  const caption = `think you’re smart enough to crack this quiz?\n\ni just played a quiz on #FunQuiz, a web3-powered game on @Somnia_Network where anyone can join or create on-chain quizzes.\n\nquiz: "${quizTitle}"\n\ncan you beat my score or will your brain explode? \n👉`;

  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}&url=${encodeURIComponent(currentPageUrl)}`;

  window.open(twitterIntentUrl, "_blank", "noopener,noreferrer");
};


  if (isNaN(quizId)) {
    return (
      <div className="text-center text-red-500 text-xl">Invalid Quiz ID.</div>
    );
  }

  if (isQuizLoading || isFeeLoading) {
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

  if (gameState === "playing") {
    return (
      <PlayQuizGame
        quizId={quizId}
        quizData={formattedQuizData as any}
        onQuizFinish={() => setGameState("lobby")}
      />
    );
  }

  const feeInEther =
    playFee !== undefined ? formatEther(playFee as bigint) : "...";

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 bg-surface p-6 md:p-8 rounded-lg border border-border">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            {formattedQuizData.title}
          </h1>

          {/* --- Buttom Share to X --- */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
            <p className="text-sm text-secondary break-all">
              Created by:{" "}
              <span className="font-mono">{formattedQuizData.creator}</span>
            </p>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
            >
              <svg viewBox="0 0 1200 1227" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="w-4 h-4" fill="currentColor"><path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"></path></svg>
              Share
            </button>
          </div>
          {/* --- Buttom Share to X --- */}

          <div className="prose prose-invert text-gray-300 mb-10 max-w-none">
            <p>
              🎉 <strong>Welcome to FunQuiz, where quizzes get weird!</strong>
            </p>
            <p>
              This isn’t your average quiz.
              <br />
              Things might flip, twist, or totally troll you and that’s the
              point.
            </p>
            <p>
              You’ve got one job: <em>survive the questions</em>.<br />
              The rules? Who knows.
              <br />
              The answers? Maybe.
            </p>
            <p>
              Tap in, think fast, and embrace the chaos.
              <br />
              <strong>Let the madness begin!</strong> 🌀🧠💥
            </p>
          </div>

          {hasPaid ? (
            <Button
              onClick={() => setGameState("playing")}
              className="w-full py-3 text-lg bg-green-600 hover:bg-green-700"
            >
              Play Quiz
            </Button>
          ) : (
            <Button
              onClick={handlePayToPlay}
              isLoading={isConfirming}
              className="w-full py-3 text-lg leading-tight"
            >
              {isConfirming ? (
                "Processing Payment..."
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
          <Leaderboard quizId={quizId} />
        </div>
      </div>
    </div>
  );
};

export default QuizLobbyPage;