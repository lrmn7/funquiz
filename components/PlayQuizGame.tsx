"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFunQuizContract } from "@/hooks/useFunQuizContract";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiAward } from "react-icons/fi";

type Question = {
  questionText: string;
  options: readonly [string, string, string, string];
  correctAnswerIndex: number;
  timeLimit: number;
  points: number;
};

interface PlayQuizGameProps {
  quizId: number;
  quizData: {
    title: string;
    questions: readonly Question[];
  };
  onQuizFinish: () => void;
}

const PlayQuizGame = ({
  quizId,
  quizData,
  onQuizFinish,
}: PlayQuizGameProps) => {
  const { submitScore, isPending, isConfirming, isConfirmed, error } =
    useFunQuizContract();
  const { isConnected } = useAccount();

  const [phase, setPhase] = useState<
    "countdown" | "playing" | "answered" | "finished"
  >("countdown");
  const [finishState, setFinishState] = useState<"show_score" | "submitted">(
    "show_score"
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [countdown, setCountdown] = useState(3);
  const [answerResult, setAnswerResult] = useState<{
    correct: boolean;
    points: number;
  } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    if (isConfirmed && phase === "finished" && finishState === "show_score") {
      toast.success("Score submitted successfully!");
      setFinishState("submitted");
    }
    if (error && phase === "finished") {
      toast.error("Failed to submit score. Please try again.");
    }
  }, [isConfirmed, error, phase, finishState]);

  if (!quizData || !quizData.questions || !quizData.questions.length) {
    return (
      <div className="text-center text-primary text-xl">
        Preparing quiz questions...
      </div>
    );
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (phase === "countdown" || phase === "answered") {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      } else {
        if (phase === "countdown") {
          setPhase("playing");
          setTimeLeft(
            Number(quizData.questions[currentQuestionIndex].timeLimit)
          );
        } else {
          if (currentQuestionIndex < quizData.questions.length - 1) {
            const nextQuestionIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextQuestionIndex);
            setSelectedAnswer(null);
            setAnswerResult(null);
            setPhase("playing");
            setTimeLeft(
              Number(quizData.questions[nextQuestionIndex].timeLimit)
            );
          } else {
            setPhase("finished");
          }
        }
      }
    } else if (phase === "playing" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (phase === "playing" && timeLeft === 0) {
      handleAnswerClick(-1);
    }

    return () => clearTimeout(timer);
  }, [phase, countdown, timeLeft, currentQuestionIndex, quizData.questions]);

  const handleAnswerClick = (optionIndex: number) => {
    if (phase !== "playing") return;

    setSelectedAnswer(optionIndex);
    const question = quizData.questions[currentQuestionIndex];
    const isCorrect = optionIndex === Number(question.correctAnswerIndex);
    let pointsEarned = 0;

    if (isCorrect) {
      const basePoints = Number(question.points);
      const timeBonus = Math.floor(
        basePoints * (timeLeft / Number(question.timeLimit))
      );
      pointsEarned = basePoints + timeBonus;
      setScore((s) => s + pointsEarned);
      setAnswerResult({ correct: true, points: pointsEarned });
    } else {
      setAnswerResult({ correct: false, points: 0 });
    }

    setCountdown(3);
    setPhase("answered");
  };

  const handleSubmitScore = () => {
    if (!isConnected) return toast.error("Please connect wallet.");
    toast.info("Submitting your score...");
    submitScore(quizId, score);
  };

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div
      className="relative w-full max-w-3xl mx-auto bg-surface p-4 sm:p-6 md:p-8 rounded-md border border-border flex flex-col text-center"
      style={{ minHeight: "70vh" }}
    >
      <AnimatePresence>
        {phase === "countdown" && (
          <motion.div
            key="countdown-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-transparent backdrop-blur-sm rounded-md z-10 p-4"
          >
            <h2
              className="text-2xl md:text-3xl font-semibold text-primary mb-4 px-4 truncate"
              title={quizData.title}
            >
              {quizData.title}
            </h2>

            <p className="text-xl md:text-2xl text-secondary mb-4">
              Get Ready...
            </p>
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold text-primary">
              {countdown > 0 && countdown}
            </h1>
            <p className="text-secondary text-base md:text-lg mt-4">
              Tip: Speed + Accuracy = High Score!
            </p>
          </motion.div>
        )}

        {phase === "answered" && answerResult && (
          <motion.div
            key="feedback-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-transparent backdrop-blur-sm rounded-md z-10 p-4"
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              {answerResult.correct ? (
                <FiCheckCircle className="text-green-500 text-6xl md:text-7xl mx-auto" />
              ) : (
                <FiXCircle className="text-red-500 text-6xl md:text-7xl mx-auto" />
              )}
              <h1
                className={`mt-2 text-3xl md:text-4xl font-bold ${
                  answerResult.correct ? "text-green-500" : "text-red-500"
                }`}
              >
                {answerResult.correct ? "Correct!" : "Wrong!"}
              </h1>
              {answerResult.correct ? (
                <p className="text-lg md:text-xl text-primary mt-1">
                  +{answerResult.points} points
                </p>
              ) : (
                <p className="text-lg md:text-xl text-secondary mt-1">
                  No points added
                </p>
              )}
              <div className="mt-8">
                <p className="text-secondary text-base">Next question in...</p>
                <p className="text-white font-bold text-5xl">{countdown}</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {phase === "finished" && (
          <motion.div
            key="finished-overlay"
            className="absolute inset-0 flex flex-col items-center justify-center bg-transparent backdrop-blur-sm rounded-md z-10 p-4"
          >
            <AnimatePresence mode="wait">
              {finishState === "show_score" ? (
                <motion.div key="show-score" className="text-center">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
                    Quiz Finished!
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-white mb-8">
                    Your final score is:{" "}
                    <span className="font-bold text-primary">{score}</span>
                  </p>
                  <Button
                    onClick={handleSubmitScore}
                    isLoading={isPending || isConfirming}
                    className="py-3 px-8 text-lg"
                  >
                    {isPending
                      ? "Check Wallet..."
                      : isConfirming
                      ? "Submitting..."
                      : "Submit Score"}
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="submitted" className="text-center">
                  <FiAward className="text-green-500 text-6xl md:text-7xl mx-auto mb-4" />
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                    Thank You!
                  </h1>
                  <p className="text-secondary mb-8">
                    Your score is on the leaderboard.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={`/create-quiz`}>
                      <Button className="py-3 px-8 text-lg bg-gray-600 hover:bg-gray-700 w-full">
                        Create Quiz
                      </Button>
                    </Link>
                    <Link href="/quizzes">
                      <Button className="py-3 px-8 text-lg w-full">
                        Explore More Quizzes
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          opacity:
            phase === "countdown" ||
            phase === "answered" ||
            phase === "finished"
              ? 0.3
              : 1,
          filter:
            phase === "countdown" ||
            phase === "answered" ||
            phase === "finished"
              ? "blur(4px)"
              : "blur(0px)",
        }}
        className="w-full h-full flex flex-col"
      >
        <AnimatePresence mode="wait">
          {phase === "countdown" && <div></div>}

          {(phase === "playing" ||
            phase === "answered" ||
            phase === "finished") &&
            currentQuestion && (
              <motion.div
                key={`playing-${currentQuestionIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-grow flex flex-col"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 md:mb-4 text-sm">
                  <h1 className="font-bold text-white text-left text-base md:text-lg mb-2 sm:mb-0">
                    {quizData.title}
                  </h1>
                  <p className="text-secondary">
                    Question {currentQuestionIndex + 1}/
                    {quizData.questions.length}
                  </p>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                  <motion.div
                    className="bg-primary h-2.5 rounded-full"
                    initial={{ width: "100%" }}
                    animate={{
                      width: `${
                        (timeLeft / Number(currentQuestion.timeLimit)) * 100
                      }%`,
                    }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>
                <p className="text-center text-primary font-bold text-xl md:text-2xl mb-4 md:mb-6">
                  {timeLeft}
                </p>
                <div className="flex-grow flex items-center justify-center mb-4 md:mb-6">
                  <h2 className="text-lg sm:text-xl md:text-2xl text-white font-semibold">
                    {currentQuestion.questionText}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerClick(index)}
                      disabled={phase !== "playing"}
                      className={`p-3 md:p-4 rounded-lg text-left text-sm sm:text-base transition-all w-full
                                            ${
                                              phase === "answered"
                                                ? index ===
                                                  Number(
                                                    currentQuestion.correctAnswerIndex
                                                  )
                                                  ? "bg-green-500 text-white"
                                                  : index === selectedAnswer
                                                  ? "bg-red-500 text-white"
                                                  : "bg-gray-700"
                                                : "bg-gray-700 hover:bg-primary hover:text-background"
                                            }
                                        `}
                      whileHover={{ scale: phase === "playing" ? 1.05 : 1 }}
                      whileTap={{ scale: phase === "playing" ? 0.95 : 1 }}
                    >
                      <span className="font-bold mr-2">
                        {String.fromCharCode(65 + index)}.
                      </span>{" "}
                      {option}
                    </motion.button>
                  ))}
                </div>
                <p className="text-center text-secondary mt-4">
                  Score: {score}
                </p>
              </motion.div>
            )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PlayQuizGame;
