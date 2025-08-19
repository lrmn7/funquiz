import {
  QuizCreated as QuizCreatedEvent,
  ScoreUpdated as ScoreUpdatedEvent
} from "../generated/FunQuiz/FunQuiz"
import { Account, Quiz, QuizCompletion } from "../generated/schema"

export function handleQuizCreated(event: QuizCreatedEvent): void {
  let creator = Account.load(event.params.creator.toHexString())
  if (!creator) {
    creator = new Account(event.params.creator.toHexString())
    creator.save()
  }

  let quizIdString = event.params.quizId.toString()
  let quiz = new Quiz("quiz-" + quizIdString)
  quiz.quizId = event.params.quizId
  quiz.title = event.params.title
  quiz.description = event.params.description
  quiz.creator = creator.id
  quiz.save()
}

export function handleScoreUpdated(event: ScoreUpdatedEvent): void {
  let player = Account.load(event.params.player.toHexString())
  if (!player) {
    player = new Account(event.params.player.toHexString())
    player.save()
  }

  let quizIdString = event.params.quizId.toString()
  let completionId = quizIdString + "-" + event.params.player.toHexString()
  
  let completion = QuizCompletion.load(completionId)
  if (!completion) {
    completion = new QuizCompletion(completionId)
    completion.quiz = "quiz-" + quizIdString
    completion.player = player.id
  }

  completion.score = event.params.newScore
  completion.save()
}