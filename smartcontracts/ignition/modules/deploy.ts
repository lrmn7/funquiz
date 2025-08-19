import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FunQuizModule = buildModule("FunQuizModule", (m) => {
  const FunQuiz = m.contract("FunQuiz", []);

  return { FunQuiz };
});

export default FunQuizModule;
