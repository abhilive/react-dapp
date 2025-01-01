import React, { useState } from 'react'
import { Input, Divider, Form } from 'semantic-ui-react'
import { getWeb3, getContract } from '../ethereum/utils'

export default function ContributeInput(props) {

  const {
    contractAddress,
    currentAccount
  } = props;

  const web3 = getWeb3()
  // const [contributionAmount, setContributionAmount] = useState('')
  const [importedTemperature, setImportedTemperature] = useState('')

  const [productDescription, setProductDescription] = useState('')
  const [weightInPound, setWeightInPound] = useState('')
  const [paymentAmountInETH, setPaymentAmountInETH] = useState('')
  const [minimumTempInCEL, setMinimumTempInCEL] = useState('')
  const [maximumTempInCEL, setMaximumTempInCEL] = useState('')

  async function onUpdateContract(event) {

    const amount = web3.utils.toWei(
      paymentAmountInETH,
      'ether'
    )

    // Create contract instance
    const contract = getContract(web3, contractAddress)

    try {
        // Build transaction
        const tx = contract.methods.setContractData(productDescription, weightInPound, minimumTempInCEL, maximumTempInCEL);
        const gasEstimate = await web3.eth.estimateGas({
          value: amount,
          from: currentAccount,
          to: contractAddress,
          data: tx.encodeABI()
        })
        console.log("amount:"+ amount);
        console.log("gasEstimate:"+ gasEstimate);
        await web3
        .eth.sendTransaction({
          from: currentAccount,
          to: contractAddress,
          data: tx.encodeABI(),
          value: amount,
          gas: gasEstimate
        })
        .once('transactionHash', function(hash) {
          console.log('Transaction hash received', hash)
        })
        .once('receipt', function(receipt) {
          console.log('Transaction receipt received', receipt)
        })
        .on('confirmation', function(confNumber, receipt) {
          console.log('Confirmation', confNumber)
        })
    } catch (error) {
        console.error('Error updating contract data:', error);
    }
  }

  async function onValidateContract(event) {
    // Create contract instance
    const contract = getContract(web3, contractAddress)
    const tx = contract.methods.validateTemperature(importedTemperature);
    try {
      const gasEstimate = await web3.eth.estimateGas({
        from: currentAccount,
        to: contractAddress,
        data: tx.encodeABI()
      })
      await web3
        .eth.sendTransaction({
          from: currentAccount,
          to: contractAddress,
          data: tx.encodeABI(),
          gas: gasEstimate
        })
        .once('transactionHash', function(hash) {
          console.log('Transaction hash received', hash)
        })
        .once('receipt', function(receipt) {
          console.log('Transaction receipt received', receipt)
        })
        .on('confirmation', function(confNumber, receipt) {
          console.log('Confirmation', confNumber)
        })
    } catch (error) {
      console.log('Error occured:', error)
    }
  }

  // if (contractExpired) {
  //   return <Button type='submit'>Close contract</Button>
  // }
  return <div>
    <div>
    <Form onSubmit={onUpdateContract}>
      <Form.Input
        label='Product Description'
        type='text'
        required
        value={productDescription}
        onChange={e => setProductDescription(e.target.value)}
      />
      <Form.Input
        label='Weight in Pound'
        type='text'
        required
        error={weightInPound !== '' && !isValidNumber(weightInPound)}
        value={weightInPound}
        onChange={e => setWeightInPound(e.target.value)}
      />
      <Form.Input
        label='Payment Amount in ETH'
        type='text'
        required
        error={paymentAmountInETH !== '' && !isValidNumber(paymentAmountInETH)}
        value={paymentAmountInETH}
        onChange={e => setPaymentAmountInETH(e.target.value)}
      />
      <Form.Input
        label='Required minimum temperature in Celsius'
        type='text'
        required
        error={minimumTempInCEL !== '' && !isValidNumber(minimumTempInCEL)}
        value={minimumTempInCEL}
        onChange={e => setMinimumTempInCEL(e.target.value)}
      />
      <Form.Input
        label='Required maximum temperature in Celsius'
        type='text'
        required
        error={maximumTempInCEL !== '' && !isValidNumber(maximumTempInCEL)}
        value={maximumTempInCEL}
        onChange={e => setMaximumTempInCEL(e.target.value)}
      />
      {/* Future Work */}
      {/* <Form.Input
        label='Required average temperature in Fahrenheit'
        type='text'
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <Form.Input
        label='Allowed deviation from average Temperature (positive figure)'
        type='text'
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <Form.Input
        label='Enter the agreed penalty by non performance (between 1 to 100%)'
        type='text'
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      /> */}
      <Divider />
      <Form.Button primary content='Update Contract' type='submit' />
      </Form>
      <Divider />
      {/* Importing Temperature */}
      <Input
        action={{
          color: 'teal',
          content: 'Import Temperature',
          disabled: !isValidNumber(importedTemperature),
          onClick: onValidateContract
        }}
        error={importedTemperature !== '' && !isValidNumber(importedTemperature)}
        actionPosition='left'
        label='°C'
        labelPosition='right'
        placeholder='like 0-25°C'
        onChange={(e) => setImportedTemperature(e.target.value)}
      />
      <Divider />
    </div>
  </div>
}

function isValidNumber(amount) {
  return !isNaN(parseFloat(amount))
}
