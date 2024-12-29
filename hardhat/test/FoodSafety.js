const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");

describe("FoodSafety", function() {
    async function deployThirtyMinutesLockFixture() {
        const Thirty_Minutes_In_Seconds = 30*60;
        const ONE_GWEI = 1_000_000_000;

        const lockedAmount = ONE_GWEI;
        //const unlockTime = (await time.latest()) + Thirty_Minutes_In_Seconds;

        const contractName = "Test Contract";
        const targetAmountEth = 1500;
        const durationInMin = (await time.latest()) + Thirty_Minutes_In_Seconds;
        const beneficiaryAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const FoodSafety = await ethers.getContractFactory("FoodSafety");
        const foodsafety = await FoodSafety.deploy(
            contractName, targetAmountEth, durationInMin, beneficiaryAddress, { value: lockedAmount });

        return { foodsafety, contractName, targetAmountEth, durationInMin,
            beneficiaryAddress, lockedAmount, owner, otherAccount };
    }

    describe("Deployment", function() {
        it("Should set the rigt campaign name", async function() {
            const { foodsafety, contractName } = await loadFixture(deployThirtyMinutesLockFixture);
            expect(await foodsafety.name()).to.equal(contractName);
        });

        it("Should set the right durationInMin", async function () {
            const { foodsafety, durationInMin } = await loadFixture(deployThirtyMinutesLockFixture);
            expect(await foodsafety.fundingDeadline()).to.equal(durationInMin);
        });
    
        it("Should set the right owner", async function () {
            const { foodsafety, owner } = await loadFixture(deployThirtyMinutesLockFixture);
            expect(await foodsafety.owner()).to.equal(owner.address);
        });
      
          it("Should receive and store the funds to foodsafety", async function () {
            const { foodsafety, lockedAmount } = await loadFixture(
                deployThirtyMinutesLockFixture
            );
      
            expect(await ethers.provider.getBalance(foodsafety.target)).to.equal(
              lockedAmount
            );
          });

    });
});