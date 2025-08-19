import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { FeeUpdated } from "../generated/schema"
import { FeeUpdated as FeeUpdatedEvent } from "../generated/FunQuiz/FunQuiz"
import { handleFeeUpdated } from "../src/fun-quiz"
import { createFeeUpdatedEvent } from "./fun-quiz-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let feeType = "Example string value"
    let newFee = BigInt.fromI32(234)
    let newFeeUpdatedEvent = createFeeUpdatedEvent(feeType, newFee)
    handleFeeUpdated(newFeeUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("FeeUpdated created and stored", () => {
    assert.entityCount("FeeUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "FeeUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "feeType",
      "Example string value"
    )
    assert.fieldEquals(
      "FeeUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newFee",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
