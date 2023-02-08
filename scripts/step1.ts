// Step 1: Create Reveal Contract
import { ethers } from "hardhat";

// (terminal 1) npx hardhat node
// (terminal 2) npx hardhat run --network localhost scripts/step1.ts
// Run function for each contract
const main = async () => {

  // Deploy Reveal Contract
  const ContractReveal = await ethers.getContractFactory("Reveal");
  const deployedReveal = await ContractReveal.deploy();
  await deployedReveal.deployed();
  console.log("Router Address: ", deployedReveal.address)

  const ContractFactory = await ethers.getContractFactory("Factory");
  const deployedFactory = await ContractFactory.deploy(deployedReveal.address);
  await deployedFactory.deployed();
  console.log("Factory Address: ", deployedFactory.address)
}

// Run main
main();
