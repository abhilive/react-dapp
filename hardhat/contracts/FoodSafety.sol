// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Utils.sol";

contract FoodSafety is Ownable {

    using Utils for uint;

    enum State { Ongoing, Failed, Succeded }

    /* contract fields */
    string public productDescription;
    uint public weightInPound;
    uint public paymentAmountInETH;
    uint public minimumTempInCEL;
    uint public maximumTempInCEL;

    string public name;
    uint public contractExpiry;
    uint public contractDeadline;

    address payable public sellerAddress;
    address payable public buyerAddress;

    State public state;
    uint public deploymentTime;
    
    mapping(address => uint) public amounts;
    bool public collected;

    modifier inState(State expectedState) {
        require(state == expectedState,  "Incorrect contract state");
        _;
    }

    constructor(
        string memory _contractName,
        uint _contractExpiryInSeconds,
        address payable _buyerAddress
    ) payable Ownable(msg.sender)
    {
        name = _contractName;
        contractExpiry = _contractExpiryInSeconds;

        sellerAddress = payable(msg.sender);
        buyerAddress = _buyerAddress;

        state = State.Ongoing;
        deploymentTime = block.timestamp;
        contractDeadline = currentTime() + _contractExpiryInSeconds;
        amounts[msg.sender] += msg.value;
        transferOwnership(buyerAddress);
    }

    // Fallback function to accept Ether
    receive() external payable inState(State.Ongoing) {
        amounts[msg.sender] += msg.value;
        collected = true;
    }

    function contractBalance() public view returns(uint) {
        return address(this).balance;
    }

    function validateTemperature(uint _importedTemperature) inState(State.Ongoing) public {
        require(msg.sender == buyerAddress, "Only the buyer can validate contract");

        /** Temperature validated */
        if(_importedTemperature >= minimumTempInCEL && _importedTemperature <= maximumTempInCEL) {
            sellerAddress.transfer(contractBalance()); // Transfer whole amount to seller
            state = State.Succeded; // Marked transaction success
        } else {
            uint buyerContributed = amounts[msg.sender];
            uint penaltyAmt = (address(this).balance * 10) / 100;
            buyerAddress.transfer(buyerContributed + penaltyAmt);
            sellerAddress.transfer(contractBalance());
            state = State.Failed; // Marked transaction failed
        }
    }

    function beforeDeadline() public view returns(bool) {
        return currentTime() < contractDeadline;
    }

    function afterDeadline() internal view returns(bool) {
        return !beforeDeadline();
    }

    function currentTime() private view returns(uint) {
        return block.timestamp;
    }

    function setContractData(
        string memory _productDescription,
        uint _weightInPound,
        uint _minimumTempInCEL,
        uint _maximumTempInCEL) external payable {
            require(beforeDeadline(), "Contract deadline has passed");
            productDescription = _productDescription;
            weightInPound = _weightInPound;
            minimumTempInCEL = _minimumTempInCEL;
            maximumTempInCEL = _maximumTempInCEL;
            // record the value sent to the address that sent it
            amounts[msg.sender] += msg.value;
    }

}