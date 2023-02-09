import { ethers, network } from "hardhat";
import dotenv from "dotenv"
dotenv.config();

const isLiveNetwrok = process.env.IS_LIVE;
const networkUrl = process.env.PROVIDER_URL;
const privateKey = process.env.PRIVATE_KEY;

// Get provider details
export const getProviderDetails = async () => {
  let provider: any;
  let signer: any;

  // Will interfact with localhost hardhat
  if (!isLiveNetwrok) {
    // Get Signer (owner)
    const [owner, otherAccount] = await ethers.getSigners();
    signer = owner;
  
    // Get provider
    const networkProvider: any = network.provider;
    provider = new ethers.providers.Web3Provider(networkProvider);
    
    // Return items
    return { signer: owner, provider };
  } else {

    // Provider
    provider = new ethers.providers.JsonRpcProvider(networkUrl);

    // Create signer from private key
    signer = new ethers.Wallet(privateKey!, provider);
  }

  // Return signer and provider
  return { signer, provider }; 
};
