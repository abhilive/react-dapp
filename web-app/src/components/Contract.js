import React, { useEffect, useState, useMemo } from 'react'
import { Button, Table, Message } from 'semantic-ui-react'
import {
  useParams,
} from 'react-router-dom'
import { ethers } from "ethers"
import { getWeb3 } from '../ethereum/utils'

import ContributeInput from './ContributeInput'
import SuccededStateInput from './SuccededStateInput'
import FailedStateInput from './FailedStateInput'
import { getContract } from '../ethereum/utils'

const ONGOING_STATE = '0'
const FAILED_STATE = '1'
const SUCCEDED_STATE = '2'

export default function Contract() {
  const web3 = useMemo(() => getWeb3(), [])
  const [currentAccount, setCurrentAccount] = useState(null)
  const [networkId, setNetworkId] = useState(null)
  const [contractInfo, setContractInfo] = useState({
      name: 'N/A',
      targetAmount: 0,
      totalCollected: 0,
      contractExpired: false,
      deadline: new Date(0),
      isBuyer: true,
      contributedAmount: 10,
      state: ONGOING_STATE
  })

  async function connectWallet() {
    const accounts = await web3.eth.requestAccounts()
    setCurrentAccount(accounts[0])
  }

  async function getCurrentConnectedAccount() {
    const accounts = await web3.eth.getAccounts()
    setCurrentAccount(accounts[0])
    setNetworkId(await web3.eth.net.getId())
  }

  window.ethereum.on('accountsChanged', function (accounts) {
    if (accounts) {
      setCurrentAccount(accounts[0])
    }
  })

  window.ethereum.on('networkChanged', function(networkId){
    console.log("New network ID: ", networkId)
    setNetworkId(networkId)
  })

  const { address } = useParams();

  useEffect(() => {
    getCurrentConnectedAccount()
  })

  useEffect(() => {
    async function getContractData(address) {
      if (!currentAccount) return;

      const contract = getContract(web3, address)

      try {
        const name = await contract.methods.name().call()

        // const targetAmountInWei = await contract.methods.targetAmount().call()
        // const targetAmount = ethers.formatEther(targetAmountInWei);

        const contractBalanceInWei = await contract.methods.contractBalance().call() // contract balance - total Collected
        const contractBalance = ethers.formatEther(contractBalanceInWei);

        const beforeDeadline = await contract.methods.beforeDeadline().call()
        const buyerAddress = await contract.methods.buyerAddress().call()
        const blockTimestamp = await contract.methods.deploymentTime().call()
        const deadlineSeconds = await contract.methods.contractExpiry().call()
        // const contributedAmount = await contract.methods.amounts(currentAccount).call()
        const contractDeadline = await contract.methods.contractDeadline().call()
        const state = await contract.methods.state().call()

        console.log("blockTimestamp:"+ typeof Number(blockTimestamp));
        const blockTimeMs = Number(blockTimestamp) * 1000
        const deadlineSecondsMs = Number(deadlineSeconds) * 1000
        const blockDate = new Date(blockTimeMs + deadlineSecondsMs)

        const contractDeatlineInDate = new Date(Number(contractDeadline)) * 1000
        console.log("blockDate: "+ blockDate);
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          dateStyle: "full",
          timeStyle: "long",
        });
        const deadlineDate = formatter.format(blockDate)
        // deadlineDate.setUTCSeconds(web3.utils.toNumber(deadlineSeconds))
        console.log("buyerAddress: "+buyerAddress.toLowerCase())
        console.log("currentAccount: "+currentAccount.toLowerCase())
        console.log("blockDate: "+formatter.format(new Date(blockTimeMs)))
        console.log("contractDeatline: "+ formatter.format(contractDeatlineInDate))
        console.log("beforeDeadline: "+beforeDeadline);
        setContractInfo({
          name: name,
          totalCollected: contractBalance, //contract balance
          contractExpired: !beforeDeadline,
          deadline: deadlineDate,
          isBuyer: buyerAddress.toLowerCase() === currentAccount.toLowerCase(),
          state: state
        })
      } catch (e) {
        setContractInfo(null)
      }
    }
    getContractData(address)
  }, [web3, address, currentAccount, networkId])

  if (!currentAccount) {
    return (
      <>
        <Message info>
          <Message.Header>Website is not connected to Ethereum</Message.Header>
          <p>You need to connect your wallet first</p>
        </Message>
        <Button primary onClick={() => connectWallet()}>Connect Wallet</Button>
      </>
    )
  }

  if (!contractInfo) {
    return (
      <Message negative>
        <Message.Header>Failed to load contract data</Message.Header>
        <p>Check if the contract is deployed and you are using the right network</p>
      </Message>
    )
  }

  return <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Value</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>

      <Table.Row>
        <Table.Cell>Contract Name</Table.Cell>
        <Table.Cell>{contractInfo.name}</Table.Cell>
      </Table.Row>

      <Table.Row>
        <Table.Cell>Contract amount (in ETH)</Table.Cell>
        <Table.Cell>{contractInfo.totalCollected}</Table.Cell>
      </Table.Row>

      <Table.Row>
        <Table.Cell>Has Contract Expired ?</Table.Cell>
        <Table.Cell>{contractInfo.contractExpired.toString()}</Table.Cell>
      </Table.Row>

      <Table.Row>
        <Table.Cell>Contract End Time</Table.Cell>
        <Table.Cell>{contractInfo.deadline.toString()}</Table.Cell>
      </Table.Row>

      <Table.Row>
        <Table.Cell>Am I Buyer ?</Table.Cell>
        <Table.Cell>{contractInfo.isBuyer.toString()}</Table.Cell>
      </Table.Row>

      <Table.Row>
        <Table.Cell>Contract state</Table.Cell>
        <Table.Cell>{contractInfo.state.toString() === "0" ? "Ongoing" : "Finished"}</Table.Cell>
      </Table.Row>

    </Table.Body>

    <Table.Footer fullWidth>
      <Table.Row>
        <Table.HeaderCell colSpan="2">
          {campaignInteractionSection(contractInfo, address, currentAccount)}
        </Table.HeaderCell>
      </Table.Row>
    </Table.Footer>
  </Table>
}

function campaignInteractionSection(contractInfo, address, currentAccount) {
  console.log("contractInfo.state:"+ contractInfo.state);
  if (contractInfo.state.toString() === ONGOING_STATE) {
    return <ContributeInput
      contractExpired={contractInfo.contractExpired}
      contractAddress={address}
      currentAccount={currentAccount}
    />
  } else if (contractInfo.state.toString() === SUCCEDED_STATE) {
    return <SuccededStateInput
      isBeneficiary={contractInfo.isBeneficiary}
    />
  } else if (contractInfo.state.toString() === FAILED_STATE) {
    return <FailedStateInput
      contributedByCurrentAccount={contractInfo.contributedByCurrentAccount}
    />
  }
}