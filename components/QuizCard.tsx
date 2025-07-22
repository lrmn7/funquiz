'use client';

import Link from 'next/link';
import { useFunQuizContract } from '@/hooks/useFunQuizContract';
import { FiPlay, FiAward } from 'react-icons/fi';

const QuizCard = ({ quizId }: { quizId: number; }) => {
  const { useGetQuizById } = useFunQuizContract();
  const { data: quizData, isLoading, error } = useGetQuizById(quizId);

  if (isLoading) {
    return (
      <div className="bg-surface p-6 rounded-lg border border-border animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
         <div className="flex items-center space-x-4 mt-6">
            <div className="h-10 bg-gray-700 rounded w-full"></div>
            <div className="h-10 bg-gray-700 rounded w-full"></div>
         </div>
      </div>
    );
  }

  if (error || !quizData || !quizData.creator) {
    return null;
  }

  return (
    <div className="bg-surface p-6 rounded-lg border border-border flex flex-col justify-between hover:border-primary transition-colors duration-300">
      <div>
        <h3 className="text-xl font-bold text-primary truncate mb-2" title={quizData.title}>
          {quizData.title}
        </h3>
        <p className="text-sm text-secondary truncate" title={quizData.creator}>
          Created by: {`${quizData.creator.substring(0, 6)}...${quizData.creator.substring(quizData.creator.length - 4)}`}
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