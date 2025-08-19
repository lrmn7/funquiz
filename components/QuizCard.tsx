"use client";

import Link from "next/link";
import { useFunQuizContract } from "@/hooks/useFunQuizContract";
import { FiAward } from "react-icons/fi";

const QuizCard = ({ quizId }: { quizId: number }) => {
  const { useGetQuizById } = useFunQuizContract();
  const { data: quizData, isLoading, error } = useGetQuizById(quizId);

  if (isLoading) {
    return (
      <div className="bg-surface p-6 rounded-lg border border-border animate-pulse flex flex-col justify-between">
        <div>
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>
          {/* Placeholder untuk deskripsi */}
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6 mt-2"></div>
        </div>
        <div className="flex items-center space-x-4 mt-6">
          <div className="h-10 bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (
    error ||
    !quizData ||
    quizData.creator === "0x0000000000000000000000000000000000000000"
  ) {
    return null;
  }

  return (
    <div className="bg-surface p-6 rounded-lg border border-border flex flex-col justify-between hover:border-primary transition-colors duration-300">
      <div>
        <h3
          className="text-xl font-bold text-primary mb-2 break-words"
          title={quizData.title}
        >
          {quizData.title.length > 35
            ? `${quizData.title.substring(0, 35)}...`
            : quizData.title}
        </h3>

        <p
          className="text-sm text-secondary truncate mb-3"
          title={quizData.creator}
        >
          Created by:{" "}
          {`${quizData.creator.substring(0, 6)}...${quizData.creator.substring(
            quizData.creator.length - 4
          )}`}
        </p>

        <p
          className="text-sm text-gray-400 break-words"
          title={quizData.description}
        >
          {quizData.description.length > 50
            ? `${quizData.description.substring(0, 50)}...`
            : quizData.description}
        </p>
      </div>
      <div className="flex items-center space-x-4 mt-6">
        <Link href={`/quiz/${quizId}`} className="flex-1">
          <button className="w-full bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center space-x-2">
            <FiAward />
            <span>Details</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;
