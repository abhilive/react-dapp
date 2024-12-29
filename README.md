# Blockchain for Food Traceability and Safety

## Overview
This project implements a blockchain-based solution to enhance food traceability and safety. It validates temperature conditions for food transportation through smart contracts, ensuring food safety and automating payments or penalties based on compliance.

## Features
- Smart contract validation of temperature data.
- Automated payment execution or penalties based on contract conditions.
- Transparency and immutability via blockchain.

## Tools and Technologies
- **Frontend:** ReactJS
- **Smart Contracts:** Solidity
- **Blockchain Framework:** Hardhat

## Workflow
1. Seller deploys a smart contract with initial deposit and temperature range.
2. Buyer provides details and deposits agreed amount.
3. Buyer imports temperature readings for validation.
4. Smart contract:
   - Transfers the amount to the seller if temperature conditions are met.
   - Applies penalties and refunds if conditions fail.

## Benefits
- **Enhanced Traceability:** Real-time validation of food conditions.
- **Efficiency:** Automated and dispute-free transactions.
- **Trust:** Transparent and tamper-proof validations.

## Getting Started
1. Clone the repository, under both directory hardhat and web-app, run below command to install node-modules.
    ### `npm install`
2. Set up the Hardhat environment for blockchain development. Use below commands under hardhat directory to run the local hardhat server
    ### `npx hardhat node`
3. Under same hardhat directory, in different command window compile and deploy the samrt contract
    ### `npx hardhat compile`
    ### `npx hardhat ignition deploy ./ignition/modules/FoodSafety.js --network localhost`
    Contract address will be desplayed, use this in Step 6.
4. Copy the ABI code from "D:\Projects\Repos\react-dapp\hardhat\artifacts\contracts\FoodSafety.sol\FoodSafety.json" to "D:\Projects\Repos\react-dapp\web-app\src\ethereum\foodSafetyAbi.js" 
5. Use the React frontend to interact with the smart contracts. Go inside root directory web-app and run react app.
    ### `npm run start`
6. Make sure your browser has Metamask installed. Connect metamask to local hardhat network and open react frontend.
    ### ` http://localhost:3000`

## Future Enhancements
- Integration with IoT sensors for real-time temperature updates.
- Expanding to other food safety conditions like humidity or contamination detection.

---

