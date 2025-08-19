'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { useFunQuizContract } from '@/hooks/useFunQuizContract';
import { funQuizABI } from '@/constants/abi';
import { decodeEventLog, formatEther } from 'viem';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import QuestionFormItem from '@/components/ui/QuestionFormItem';
import { toast } from 'react-toastify';

type QuizQuestion = {
    questionText: string;
    options: [string, string, string, string];
    correctAnswerIndex: number;
    timeLimit: number;
    points: number;
};

type TenQuizQuestions = [
    QuizQuestion, QuizQuestion, QuizQuestion, QuizQuestion, QuizQuestion, 
    QuizQuestion, QuizQuestion, QuizQuestion, QuizQuestion, QuizQuestion
];

const initialQuestionState: QuizQuestion = {
  questionText: '',
  options: ['', '', '', ''],
  correctAnswerIndex: 0,
  timeLimit: 15,
  points: 100,
};

const CreateQuizPage = () => {
    const router = useRouter();
    const { address } = useAccount();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    const initialQuestions = Array(10).fill(null).map(() => ({ ...initialQuestionState })) as TenQuizQuestions;
    const [questions, setQuestions] = useState<TenQuizQuestions>(initialQuestions);
    
    const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(0);

    const { createQuiz, isPending, hash, error: writeError } = useFunQuizContract();
    const { data: createFeeData } = useFunQuizContract().useGetCreateFee();
    const { isConnected } = useAccount();

    const { data: receipt, isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = 
        useWaitForTransactionReceipt({ hash });

    const feeInSTT = createFeeData !== undefined ? formatEther(createFeeData as bigint) : '...';

    const handleQuestionChange = (index: number, field: keyof QuizQuestion, value: any) => {
        const newQuestions = [...questions] as TenQuizQuestions;
        (newQuestions[index] as any)[field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions] as TenQuizQuestions;
        const newOptions = [...newQuestions[qIndex].options] as [string, string, string, string];
        newOptions[oIndex] = value;
        newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
        setQuestions(newQuestions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected) return toast.error('Please connect your wallet first!');
        if (!title.trim()) return toast.error('Quiz title is required.');
        if (!description.trim()) return toast.error('Quiz description is required.');
        
        if (questions.some(q => !q.questionText.trim() || q.options.some(o => !o.trim()))) {
            return toast.error('All questions and options must be filled.');
        }
        const fee = createFeeData as bigint;
        if (fee === undefined) return toast.error('Oops something went wrong. Please try again.');
        
        toast.info('Submitting your quiz...');
        createQuiz(title, description, questions, fee);
    };

    useEffect(() => {
        if (isConfirmed && receipt && address) {
            const quizCreatedLog = receipt.logs.find(log => {
                try {
                    const decodedLog = decodeEventLog({ abi: funQuizABI, ...log });
                    return decodedLog.eventName === 'QuizCreated';
                } catch { return false; }
            });

            if (quizCreatedLog) {
                const decodedLog = decodeEventLog({ abi: funQuizABI, ...quizCreatedLog });
                const newQuizId = (decodedLog.args as { quizId: bigint }).quizId;
                toast.success(`Quiz #${newQuizId} created! Redirecting...`);
                setTimeout(() => {
                    router.push(`/quiz/${newQuizId}`);
                }, 1000);
            } else {
                toast.success('Quiz created successfully! Redirecting...');
                setTimeout(() => { router.push('/quizzes'); }, 1000);
            }
        }
        const finalError = writeError || receiptError;
        if (finalError) {
            toast.error(finalError.message || 'An unknown error occurred.');
        }
    }, [isConfirmed, receipt, router, address, writeError, receiptError]);

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-primary mb-6 text-center">Create a New Quiz</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-surface p-6 rounded-lg border border-border space-y-4">
                                        <div>
                        <Input 
                            label="Quiz Title" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                            placeholder="e.g., General Knowledge Challenge"
                            maxLength={50}
                        />
                        <p className="text-right text-xs text-gray-400 mt-1">
                            {title.length} / 50
                        </p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Quiz Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            maxLength={200}
                            placeholder="A brief and exciting description of your quiz (max 200 chars)"
                            className="w-full bg-surface border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
                            rows={3}
                        />
                        <p className="text-right text-xs text-gray-400 mt-1">
                            {description.length} / 200
                        </p>
                    </div>
                </div>
                
                <div className="bg-surface rounded-lg border border-border">
                    {questions.map((q, qIndex) => (
                        <QuestionFormItem
                            key={qIndex}
                            qIndex={qIndex}
                            question={q}
                            isOpen={openQuestionIndex === qIndex}
                            setOpen={setOpenQuestionIndex}
                            handleQuestionChange={handleQuestionChange}
                            handleOptionChange={handleOptionChange}
                        />
                    ))}
                </div>

                <Button type="submit" isLoading={isPending || isConfirming} className="w-full py-3 text-lg leading-tight">
                    {isPending || isConfirming ? (
                        <span>{isPending ? 'Check Wallet...' : 'Creating Quiz...'}</span>
                    ) : (
                        <div className="flex flex-col items-center">
                            <span>Create Quiz</span>
                            <span className="text-xs font-normal opacity-80 mt-1">
                                Fee: {feeInSTT} STT
                            </span>
                        </div>
                    )}
                </Button>
            </form>
        </div>
    );
};

export default CreateQuizPage;