import { BigInt } from "@graphprotocol/graph-ts"
import {
  QuizCreated,
  ScoreUpdated
} from "../../generated/FunQuiz/FunQuiz"
import { Account, Quiz, QuizCompletion } from "../../generated/schema"

function getOrCreateAccount(address: string): Account {
  let account = Account.load(address)
  if (account == null) {
    account = new Account(address)
    account.save()
  }
  return account as Account
}

export function handleQuizCreated(event: QuizCreated): void {
  let creator = getOrCreateAccount(event.params.creator.toHex())

  let quiz = new Quiz(event.params.quizId.toString())
  quiz.quizId = event.params.quizId
  quiz.creator = creator.id
  quiz.title = event.params.title
  quiz.description = event.params.description
  quiz.save()
}

export function handleScoreUpdated(event: ScoreUpdated): void {
  let player = getOrCreateAccount(event.params.player.toHex())

  let quiz = Quiz.load(event.params.quizId.toString())
  if (quiz == null) return

  let completionId = quiz.id + "-" + player.id
  let completion = QuizCompletion.load(completionId)
  if (completion == null) {
    completion = new QuizCompletion(completionId)
    completion.quiz = quiz.id
    completion.player = player.id
  }

  completion.score = event.params.newScore
  completion.save()
}
