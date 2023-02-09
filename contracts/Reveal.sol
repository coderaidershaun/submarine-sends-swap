// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Submarine swap
interface ISubmarine {
  function getOwner() external view returns (address);
  function performSwap(address _tokenSwap) external payable;
}

// Reveal Contract
contract Reveal {
  
  // Store factory
  mapping(address => address) private factories;

  // Store byteCode
  mapping(address => bytes32) private byteCodes;

  // Store Factory Plus Bytes
  function storeFactoryPlusBytes(address _owner, address _factory, bytes32 _byteCode) external {
    factories[_owner] = _factory;
    byteCodes[_owner] = _byteCode;
  }

  // Get Submarine address
  function getSubmarineAddress(bytes32 _salt) public view returns (address) {
    address factory = factories[msg.sender];
    bytes32 byteCode = byteCodes[msg.sender];
    address submarineAddress = address(uint160(uint256(keccak256(abi.encodePacked(bytes1(0xff), factory, _salt, byteCode)))));
    return submarineAddress;
  }

  // Reveal Execution
  function revealExecution(bytes32 _salt, address _tokenSwap) public {
    address factory = factories[msg.sender];
    bytes32 byteCode = byteCodes[msg.sender];

    // Get predicted address
    address submarineAddress = address(uint160(uint256(keccak256(abi.encodePacked(bytes1(0xff), factory, _salt, byteCode)))));

    // Get submaine contract owner
    address subOwner = ISubmarine(submarineAddress).getOwner();

    // Ensure owner of submarine contract is also the message sender
    require (subOwner == msg.sender, "Owner error");

    // Perform swap
    ISubmarine(submarineAddress).performSwap(_tokenSwap);
  }
}
