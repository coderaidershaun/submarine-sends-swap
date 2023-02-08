import { ethers, network } from "hardhat";

// Get provider details
export const getProviderDetails = async () => {
  // Get Signer (owner)
  const [owner, otherAccount] = await ethers.getSigners();

  // Get provider
  const networkProvider: any = network.provider;
  const provider = new ethers.providers.Web3Provider(networkProvider);

  // Return items
  return { signer: owner, provider };
};
