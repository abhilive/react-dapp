import Web3 from 'web3'
import foodSafetyAbi from './foodSafetyAbi'

export function getWeb3() {
  // return new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  return new Web3(window.ethereum)
}

export function getContract(web3, contractAddress) {
  console.log("contractAddress-utilsJs: "+contractAddress);
  return new web3.eth.Contract(foodSafetyAbi, contractAddress);
}