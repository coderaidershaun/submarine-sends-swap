import { ethers } from "hardhat";
import { getProviderDetails } from "../helpers/utils";

// Define contract address and amount
const submarineAddress = process.env.SUBMARINE_ADDRESS;
const AMOUNT_IN_ETH = "0.001";

// Send Ethereum to Submarine Contract
const sendEthertoSubmarine = async () => {
  console.log("");
  console.log("Sending funds to Submaring contract...");

  // Get signer and provider
  const { signer, provider } = await getProviderDetails();

  // Show current Submarine Contract balance
  const submarineBalance = ethers.utils.formatEther(
    await provider.getBalance(submarineAddress!)
  );
  console.log("Initial balance on Submarine contract ETH: ", submarineBalance);

  // Convert ethereum into wei
  const amountWei = ethers.utils.parseEther(AMOUNT_IN_ETH);

  // Build Transaction
  const tx = {
    to: submarineAddress,
    value: amountWei,
  };

  // Send Transaction
  const txSend = await signer.sendTransaction(tx);
  console.log("Send transaction Hash: ", txSend.hash);

  // Output
  console.log("Check etherscan for the tx completion before continuing");
  console.log("");
};

// Execute command
sendEthertoSubmarine();
