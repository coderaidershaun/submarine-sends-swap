// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


// Interface Contract
contract RevealContractInterface {
    function storeFactoryPlusBytes(address _owner, address _factory, bytes32 _byteCode) external {}
}


// Submarine Contract
contract Submarine {

    // Store Owner
    address private owner;

    // Store Reveal Contract
    address private revealContractAddr;

    // Contract constructor
    constructor(address _owner, address _revealContract) payable {
        owner = _owner;
        revealContractAddr = _revealContract;
    }

    // Check is owner
    function _checkOwner() private view {
        require(msg.sender == owner, "Not called by owner");
    }

    // Get owner
    function getOwner() external view returns (address) {   
        require(msg.sender == revealContractAddr, "Reveal contract only"); 
        return owner;
    }

    // Perform Swap or Arbitrage
    function performSwap(address _tokenSwap) external payable {
        require(msg.sender == revealContractAddr, "Not allowed reveal contract");
        //...perform swap
        destroy();
    }

    // Destroy smart contract
    function destroy() public payable {
        _checkOwner();
        address payable addr = payable(address(owner));
        selfdestruct(addr);
    }
}


// Factory Contract
contract Factory {

    // Store Reveal Contract
    address private revealContractAddr;

    // Store Submarine Addresses
    mapping(address => address) private submarines;

    // Contract constructor
    constructor(address _revealContract) payable {
        revealContractAddr = _revealContract;
    }

    // Create Sub Contract
    function createSubContract(bytes32 _salt, address _owner) public {

        // Get byteCode for storing in the reveal contract
        // Store as bytes32 as cheaper than string
        bytes32 byteCode = keccak256(abi.encodePacked(type(Submarine).creationCode, abi.encode(_owner)));

        // Create Submarine Contract with Salt
        Submarine sub = new Submarine{salt: _salt}(_owner, revealContractAddr);

        // Create bytecode
        // Owner, Factory, Bytes
        RevealContractInterface revealContract = RevealContractInterface(revealContractAddr);
        revealContract.storeFactoryPlusBytes(_owner, address(this), byteCode);

        // Store address
        submarines[_owner] = address(sub);
    }

    // Get ByteCode
    function _getByteCode (address _owner) private view returns (bytes memory) {
        bytes memory bytecode = type(Submarine).creationCode;
        return abi.encodePacked(bytecode, abi.encode(_owner, revealContractAddr));
    }

    // Get Stored Submarine Address
    function getActualSubAddress() public view returns (address) {
        return submarines[msg.sender];
    }

    // Get Submarine Address
    function getPredictedSubAddress (bytes32 _salt, address _owner) public view returns (address) {
        address predictedAddress = address(uint160(uint(keccak256(abi.encodePacked(
            bytes1(0xff),
            address(this),
            _salt,
            keccak256(abi.encodePacked(
                type(Submarine).creationCode,
                abi.encode(_owner, revealContractAddr)
            ))
        )))));
        return predictedAddress;
    }

    // Get Reveal Contract Address
    function getRevealContractAddress () public view returns (address) {
        return revealContractAddr;
    }
}
