import React from 'react'
import { Message } from 'semantic-ui-react'
import Contract from './Contract'

export default function ContractPage() {
  if (!isWalletPluginInstalled()) {
    return <Message negative>
      <Message.Header>Wallet not available</Message.Header>
      <p>Please install a wallet to use this application</p>
    </Message>
  }

  return <Contract />
}

function isWalletPluginInstalled() {
  return !!window.ethereum
}
