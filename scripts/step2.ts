import { ethers } from "hardhat";
import { keccak256 } from "ethers/lib/utils";
import { getProviderDetails } from "../helpers/utils";
import * as FactoryJSON from "../artifacts/contracts/FactoryLive.sol/FactoryLive.json";

// Definitions
const factoryAddress = process.env.FACTORY_ADDRESS;
const tokenSwapAddress = process.env.TOKEN_SWAP_ADDRESS; // Remember to use any token matching correct network

// Increment for each contract created
const uniqueInt = process.env.UNIQUE_INT;

// Construct Salt
// Use anything you want for the salt
// Here we are using the tokenSwapAddress and uniqueInt
// The uniqueInt should be incremented each time so that no two addresses are alike
const constructSalt = async () => {
  const abiSalt = ethers.utils.defaultAbiCoder;
  const params = abiSalt.encode(
    ["address[]", "uint"],
    [[tokenSwapAddress], uniqueInt]
  );

  // Convert array to salt format
  const salt = keccak256(params);

  // Return salt
  return salt;
};

// Create Submarine Contract
const createSubmarineContract = async () => {
  console.log("");
  console.log("Creating Submarine contract...");

  // Get salt
  const salt = await constructSalt();
  console.log("SALT (Used again in Step 4): ", salt);

  // Get signer and provider
  const { signer, provider } = await getProviderDetails();

  // Connect to Factory as signer
  const factoryContract = new ethers.Contract(
    factoryAddress!,
    FactoryJSON.abi,
    signer
  );

  // Show computed address
  const predictedSubAddress = await factoryContract.getPredictedSubAddress(
    salt,
    signer.address
  );
  console.log("Submarine predicted address: ", predictedSubAddress);

  // Create submarine contract with the owner as sender
  const contractCreateTx = await factoryContract.createSubContract(
    salt,
    signer.address
  );

  // Print out submarine transaction receipt
  const txReceipt = await provider.getTransaction(contractCreateTx.hash);
  console.log("Submarine contract creation TX Hash: ", txReceipt.hash);

  // Print transaction
  console.log(txReceipt);

  // Output message
  console.log("Check etherscan to ensure before next step");
  console.log("Remember to add or update this address in the .env file");
  console.log("");
};

// Execute command
createSubmarineContract();
