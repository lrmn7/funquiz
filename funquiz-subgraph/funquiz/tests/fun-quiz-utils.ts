import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  FeeUpdated,
  OwnershipTransferred,
  PlayFeePaid,
  QuizCreated,
  ScoreUpdated,
  Withdrawn
} from "../generated/FunQuiz/FunQuiz"

export function createFeeUpdatedEvent(
  feeType: string,
  newFee: BigInt
): FeeUpdated {
  let feeUpdatedEvent = changetype<FeeUpdated>(newMockEvent())

  feeUpdatedEvent.parameters = new Array()

  feeUpdatedEvent.parameters.push(
    new ethereum.EventParam("feeType", ethereum.Value.fromString(feeType))
  )
  feeUpdatedEvent.parameters.push(
    new ethereum.EventParam("newFee", ethereum.Value.fromUnsignedBigInt(newFee))
  )

  return feeUpdatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPlayFeePaidEvent(
  quizId: BigInt,
  player: Address
): PlayFeePaid {
  let playFeePaidEvent = changetype<PlayFeePaid>(newMockEvent())

  playFeePaidEvent.parameters = new Array()

  playFeePaidEvent.parameters.push(
    new ethereum.EventParam("quizId", ethereum.Value.fromUnsignedBigInt(quizId))
  )
  playFeePaidEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )

  return playFeePaidEvent
}

export function createQuizCreatedEvent(
  quizId: BigInt,
  creator: Address,
  title: string,
  description: string
): QuizCreated {
  let quizCreatedEvent = changetype<QuizCreated>(newMockEvent())

  quizCreatedEvent.parameters = new Array()

  quizCreatedEvent.parameters.push(
    new ethereum.EventParam("quizId", ethereum.Value.fromUnsignedBigInt(quizId))
  )
  quizCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  quizCreatedEvent.parameters.push(
    new ethereum.EventParam("title", ethereum.Value.fromString(title))
  )
  quizCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )

  return quizCreatedEvent
}

export function createScoreUpdatedEvent(
  quizId: BigInt,
  player: Address,
  newScore: BigInt
): ScoreUpdated {
  let scoreUpdatedEvent = changetype<ScoreUpdated>(newMockEvent())

  scoreUpdatedEvent.parameters = new Array()

  scoreUpdatedEvent.parameters.push(
    new ethereum.EventParam("quizId", ethereum.Value.fromUnsignedBigInt(quizId))
  )
  scoreUpdatedEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  scoreUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newScore",
      ethereum.Value.fromUnsignedBigInt(newScore)
    )
  )

  return scoreUpdatedEvent
}

export function createWithdrawnEvent(to: Address, amount: BigInt): Withdrawn {
  let withdrawnEvent = changetype<Withdrawn>(newMockEvent())

  withdrawnEvent.parameters = new Array()

  withdrawnEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawnEvent
}
