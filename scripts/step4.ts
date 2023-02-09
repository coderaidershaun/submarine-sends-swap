import { ethers } from "hardhat";
import { getProviderDetails } from "./utils";
import { keccak256 } from "ethers/lib/utils";
import * as RevealJSON from "../artifacts/contracts/Reveal.sol/Reveal.json";

// Definitions
const TOKEN_SWAP_ADDRESS = "0x07865c6e87b9f70255377e024ace6630c1eaa37f"; // USDC Goerli
const REVEAL_ADDRESS = "0x3BAee1E38A7b543d1Cc7fB5BF2612702225Af8f8";
const GEORLI_SALT = "0x0998a0f5a5a8552cd0fab4fa2fb13f64358279f73fc8897ee972408ab571dd47"
const SUBMARINE_CONTRACT = "0x575193ddf1b8372404b7061237411de18A9775A3";
const SUB_NONCE = 0; // Must Match to step 2

// Define construct salt again (as exports not working in hardhat with run)
const constructSaltforReveal = async () => {
  const sendData = [TOKEN_SWAP_ADDRESS];
  const abiSalt = ethers.utils.defaultAbiCoder;
  const params = abiSalt.encode(["address[]", "uint"], [sendData, SUB_NONCE]);
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
    REVEAL_ADDRESS,
    RevealJSON.abi,
    signer
  );

  // Guard: Check address matches
  const subAddress = await revealContractSigner.getSubmarineAddress(salt);
  if (subAddress !== SUBMARINE_CONTRACT) {
    console.log("Submarine address mismatch. Check inputs in the ByteArray.");
    return;
  }

  // Execute swap
  const swapTx = await revealContractSigner.revealExecution(
    GEORLI_SALT,
    TOKEN_SWAP_ADDRESS
  );
  console.log("Swap transaction reference: ", swapTx.hash);

  // Show balance of submarine transaction
  const balance = await provider.getBalance(SUBMARINE_CONTRACT);
  const humanBalance = ethers.utils.formatEther(balance);
  console.log("Current balance of Submarine contract ETH: ", humanBalance);

  // Show balance of owners wallet
  const balanceWallet = await provider.getBalance(signer.address);
  const humanBalanceWallet = ethers.utils.formatEther(balanceWallet);
  console.log("Current sender balance is ETH: ", humanBalanceWallet);

  const humanReadableAbi = [
    "function balanceOf(address owner) view returns (uint balance)",
  ];

  // Connect to Swapped token Contract
  const tokenContract = new ethers.Contract(
    TOKEN_SWAP_ADDRESS,
    humanReadableAbi,
    provider
  );

  // // Print out
  // const swapBalance = await tokenContract.balanceOf(signer.address);
  // const humanSwapBalance = ethers.utils.formatEther(swapBalance);
  // console.log("Current sender balance of Swap Token: ", humanSwapBalance);
  // console.log("");
};

// Execute command
executeTransaction();
