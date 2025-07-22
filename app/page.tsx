import Link from 'next/link';
import Greeting from '@/components/Greeting';
import AudioToggleButton from '@/components/AudioToggleButton';
import { MarqueeECO } from '@/components/marqueeEco';
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full py-16">
      
      <AudioToggleButton />

      <Greeting />
      
      <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-4">
        Build the Quiz, Break the Minds
      </h1>
      
      <p className="text-lg md:text-2xl text-secondary max-w-xl mx-auto mb-8">
        Your Quiz, Your Rules. The World Plays.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
        <Link href="/quizzes">
          <button 
            className="bg-primary text-background font-bold py-3 px-8 rounded-lg hover:bg-primary-hover transition-transform duration-200 hover:scale-95 text-lg shadow-lg shadow-primary/20 w-60"
          >
            Explore Quizzes
          </button>
        </Link>
        <Link href="/create-quiz">
          <button 
            className="bg-surface border border-primary text-primary font-bold py-3 px-8 rounded-lg hover:bg-primary/10 transition-transform duration-200 hover:scale-95 text-lg w-60"
          >
            Create a Quiz
          </button>
        </Link>
      </div>
      <div className="w-full max-w-6xl mt-12 md:mt-24">
        <MarqueeECO />
      </div>
    </div>
  );
}