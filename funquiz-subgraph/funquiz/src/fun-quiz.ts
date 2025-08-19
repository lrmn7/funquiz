import {
  FeeUpdated as FeeUpdatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PlayFeePaid as PlayFeePaidEvent,
  QuizCreated as QuizCreatedEvent,
  ScoreUpdated as ScoreUpdatedEvent,
  Withdrawn as WithdrawnEvent
} from "../generated/FunQuiz/FunQuiz"
import {
  FeeUpdated,
  OwnershipTransferred,
  PlayFeePaid,
  QuizCreated,
  ScoreUpdated,
  Withdrawn
} from "../generated/schema"

export function handleFeeUpdated(event: FeeUpdatedEvent): void {
  let entity = new FeeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.feeType = event.params.feeType
  entity.newFee = event.params.newFee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePlayFeePaid(event: PlayFeePaidEvent): void {
  let entity = new PlayFeePaid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.quizId = event.params.quizId
  entity.player = event.params.player

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuizCreated(event: QuizCreatedEvent): void {
  let entity = new QuizCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.quizId = event.params.quizId
  entity.creator = event.params.creator
  entity.title = event.params.title
  entity.description = event.params.description

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleScoreUpdated(event: ScoreUpdatedEvent): void {
  let entity = new ScoreUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.quizId = event.params.quizId
  entity.player = event.params.player
  entity.newScore = event.params.newScore

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  let entity = new Withdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.to = event.params.to
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
