import { ethers } from "hardhat";

/*
  (terminal 1) npx hardhat node
  (terminal 2) npx hardhat run --network localhost scripts/step1.ts

   - or -

   npx hardhat run --network goerli scripts/step1.ts
*/

// Deploys reveal and then factory contracts
const deployBaseContracts = async () => {
  console.log("");
  console.log("Deploying Reveal and Factory contracts...");

  // Deploy Reveal Contract
  const ContractReveal = await ethers.getContractFactory("Reveal");
  const deployedReveal = await ContractReveal.deploy();
  await deployedReveal.deployed();
  console.log("Reveal Address: ", deployedReveal.address);

  const ContractFactory = await ethers.getContractFactory("FactoryLive");
  const deployedFactory = await ContractFactory.deploy(deployedReveal.address);
  await deployedFactory.deployed();
  console.log("Factory Address: ", deployedFactory.address);

  // Make space
  console.log("Remember to add these to your .env file");
  console.log("");
};

// Execute command
deployBaseContracts();
