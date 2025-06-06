import React, { useState, useEffect } from 'react';
import { web3Enable, web3Accounts, web3FromSource } from '@polkadot/extension-dapp';
// Mock API for now
// import { ApiPromise, WsProvider } from '@polkadot/api';

export async function connectWallet() {
  try {
    await web3Enable('ChainForge');
    const allAccounts = await web3Accounts();
    return allAccounts;
  } catch (error) {
    console.error("Error connecting wallet: ", error);
    return [];
  }
}

const WalletConnect = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [handle, setHandle] = useState('');
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      const accs = await connectWallet();
      setAccounts(accs);
      if (accs.length > 0) {
        setSelectedAccount(accs[0]);
      }
    };
    init();
  }, []);

  const handleAccountChange = (event) => {
    const selectedAddress = event.target.value;
    const account = accounts.find(acc => acc.address === selectedAddress);
    setSelectedAccount(account);
  };

  const handleCreateProfile = async () => {
    if (!selectedAccount) {
      setMessage('Please connect your wallet and select an account.');
      return;
    }
    if (!handle) {
      setMessage('Please enter a handle.');
      return;
    }

    setMessage('Creating profile (mocked)...');
    // Mock interaction with the contract
    console.log(`Mocking create_profile call for account: ${selectedAccount.address} with handle: ${handle}`);

    // Simulate a delay and success
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mocked profile data
    const mockProfile = {
      handle: handle,
      level: 1,
    };
    setProfile(mockProfile); // Store the mocked profile to display
    setMessage(`Profile created for ${handle}! (Mocked)`);

    // Actual transaction sending would look something like this (needs ApiPromise setup):
    // const SENDER = selectedAccount.address;
    // const injector = await web3FromSource(selectedAccount.meta.source);
    // const api = await ApiPromise.create({ provider: new WsProvider('ws://localhost:9944') }); // Connect to your node
    // const tx = api.tx.gamerProfileContract.createProfile(handle); // Assuming contract is deployed and method name is correct
    // await tx.signAndSend(SENDER, { signer: injector.signer }, ({ status }) => {
    //   if (status.isInBlock) {
    //     setMessage(`Completed at block hash #${status.asInBlock.toString()}`);
    //   } else {
    //     setMessage(`Current status: ${status.type}`);
    //   }
    // }).catch((error) => {
    //   setMessage(`Transaction failed: ${error.toString()}`);
    // });
  };

  const handleGetProfile = async () => {
    if (!selectedAccount) {
      setMessage('Please connect your wallet and select an account to get a profile.');
      return;
    }
    setMessage(`Fetching profile for ${selectedAccount.address} (mocked)...`);
    // Mock interaction
    console.log(`Mocking get_profile call for account: ${selectedAccount.address}`);

    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demonstration, let's assume if we just created a profile, we can "get" it.
    // In a real scenario, this would query the blockchain.
    if (profile && profile.handle) { // A simple check if a mock profile was "created"
        setMessage(`Profile found for ${profile.handle} (Mocked)`);
        // setProfile(profile) is already done by create
    } else {
        // Simulate finding a generic profile or none
        const mockExistingProfile = { handle: "GenericGamer", level: 5 };
        setProfile(mockExistingProfile);
        setMessage(`Found a generic profile for ${selectedAccount.address}. (Mocked)`);
        // Or:
        // setProfile(null);
        // setMessage(`No profile found for ${selectedAccount.address}. (Mocked)`);
    }
  };

  return (
    <div>
      <h2>Wallet Connection</h2>
      {accounts.length === 0 ? (
        <p>No accounts found. Make sure you have Polkadot-JS extension installed and accounts added.</p>
      ) : (
        <div>
          <select onChange={handleAccountChange} value={selectedAccount?.address}>
            {accounts.map((acc) => (
              <option key={acc.address} value={acc.address}>
                {acc.meta.name} ({acc.address})
              </option>
            ))}
          </select>
          {selectedAccount && <p>Selected Account: {selectedAccount.meta.name} ({selectedAccount.address})</p>}
        </div>
      )}

      <h2>Create Gamer Profile</h2>
      <input
        type="text"
        placeholder="Enter handle"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
      />
      <button onClick={handleCreateProfile} disabled={!selectedAccount || !handle}>
        Create Profile (Mocked)
      </button>

      <h2>Get Gamer Profile</h2>
      <button onClick={handleGetProfile} disabled={!selectedAccount}>
        Get Profile (Mocked)
      </button>

      {message && <p>{message}</p>}

      {profile && (
        <div>
          <h3>Current Profile (Mocked)</h3>
          <p>Handle: {profile.handle}</p>
          <p>Level: {profile.level}</p>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
