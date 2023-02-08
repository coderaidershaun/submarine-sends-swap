// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Submarine swap
contract SubmarineContractInterface {
      function getOwner() external view returns (address) {}
      function performSwap(address _token) external payable {}
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

  // Reveal Execution
  function revealExecution(bytes32 _salt, address _tokenSwap) public {
    address factory = factories[msg.sender];
    bytes32 byteCode = byteCodes[msg.sender];

    // Get predicted address
    address submarineAddress = address(uint160(uint256(keccak256(abi.encodePacked(bytes1(0xff), factory, _salt, byteCode)))));

    // Connect to Submarine Contract
    SubmarineContractInterface submarineContract = SubmarineContractInterface(submarineAddress);

    // Get submaine contract owner
    address subOwner = submarineContract.getOwner();

    // Ensure owner of submarine contract is also the message sender
    require (subOwner == msg.sender, "Owner error");

    // Perform swap
    submarineContract.performSwap(_tokenSwap);
  }
}
