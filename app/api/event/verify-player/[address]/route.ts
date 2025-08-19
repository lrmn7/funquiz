export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { isAddress } from 'viem';

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_API_URL;  

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  const { address } = params;

  if (!address || !isAddress(address)) {
    return NextResponse.json({ status: 'error', error: { message: 'Invalid or missing wallet address.' } }, { status: 400 });
  }

  const normalizedAddress = address.toLowerCase();

  const graphqlQuery = {
    query: `
      query getPlayerData($id: ID!) {
        accounts(where: { id: $id }) {
          id
          quizzesCreated {
            quizId
            title
            description
          }
          quizzesCompleted {
            quiz {
              quizId
            }
            score
          }
        }
      }
    `,
    variables: {
      id: normalizedAddress,
    },
  };

  try {
    const res = await fetch(SUBGRAPH_URL ?? '', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphqlQuery),
      next: { revalidate: 60 }
    });

    if (!res.ok) {
        throw new Error(`GraphQL request failed with status ${res.status}`);
    }

    const responseBody = await res.json();
    
    if (responseBody.errors || !responseBody.data) {
        console.error("GraphQL Errors:", responseBody.errors);
        throw new Error("Failed to get valid data from subgraph.");
    }

    const accountData = responseBody.data.accounts && responseBody.data.accounts.length > 0 
      ? responseBody.data.accounts[0] 
      : null;
    
    const createdQuizzes = accountData ? accountData.quizzesCreated.map((q: any) => ({
        quizId: Number(q.quizId),
        title: q.title,
        description: q.description,
    })) : [];

    const completedQuizzes = accountData ? accountData.quizzesCompleted.map((c: any) => ({
        quizId: Number(c.quiz.quizId),
        score: Number(c.score),
    })) : [];

    const responseData = {
      address: normalizedAddress,
      lastChecked: new Date().toISOString(),
      summary: {
        hasCreatedQuiz: createdQuizzes.length > 0,
        completedQuizCount: completedQuizzes.length,
      },
      createdQuizzes,
      completedQuizzes,
    };

    return NextResponse.json({ status: 'success', data: responseData }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json(
      { status: 'error', error: { message: `Internal Server Error: ${errorMessage}` } },
      { status: 500 }
    );
  }
}