'use client';

import { useFunQuizContract } from '@/hooks/useFunQuizContract';
import QuizCard from '@/components/QuizCard';

const QuizzesPage = () => {
  const { useGetTotalQuizzes } = useFunQuizContract();
  const { data: totalQuizzes, isLoading, error } = useGetTotalQuizzes();

  if (isLoading) {
    return <div className="text-center text-primary text-xl">Loading quizzes...</div>;
  }
  
  if (error) {
      return <div className="text-center text-red-500 text-xl">An error occurred. Please try again later.</div>
  }

  const quizCount = Number(totalQuizzes || 0);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">
        Explore Quizzes
      </h1>
      {quizCount === 0 ? (
        <p className="text-center text-secondary">
          No quizzes have been created yet. Be the first to create one!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: quizCount }, (_, i) => i + 1)
            .reverse()
            .map((quizId) => (
              <QuizCard key={quizId} quizId={quizId} />
            ))}
        </div>
      )}
    </div>
  );
};

export default QuizzesPage;