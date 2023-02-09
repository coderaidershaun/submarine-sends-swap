import { ethers } from "hardhat";
import { getProviderDetails } from "./utils";

// Send Ethereum to Submarin Contract
const sendEthertoSubmarine = async () => {
  console.log("")
  console.log("Sending funds to Submaring contract...")

  // Define contract address and amount
  const SUBMARINE_CONTRACT = "0x6f9D0C267226b39fd86DA2B9d94d2AC4B9e7f339";
  const AMOUNT_IN_ETH = "5.0";

  // Get signer and provider
  const { signer, provider } = await getProviderDetails();

  // Show current Submarine Contract balance
  const submarineBalance = ethers.utils.formatEther(
    await provider.getBalance(SUBMARINE_CONTRACT)
  );
  console.log("Initial balance on Submarine contract ETH: ", submarineBalance);

}