import { ethers } from "hardhat";
import dotenv from "dotenv";
dotenv.config();

const networkUrl = process.env.PROVIDER_URL;
const privateKey = process.env.PRIVATE_KEY;

// Get provider details
export const getProviderDetails = async () => {
  const provider = new ethers.providers.JsonRpcProvider(networkUrl);
  const signer = new ethers.Wallet(privateKey!, provider);

  // Return signer and provider
  return { signer, provider };
};
