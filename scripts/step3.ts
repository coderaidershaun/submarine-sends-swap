import { ethers } from "hardhat";
import { getProviderDetails } from "./utils";

// Define contract address and amount
// This has been taken from Remix in a live situation
const SUBMARINE_CONTRACT = "0x575193ddf1b8372404b7061237411de18A9775A3";
const AMOUNT_IN_ETH = "0.001";

// Send Ethereum to Submarin Contract
const sendEthertoSubmarine = async () => {
  console.log("");
  console.log("Sending funds to Submaring contract...");

  // Get signer and provider
  const { signer, provider } = await getProviderDetails();

  // Show current Submarine Contract balance
  const submarineBalance = ethers.utils.formatEther(
    await provider.getBalance(SUBMARINE_CONTRACT)
  );
  console.log("Initial balance on Submarine contract ETH: ", submarineBalance);

  // Convert ethereum into wei
  const amountWei = ethers.utils.parseEther(AMOUNT_IN_ETH);

  // Build Transaction
  const tx = {
    to: SUBMARINE_CONTRACT,
    value: amountWei,
  };

  // Send Transaction
  const txSend = await signer.sendTransaction(tx);
  console.log("Send transaction Hash: ", txSend.hash);

  // Show balance of submarine transaction
  const balance = await provider.getBalance(SUBMARINE_CONTRACT);
  const humanBalance = ethers.utils.formatEther(balance);
  console.log("Current balance of Submarine contract is ETH: ", humanBalance);
  console.log("");
};

// Execute command
sendEthertoSubmarine();
