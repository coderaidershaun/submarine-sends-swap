import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const networkUrl = process.env.PROVIDER_URL;
const privateKey = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: networkUrl,
      accounts: [privateKey!]
    }
  }
};

export default config;
