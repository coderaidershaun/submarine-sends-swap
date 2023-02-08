// Step 2: Create Submarine Contract
import { ethers } from "hardhat";
import { keccak256 } from "ethers/lib/utils";
import { getProviderDetails } from "./utils";
import * as FactoryJSON from "../artifacts/contracts/Factory.sol/Factory.json";

// Construct Salt
const constructSalt = async () => {
  // Put anything you want here, it really doesnt matter
  // But could be helpful to have something meaningful to the transaction
  // Such as the pairs for an arbitrage trade etc
  // Note: each time your run this step, change the salt as you cannot create the same Submarine contract address twice
  const sendData = [
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2", // SUSHI
  ];

  // Convert data to bytes array
  // encode as address array as this is the structure used above
  const abiSalt = ethers.utils.defaultAbiCoder;
  const params = abiSalt.encode(["address[]"], [sendData]);

  // Convert array to salt
  const salt = keccak256(params);

  // Return salt
  return salt;
};

// Create Submarine Contract
const main = async () => {
  // Hardcode factory address from step 1
  const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  // Get salt
  const salt = await constructSalt();

  // Get signer and provider
  const { signer, provider } = await getProviderDetails();

  // Connect to Factory as signer
  const factoryContractSigner = new ethers.Contract(
    FACTORY_ADDRESS,
    FactoryJSON.abi,
    signer
  );

  // Connect to Factory as provider
  const factoryContractProvider = new ethers.Contract(
    FACTORY_ADDRESS,
    FactoryJSON.abi,
    provider
  );

  // Create submarine contract with the owner as sender
  const contractCreateTx = await factoryContractSigner.createSubContract(
    salt,
    signer.address
  );

  // Print out submarine transaction receipt
  const txReceipt = await provider.getTransaction(contractCreateTx.hash);
  console.log("Submarine contract creation TX Hash: ", txReceipt.hash);

  // Show computed address
  const predictedSubAddress =
    await factoryContractProvider.getPredictedSubAddress(salt, signer.address);
  console.log("Submarine computed address: ", predictedSubAddress);

  // Show actual address
  const actualSubAddr = await factoryContractProvider.getActualSubAddress();
  console.log("Submarine actual address: ", actualSubAddr);

  // Conclude addresses are you
  if (predictedSubAddress === actualSubAddr) {
    console.log("Submarine actual vs predicted: Exact Match :-)");
  } else {
    console.log(
      "Address mismatch. \n Check your inputs match what you expect on the Factory.sol"
    );
  }
};

// Run main
main();
