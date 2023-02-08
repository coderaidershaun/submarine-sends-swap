// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


// Interface Contract
contract RevealContractInterface {
    function storeFactoryPlusBytes(address _owner, address _factory, bytes32 _byteCode) external pure {}
}


// Submarine Contract
contract Submarine {
    address private owner;
    address private swapTokenEncrypted;

    // Put address of REVEAL CONTRACT
    // Constant makes sure that this is included in the Byte Code and reduces gas
    address constant revealContractAddr = 0x1F9840a23D5aF5bf1d1762F925bdadDc4201f973;

    // Contract constructor
    constructor(address _owner, address _swapTokenEncrypted) payable {
        owner = _owner;
        swapTokenEncrypted = _swapTokenEncrypted;
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

    // Define REVEAL CONTRACT
    address private constant revealContractAddr = 0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272;
    RevealContractInterface revealContract = RevealContractInterface(revealContractAddr);

    // Create Sub Contract
    function createSubContract(bytes32 _salt, address _owner, address _swapTokenEncrypted)
        public
    {

        // Get byteCode for storing in the reveal contract
        // Store as bytes32 as cheaper than string
        bytes32 byteCode = keccak256(abi.encodePacked(type(Submarine).creationCode, abi.encode(_owner)));

        // Create Submarine Contract with Salt
        // Submarine sub = new Submarine{salt: _salt}(_owner, _swapTokenEncrypted);
        new Submarine{salt: _salt}(_owner, _swapTokenEncrypted);

        // Create bytecode
        // Owner, Factory, Bytes
        revealContract.storeFactoryPlusBytes(_owner, address(this), byteCode);
    }
}
