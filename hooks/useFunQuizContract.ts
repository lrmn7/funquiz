import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { funQuizABI, funQuizContractAddress } from "@/constants/abi";


type QuizQuestion = {
  questionText: string;
  options: [string, string, string, string];
  correctAnswerIndex: number;
  timeLimit: number;
  points: number;
};

type TenQuizQuestions = [
  QuizQuestion,
  QuizQuestion,
  QuizQuestion,
  QuizQuestion,
  QuizQuestion,
  QuizQuestion,
  QuizQuestion,
  QuizQuestion,
  QuizQuestion,
  QuizQuestion
];

// Tipe untuk memastikan array jawaban memiliki panjang 10
type TenAnswers = readonly [number, number, number, number, number, number, number, number, number, number];

export const useFunQuizContract = () => {
  const { address } = useAccount();
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const useGetQuizById = (quizId: number) => {
    return useReadContract({
      abi: funQuizABI,
      address: funQuizContractAddress,
      functionName: "getQuizById",
      args: [BigInt(quizId)],
    });
  };

  const useGetLeaderboard = (quizId: number) => {
    return useReadContract({
      abi: funQuizABI,
      address: funQuizContractAddress,
      functionName: "getLeaderboardData",
      args: [BigInt(quizId)],
    });
  };

  const useGetOwner = () => {
    return useReadContract({
      abi: funQuizABI,
      address: funQuizContractAddress,
      functionName: "owner",
    });
  };

  const useGetCreateFee = () => {
    return useReadContract({
      abi: funQuizABI,
      address: funQuizContractAddress,
      functionName: "createQuizFee",
    });
  };

  const useGetContractBalance = () => {
    return useReadContract({
      abi: funQuizABI,
      address: funQuizContractAddress,
      functionName: "getContractBalance",
    });
  };

  const useGetTotalQuizzes = () => {
    return useReadContract({
      abi: funQuizABI,
      address: funQuizContractAddress,
      functionName: "quizCounter",
    });
  };

  const useGetPlayQuizFee = () => {
    return useReadContract({
      abi: funQuizABI,
      address: funQuizContractAddress,
      functionName: "playQuizFee",
    });
  };

  const useGetHasPaidStatus = (quizId: number) => {
    return useReadContract({
      abi: funQuizABI,
      address: funQuizContractAddress,
      functionName: "hasPaidToPlay",
      args: [BigInt(quizId), address!],
      query: {
        enabled: !!address,
      },
    });
  };

  // Fungsi ini mengirimkan title, description, dan questions ke contract
  const createQuiz = (
    title: string,
    description: string,
    questions: TenQuizQuestions,
    fee: bigint
  ) => {
    writeContract({
      abi: funQuizABI,
      address: funQuizContractAddress,
      functionName: "createQuiz",
      args: [title, description, questions],
      value: fee,
    });
  };

  // Fungsi ini mengirimkan jawaban DAN sisa waktu untuk perhitungan skor on-chain yang aman
  const submitAnswers = (quizId: number, answers: number[], timeLefts: number[]) => {
    writeContract({
      abi: funQuizABI,
      address: funQuizContractAddress,
      functionName: "submitAnswers",
      args: [BigInt(quizId), answers as unknown as TenAnswers, timeLefts as unknown as TenAnswers],
    });
  };

  const payToPlay = (quizId: number, fee: bigint) => {
    writeContract({
      abi: funQuizABI,
      address: funQuizContractAddress,
      functionName: "payToPlay",
      args: [BigInt(quizId)],
      value: fee,
    });
  }; 

  const setCreateQuizFee = (newFee: string) => {
    writeContract({
      abi: funQuizABI,
      address: funQuizContractAddress,
      functionName: "setCreateQuizFee",
      args: [parseEther(newFee)],
    });
  };

  const setPlayQuizFee = (newFee: string) => {
    writeContract({
      abi: funQuizABI,
      address: funQuizContractAddress,
      functionName: "setPlayQuizFee",
      args: [parseEther(newFee)],
    });
  };

  const withdraw = () => {
    writeContract({
      abi: funQuizABI,
      address: funQuizContractAddress,
      functionName: "withdraw",
    });
  };

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    address,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    receipt,
    error,
    useGetQuizById,
    useGetLeaderboard,
    useGetOwner,
    useGetCreateFee,
    useGetPlayQuizFee,
    useGetHasPaidStatus,
    useGetContractBalance,
    useGetTotalQuizzes,
    createQuiz,
    submitAnswers,
    payToPlay,
    setCreateQuizFee,
    setPlayQuizFee,
    withdraw,
  };
};