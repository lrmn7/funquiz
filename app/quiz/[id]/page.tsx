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
        <h2 className="text-xl font-bold mb-2">Gagal Memuat Kuis</h2>
        <p className="text-sm">
          Kemungkinan besar alamat kontrak atau ABI salah.
        </p>
        <p className="text-xs font-mono mt-2 break-all">
          Detail Error: {quizError?.message}
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

          <p className="text-sm text-secondary mb-8 break-all">
            Created by:{" "}
            <span className="font-mono">{formattedQuizData.creator}</span>
          </p>

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
