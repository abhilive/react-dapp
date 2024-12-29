// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FoodSafetyModule", (m) => {

  const lockedAmount = m.getParameter("lockedAmount", ethers.parseEther("100")); // ONE_GWEI

    const contractName = m.getParameter("contractName", "Test Contract");
    const contractExpiryInSeconds = m.getParameter("contractExpiryInSeconds", 10*60); // 10 Minutes
    const buyerAddress = m.getParameter("buyerAddress", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"); // buyer address

    const foodSafety = m.contract("FoodSafety", 
        [ contractName, contractExpiryInSeconds, buyerAddress ],
        {
            value: lockedAmount,
        }
    );

    return { foodSafety };
});
