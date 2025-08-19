import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FunCardModule = buildModule("FunCardModule", (m) => {
  const FunCard = m.contract("FunCard", []);

  return { FunCard };
});

export default FunCardModule;
