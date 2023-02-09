import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect, assert } from "chai";
import { keccak256 } from "ethers/lib/utils";
import { ethers, network } from "hardhat";
import * as FactoryJSON from "../artifacts/contracts/FactoryTest.sol/FactoryTest.json";
import * as RevealJSON from "../artifacts/contracts/Reveal.sol/Reveal.json";

// Definitions
const TOKEN_SWAP = "0x08209a62C202c2DAF27d2796bb574779cC345889"; // Any token you like
const UNIQUE_INT = 0;
const ETH_VALUE = "5.0";

// Construct Salt Function
const constructSalt = async (tokenSwap: string, uniqueInt: number) => {
  const sendData = [tokenSwap];
  const abiSalt = ethers.utils.defaultAbiCoder;
  const params = abiSalt.encode(["address[]", "uint"], [sendData, uniqueInt]);
  const salt = keccak256(params);
  return salt;
};

describe("Frontrunning Mitigation", function () {
  const getProviders = async () => {
    // Get provider
    const networkProvider: any = network.provider;
    const provider = new ethers.providers.Web3Provider(networkProvider);

    // Get signer
    const [owner] = await ethers.getSigners();

    // Return signer and provider
    return { signer: owner, provider };
  };

  // Deploy contracts
  const deployContracts = async () => {
    // Deploy Reveal Contract
    const ContractReveal = await ethers.getContractFactory("Reveal");
    const deployedReveal = await ContractReveal.deploy();
    await deployedReveal.deployed();

    // Deploy Factory Contract
    const ContractFactory = await ethers.getContractFactory("FactoryTest");
    const deployedFactory = await ContractFactory.deploy(
      deployedReveal.address
    );
    await deployedFactory.deployed();

    // Return
    return {
      revealAddress: deployedReveal.address,
      factoryAddress: deployedFactory.address,
    };
  };

  // Create Submarine contract
  const createSubmarineContract = async () => {
    const { factoryAddress, revealAddress } = await deployContracts();
    const { signer, provider } = await getProviders();
    const salt = await constructSalt(TOKEN_SWAP, UNIQUE_INT);

    // Connect to contract
    const factoryContractSigner = new ethers.Contract(
      factoryAddress,
      FactoryJSON.abi,
      signer
    );

    // Create Submarine contract
    const contractCreateTx = await factoryContractSigner.createSubContract(
      salt,
      signer.address
    );

    // Get transaction receipt
    const txReceipt = await provider.getTransaction(contractCreateTx.hash);

    // Get predicted address
    const predSubAddress = await factoryContractSigner.getPredictedSubAddress(
      salt,
      signer.address
    );

    // Get actual address
    const actualSubAddr = await factoryContractSigner.getActualSubAddress();

    // Return result
    return {
      predSubAddress,
      actualSubAddr,
      txReceipt,
      factoryAddress,
      revealAddress,
    };
  };

  describe("Submarine Send", function () {
    it("Deploys reveal contract", async function () {
      const { revealAddress } = await loadFixture(deployContracts);
      assert(revealAddress, "No reveal contract");
    });

    it("Deploys factory contract", async function () {
      const { factoryAddress } = await loadFixture(deployContracts);
      assert(factoryAddress, "No reveal contract");
    });

    it("Encodes Salt", async function () {
      const salt = await constructSalt(TOKEN_SWAP, UNIQUE_INT);
      assert(salt, "No salt value");
    });

    it("Creates Submarine contract with expected address", async function () {
      const { predSubAddress, actualSubAddr } = await loadFixture(
        createSubmarineContract
      );
      expect(predSubAddress).to.equal(actualSubAddr);
    });

    it("Sends funds to Submarine address", async function () {
      const { actualSubAddr } = await loadFixture(createSubmarineContract);
      const { signer, provider } = await getProviders();

      // Get current Submarine Contract balance
      const initialSubBalance = ethers.utils.formatEther(
        await provider.getBalance(actualSubAddr)
      );

      // Convert ethereum into wei
      const amountWei = ethers.utils.parseEther(ETH_VALUE);

      // Build Transaction
      const tx = {
        to: actualSubAddr,
        value: amountWei,
      };

      // Send Transaction
      const txSend = await signer.sendTransaction(tx);

      // Get balance of submarine after transaction
      const submarineBalance = await provider.getBalance(actualSubAddr);
      const humanSubBalance = ethers.utils.formatEther(submarineBalance);
      expect(initialSubBalance).to.equal("0.0");
      expect(humanSubBalance).to.equal("5.0");
    });

    it("Performs swap and destroys contract", async function () {
      const { actualSubAddr, revealAddress } = await loadFixture(
        createSubmarineContract
      );
      const { signer, provider } = await getProviders();
      const salt = await constructSalt(TOKEN_SWAP, UNIQUE_INT);

      // Connect to reveal contract
      const revealContractSigner = new ethers.Contract(
        revealAddress,
        RevealJSON.abi,
        signer
      );

      // Execute reveal
      const swapTx = await revealContractSigner.revealExecution(
        salt,
        TOKEN_SWAP
      );

      // Get Submarine contract balance
      const subBalance = await provider.getBalance(actualSubAddr);
      const humanSubBalance = ethers.utils.formatEther(subBalance);

      // Get balance signer
      const balanceWallet = await provider.getBalance(signer.address);
      const humanBalanceWallet = ethers.utils.formatEther(balanceWallet);

      // Final checks
      expect(humanSubBalance).to.equal("0.0");
      expect(Number(humanBalanceWallet)).to.greaterThan(9999);
    });
  });
});
