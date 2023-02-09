import { ethers } from "hardhat";
import { keccak256 } from "ethers/lib/utils";
import { getProviderDetails } from "./utils";
import * as FactoryJSON from "../artifacts/contracts/Factory.sol/Factory.json";

// Definitions
const FACTORY_ADDRESS = "0x4Da7715EACcEF45Be714967b9503f89f6aE5Dfff";
const TOKEN_SWAP_ADDRESS = "0x07865c6e87b9f70255377e024ace6630c1eaa37f"; // USDC Goerli
const SUB_NONCE = 0; // Increment each time you want to create a submarine contract on the same network

// Construct Salt
const constructSalt = async () => {
  // Put anything you want here, it really doesnt matter. We are using the token we are swapping as the salt seed
  // But could be helpful to have something meaningful to the transaction
  // Such as the pairs for an arbitrage trade etc
  // Note: each time your run this step, change the salt as you cannot create the same Submarine contract address twice
  const sendData = [TOKEN_SWAP_ADDRESS];

  // Convert data to bytes array
  // encode as address array as this is the structure used above
  const abiSalt = ethers.utils.defaultAbiCoder;
  const params = abiSalt.encode(["address[]", "uint"], [sendData, SUB_NONCE]);

  // Convert array to salt
  const salt = keccak256(params);

  // Return salt
  return salt;
};

// Create Submarine Contract
const main = async () => {
  console.log("");
  console.log("Creating Submaring contract...");

  // Get salt
  const salt = await constructSalt();
  console.log("SALT (Used again in Step 4): ", salt);

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
  console.log("Submarine predicted address: ", predictedSubAddress);

  // Show actual address
  const actualSubAddr = await factoryContractProvider.getActualSubAddress();
  console.log("Submarine actual address: ", actualSubAddr);

  // Conclude addresses are you
  if (predictedSubAddress === actualSubAddr) {
    console.log("Submarine actual vs predicted: Exact Match :-)");
    console.log("");
  } else {
    console.log(
      "Address mismatch. \n Check your inputs match what you expect on the Factory.sol"
    );
  }
};

// Execute command
main();
