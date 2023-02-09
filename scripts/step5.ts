import { ethers } from "hardhat";
import { getProviderDetails } from "../helpers/utils";

// Define contract address and amount
const submarineAddress = process.env.SUBMARINE_ADDRESS;

// Check Submarine is Funded
const checkSubmarineFunded = async () => {
  console.log("");
  console.log("Checking funds on Submarine contract...");

  // Get signer and provider
  const { provider } = await getProviderDetails();

  // Show balance of submarine transaction
  const balance = await provider.getBalance(submarineAddress!);
  const humanBalance = ethers.utils.formatEther(balance);
  console.log("Current balance of Submarine contract is ETH: ", humanBalance);
  console.log("");
};

// Execute command
checkSubmarineFunded();
