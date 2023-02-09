// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


// Interface Contract
interface IReveal {
    function storeFactoryPlusBytes(address _owner, address _factory, bytes32 _byteCode) external;
}

// Interface WETH
interface IWETH {
    function deposit() external payable;
    function withdraw(uint) external;
}

// Interface UniswapV2
interface IUniswap {
    function swapETHForExactTokens(uint, address[] calldata, address, uint) external payable;
    function getAmountsOut(uint, address[] memory) external returns (uint[] memory);
}

// Inter

// Submarine Contract
contract Submarine {

    // Store Owner
    address payable private owner;

    // Store Reveal Contract
    address private revealContractAddr;

    // Store Uniswap V3 Router
    address constant uniswapRouterAddr = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    // Store WETH address
    // Testnet 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6
    // Mainnet 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    address constant WETHAddr = 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6;

    // Contract constructor
    constructor(address payable _owner, address _revealContract) payable {
        owner = _owner;
        revealContractAddr = _revealContract;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

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
        require(msg.sender == revealContractAddr, "Not allowed caller for swap");
        //...perform swap
        _executeTrade(_tokenSwap);
        _destroy();
    }

    // Execute
    function _executeTrade(address _tokenSwap) private {

        // Wrap ETH to WETH for swap
        IWETH(WETHAddr).deposit{ value: address(this).balance }();


        // Define deadline
        uint deadline = block.timestamp + 3000;

        // Structure addresses
        address[] memory addressPath = new address[](2);
        addressPath[0] = WETHAddr;
        addressPath[1] = _tokenSwap;

        // Get amounts out
        uint[] memory amountsOut = IUniswap(uniswapRouterAddr).getAmountsOut(address(this).balance, addressPath);

        // Send Swap
        IUniswap(uniswapRouterAddr).swapETHForExactTokens(
            amountsOut[1],
            addressPath,
            owner,
            deadline
        );

        // Destroy Submarine Contract
        _destroy();
    }

    // Destroy smart contract
    function _destroy() public payable {
        require(msg.sender == revealContractAddr, "Not allowed caller for destroy");
        address payable addr = payable(address(owner));
        selfdestruct(addr);
    }
}


// Factory Contract
contract FactoryLive {

    // Store Reveal Contract
    address private revealContractAddr;

    // Store Submarine Addresses
    mapping(address => address) private submarines;

    // Contract constructor
    constructor(address _revealContract) payable {
        revealContractAddr = _revealContract;
    }

    // Create Sub Contract
    function createSubContract(bytes32 _salt, address payable _owner) public {

        // Get byteCode for storing in the reveal contract
        bytes32 byteCode = keccak256(abi.encodePacked(type(Submarine).creationCode, abi.encode(_owner, revealContractAddr)));

        // Create Submarine Contract with Salt
        Submarine sub = new Submarine{salt: _salt}(_owner, revealContractAddr);

        // Create bytecode
        // Owner, Factory, Bytes
        IReveal(revealContractAddr).storeFactoryPlusBytes(_owner, address(this), byteCode);

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
