import { ethers, network } from "hardhat";
import { keccak256 } from "ethers/lib/utils";

const main = async () => {
  // Deploy factory contract
  const Factory = await ethers.getContractFactory("Factory");
  const deployed = await Factory.deploy();
  await deployed.deployed();

  // Initialize factory address
  const FACTORY_ADDRESS = deployed.address;

  // Construct Data detailing which coins provide an arbitrage opportunity
  const sendData = [
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2", // SUSHI
  ];

  // Convert data to bytes array
  const abiSalt = ethers.utils.defaultAbiCoder;
  const params = abiSalt.encode(
    ["address[]"], // encode as address array
    [sendData]
  );

  // Convert array to salt
  const salt = keccak256(params);

  // Get owner
  const [owner, otherAccount] = await ethers.getSigners();

  // Get provider
  const networkProvider: any = network.provider;
  const provider = new ethers.providers.Web3Provider(networkProvider);

  // Connect to Factory as signer
  const factorySigner = new ethers.Contract(FACTORY_ADDRESS, abi, owner);

  // Create submarine contract with the owner as sender
  const contractCreateTx = await factorySigner.createSubContract(salt, owner.address);

  // Print out submarine
  const txReceipt = await provider.getTransaction(contractCreateTx.hash);
  console.log("Submarine contract creation TX Hash: ", txReceipt.hash)

  // Connect to factory with provider
  const factoryProvider = new ethers.Contract(FACTORY_ADDRESS, abi, provider);

  // Get submarine contract address
  const subAddress = await factoryProvider.getSubAddress();
  console.log("Submarine contract address: ", subAddress);
};

// Call main function
main();

// Paste in ABI from artifacts
const abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "createSubContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getSubAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "newSubAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
