import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './index.css'
import Navigation from './components/Navigation'

function App() {
  const [account, setAccount] = useState(null)

  const loadBlockchainData = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.getAddress(accounts[0])
    setAccount(account)
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Dappazon Best Sellers</h2>
    </div>
  )
}

export default App
