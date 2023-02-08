import { ethers, network, config } from "hardhat";

// Get provider details
export const getProviderDetails = async () => {
  // Get Signer (owner)
  const [owner, otherAccount] = await ethers.getSigners();

  // Get provider
  const networkProvider: any = network.provider;
  const provider = new ethers.providers.Web3Provider(networkProvider);
  
  // // Create walletSigner
  // const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  // const wallet = new ethers.Wallet(privateKey, provider);
  
  // Return items
  return { signer: owner, provider };
};
