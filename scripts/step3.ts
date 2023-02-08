// Send funds to submarine contract
import { ethers } from "hardhat";
import { getProviderDetails } from "./utils";

// Send Ethereum to Submarin Contract
const sendEthertoSubmarine = async () => {
  const SUBMARINE_CONTRACT = "0x45f2f90Dfb1EdA0d4d3684868674A9313225d98b";
  const AMOUNT_IN_ETH = "0.2";

  // Get signer and provider
  const { signer, wallet, provider } = await getProviderDetails();
  console.log()

  // Show current Submarine Contract balance
  const submarineBalance = ethers.utils.formatEther(
    await provider.getBalance(SUBMARINE_CONTRACT)
  );
  console.log("Initial Balance on Submarine Contract: ", submarineBalance);

  // Convert ethereum into wei
  const amountWei = ethers.utils.parseEther(AMOUNT_IN_ETH);

  // Build Transaction
  const tx = {
    to: SUBMARINE_CONTRACT,
    value: amountWei,
  };

  // Send Transaction
  try {
    const txSend = await signer.sendTransaction(tx);
    console.log(txSend)
  } catch (err) {
    console.log(err)
  }

  // Print out transaction object
};

// Execute command
sendEthertoSubmarine();
