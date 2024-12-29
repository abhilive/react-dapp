// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

library Utils {

    function etherToWei(uint sumInEth) internal pure returns(uint) {
        return sumInEth * 1 ether;
    }

    function minutesToSeconds(uint timeInMin) internal pure returns(uint) {
        return timeInMin * 1 minutes;
    }
}