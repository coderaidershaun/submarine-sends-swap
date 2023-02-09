import { ethers } from "hardhat";
import { getProviderDetails } from "../helpers/utils";

// Definitions
const submarineAddress = process.env.SUBMARINE_ADDRESS;

// Step 4: Execute transaction
const checkExecutionSuccess = async () => {
  console.log("");
  console.log("Checking swap status...");

  // Get signer and provider
  const { signer, provider } = await getProviderDetails();

  // Show balance of submarine transaction
  const balance = await provider.getBalance(submarineAddress!);
  const humanBalance = ethers.utils.formatEther(balance);
  console.log("Current balance of Submarine contract ETH: ", humanBalance);

  // Show balance of owners wallet
  const balanceWallet = await provider.getBalance(signer.address);
  const humanBalanceWallet = ethers.utils.formatEther(balanceWallet);
  console.log("Current sender balance is ETH: ", humanBalanceWallet);

  // const humanReadableAbi = [
  //   "function balanceOf(address owner) view returns (uint balance)",
  // ];

  // // Connect to Swapped token Contract
  // const tokenContract = new ethers.Contract(
  //   tokenSwapAddress!,
  //   humanReadableAbi,
  //   provider
  // );

  // // Print out
  // const swapBalance = await tokenContract.balanceOf(signer.address);
  // const humanSwapBalance = ethers.utils.formatEther(swapBalance);
  // console.log("Current sender balance of Swap Token: ", humanSwapBalance);
  // console.log("");
};

// Execute command
checkExecutionSuccess();
