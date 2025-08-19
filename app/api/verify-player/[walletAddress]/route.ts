// File: app/api/verify-player/[walletAddress]/route.ts

import { NextResponse } from 'next/server';
import { createPublicClient, http, isAddress } from 'viem';
import { somniaTestnet } from 'viem/chains'; // Sesuaikan dengan chain Anda
import { funQuizABI, funQuizContractAddress } from '@/constants/abi';

// Inisialisasi koneksi ke blockchain via RPC
const publicClient = createPublicClient({
  chain: somniaTestnet, // Sesuaikan dengan chain Anda
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

const contractConfig = {
    address: funQuizContractAddress,
    abi: funQuizABI,
};

// GET handler untuk request API
export async function GET(
  request: Request,
  { params }: { params: { walletAddress: string } }
) {
  const { walletAddress } = params;

  // 1. Validasi Input
  if (!walletAddress || !isAddress(walletAddress)) {
    return NextResponse.json(
      { error: 'Invalid or missing wallet address.' },
      { status: 400 }
    );
  }

  const normalizedAddress = walletAddress.toLowerCase() as `0x${string}`;

  try {
    // 2. Ambil total jumlah kuis yang ada di kontrak
    const totalQuizzes = await publicClient.readContract({
        ...contractConfig,
        functionName: 'quizCounter',
    });

    const quizCount = Number(totalQuizzes);
    const createdQuizzes = [];
    const completedQuizzes = [];

    // 3. Looping untuk memeriksa setiap kuis satu per satu
    for (let i = 1; i <= quizCount; i++) {
        const quizId = BigInt(i);

        // a. Cek apakah pengguna adalah pembuat kuis ini
        const quizData = await publicClient.readContract({
            ...contractConfig,
            functionName: 'getQuizById',
            args: [quizId],
        });

        if (quizData.creator.toLowerCase() === normalizedAddress) {
            createdQuizzes.push({
                quizId: Number(quizId),
                title: quizData.title,
            });
        }

        // b. Cek apakah pengguna memiliki skor untuk kuis ini
        const playerScore = await publicClient.readContract({
            ...contractConfig,
            functionName: 'getPlayerScore',
            args: [quizId, normalizedAddress],
        });

        if (Number(playerScore) > 0) {
            completedQuizzes.push({
                quizId: Number(quizId),
                score: Number(playerScore),
            });
        }
    }

    // 4. Susun Respons JSON
    const responseData = {
      walletAddress: normalizedAddress,
      lastChecked: new Date().toISOString(),
      summary: {
        hasCreatedQuiz: createdQuizzes.length > 0,
        completedQuizCount: completedQuizzes.length,
      },
      createdQuizzes,
      completedQuizzes,
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error. Failed to fetch data from the blockchain.' },
      { status: 500 }
    );
  }
}