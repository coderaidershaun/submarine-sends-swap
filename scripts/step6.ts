import { ethers } from "hardhat";
import { getProviderDetails } from "../helpers/utils";
import { keccak256 } from "ethers/lib/utils";
import * as RevealJSON from "../artifacts/contracts/Reveal.sol/Reveal.json";

// Definitions
const revealAddress = process.env.REVEAL_ADDRESS;
const tokenSwapAddress = process.env.TOKEN_SWAP_ADDRESS;
const submarineAddress = process.env.SUBMARINE_ADDRESS;
const uniqueInt = process.env.UNIQUE_INT;

// Define construct salt again (as exports not working in hardhat with run)
const constructSaltforReveal = async () => {
  const sendData = [tokenSwapAddress];
  const abiSalt = ethers.utils.defaultAbiCoder;
  const params = abiSalt.encode(["address[]", "uint"], [sendData, uniqueInt]);
  const salt = keccak256(params);
  return salt;
};

// Step 4: Execute transaction
const executeTransaction = async () => {
  console.log("");
  console.log("Performing swap...");

  // Build Salt
  const salt = await constructSaltforReveal();

  // Get signer and provider
  const { signer, provider } = await getProviderDetails();

  // Show ETH balance of sender
  const signerBalance = await provider.getBalance(signer.address);
  const humanSignerBal = ethers.utils.formatEther(signerBalance);
  console.log("Sender current balance: ", humanSignerBal);

  // Connect to reveal contract
  const revealContractSigner = new ethers.Contract(
    revealAddress!,
    RevealJSON.abi,
    signer
  );

  // Guard: Check address matches
  const subAddress = await revealContractSigner.getSubmarineAddress(salt);
  if (subAddress !== submarineAddress) {
    console.error("Submarine address mismatch. Check inputs in the ByteArray.");
    return;
  }

  // Execute swap
  const swapTx = await revealContractSigner.revealExecution(
    salt,
    tokenSwapAddress
  );
  console.log("Swap transaction reference: ", swapTx.hash);

  // Next instructions
  console.log("Please check Etherscan before proceeding");
  console.log("");
};

// Execute command
executeTransaction();
