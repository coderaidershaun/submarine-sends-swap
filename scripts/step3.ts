import { ethers } from "hardhat";
import { getProviderDetails } from "../helpers/utils";
import * as FactoryJSON from "../artifacts/contracts/FactoryLive.sol/FactoryLive.json";

// Definitions
const factoryAddress = process.env.FACTORY_ADDRESS;
const predSubAddress = process.env.SUBMARINE_ADDRESS;

// Create Submarine Contract
const createSubmarineContract = async () => {
  console.log("");
  console.log("Checking Submarine contract...");

  // Get signer and provider
  const { signer } = await getProviderDetails();

  // Connect to Factory as signer
  const factoryContract = new ethers.Contract(
    factoryAddress!,
    FactoryJSON.abi,
    signer
  );

  // Show actual address
  const actualSubAddr = await factoryContract.getActualSubAddress();
  console.log("Submarine actual address: ", actualSubAddr);
  console.log("Submarine predicted address: ", actualSubAddr);

  // Conclude addresses are you
  if (predSubAddress === actualSubAddr) {
    console.log("Submarine actual vs predicted: Exact Match :-)");
  } else {
    console.error("ERROR")
    console.error("Check your salt inputs match what you expect for everything");
  }

  // Give space
  console.log("");
};

// Execute command
createSubmarineContract();
