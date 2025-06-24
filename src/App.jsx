import React, { useState, useEffect } from 'react';
import { Wallet, Send, Download, Eye, AlertCircle, CheckCircle, Loader, DollarSign, CreditCard, TrendingUp, Users, Settings } from 'lucide-react';
import CryptoBank from "./abi/CryptoBank.json";

const contractAddress = "0xB581C9264f59BF0289fA76D61B2D0746dCE3C30D"; // Replace with actual deployed contract address
const abi = CryptoBank.abi;

const CryptoBankingSystem = () => {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [activeTab, setActiveTab] = useState('account');

  // Account state
  const [accountInfo, setAccountInfo] = useState({
    balance: '0',
    balanceWithInterest: '0',
    isActive: false,
    depositCount: 0,
    withdrawalCount: 0
  });

  // Transaction state
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Loan state
  const [loanInfo, setLoanInfo] = useState({
    amount: '0',
    interestRate: '0',
    isActive: false,
    isRepaid: false,
    repaymentAmount: '0'
  });
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDuration, setLoanDuration] = useState('');
  const [repayAmount, setRepayAmount] = useState('');

  // Bank state
  const [bankInfo, setBankInfo] = useState({
    bankReserve: '5000',
    interestRate: '5.0',
    minimumDeposit: '0.01'
  });

  const CONTRACT_ADDRESS = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsLoading(true);
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          showNotification('Wallet connected successfully!', 'success');
          await updateAccountInfo();
        } else {
          showNotification('No accounts found. Please unlock MetaMask.', 'error');
        }
      } catch (error) {
        console.error('Wallet connection error:', error);
        if (error.code === 4001) {
          showNotification('Connection rejected by user', 'error');
        } else {
          showNotification('Failed to connect wallet: ' + error.message, 'error');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      showNotification('MetaMask not detected! Please install MetaMask extension.', 'error');
    }
  };

  const updateAccountInfo = async () => {
    if (!isConnected) return;
    
    try {
      // Simulate fetching account info from contract
      setAccountInfo({
        balance: '1.245',
        balanceWithInterest: '1.267',
        isActive: true,
        depositCount: 3,
        withdrawalCount: 1
      });

      setLoanInfo({
        amount: '0.5',
        interestRate: '8.0',
        isActive: true,
        isRepaid: false,
        repaymentAmount: '0.52'
      });
    } catch (error) {
      showNotification('Failed to update account info', 'error');
    }
  };

  const createAccount = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification('Account created successfully!', 'success');
      await updateAccountInfo();
    } catch (error) {
      showNotification('Failed to create account', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      showNotification('Please enter a valid deposit amount', 'error');
      return;
    }

    if (parseFloat(depositAmount) < parseFloat(bankInfo.minimumDeposit)) {
      showNotification(`Minimum deposit is ${bankInfo.minimumDeposit} ETH`, 'error');
      return;
    }

    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification(`Successfully deposited ${depositAmount} ETH!`, 'success');
      setDepositAmount('');
      await updateAccountInfo();
    } catch (error) {
      showNotification('Deposit failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      showNotification('Please enter a valid withdrawal amount', 'error');
      return;
    }

    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification(`Successfully withdrew ${withdrawAmount} ETH!`, 'success');
      setWithdrawAmount('');
      await updateAccountInfo();
    } catch (error) {
      showNotification('Withdrawal failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const applyForLoan = async () => {
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      showNotification('Please enter a valid loan amount', 'error');
      return;
    }

    if (!loanDuration || parseInt(loanDuration) <= 0 || parseInt(loanDuration) > 365) {
      showNotification('Loan duration must be between 1-365 days', 'error');
      return;
    }

    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification(`Loan application approved for ${loanAmount} ETH!`, 'success');
      setLoanAmount('');
      setLoanDuration('');
      await updateAccountInfo();
    } catch (error) {
      showNotification('Loan application failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const repayLoan = async () => {
    if (!repayAmount || parseFloat(repayAmount) <= 0) {
      showNotification('Please enter a valid repayment amount', 'error');
      return;
    }

    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification(`Loan repaid successfully with ${repayAmount} ETH!`, 'success');
      setRepayAmount('');
      await updateAccountInfo();
    } catch (error) {
      showNotification('Loan repayment failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const claimInterest = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification('Interest claimed successfully!', 'success');
      await updateAccountInfo();
    } catch (error) {
      showNotification('Failed to claim interest', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            await updateAccountInfo();
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();

    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setAccount('');
          showNotification('Wallet disconnected', 'error');
        } else {
          setAccount(accounts[0]);
          if (!isConnected) {
            setIsConnected(true);
            updateAccountInfo();
            showNotification('Wallet connected', 'success');
          }
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <DollarSign className="text-blue-400 w-12 h-12 mr-3" />
            <h1 className="text-4xl font-bold text-white">Crypto Banking System</h1>
          </div>
          <p className="text-gray-400">Decentralized Banking • Loans • Interest</p>
        </div>

        {/* Notification */}
        {notification.message && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white border ${
            notification.type === 'success' ? 'border-green-500' : 'border-red-500'
          }`}>
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
            {notification.message}
          </div>
        )}

        {!isConnected ? (
          /* Connect Wallet Card */
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center shadow-xl">
            <Wallet className="w-24 h-24 text-blue-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">Connect your MetaMask wallet to access the banking system</p>
            <button
              onClick={connectWallet}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center mx-auto border border-blue-500"
            >
              {isLoading ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : <Wallet className="w-5 h-5 mr-2" />}
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Account Header */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Connected Account</h3>
                  <p className="text-gray-400 font-mono text-sm">{account}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Bank Balance</p>
                  <p className="text-2xl font-bold text-white">{accountInfo.balanceWithInterest} ETH</p>
                  <p className="text-sm text-green-400">+{(parseFloat(accountInfo.balanceWithInterest) - parseFloat(accountInfo.balance)).toFixed(3)} interest</p>
                </div>
              </div>
              
              {!accountInfo.isActive && (
                <div className="mt-4">
                  <button
                    onClick={createAccount}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center border border-green-500"
                  >
                    {isLoading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Users className="w-4 h-4 mr-2" />}
                    Create Account
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-2 shadow-xl">
              <div className="flex space-x-2">
                {[
                  { id: 'account', label: 'Account', icon: Eye },
                  { id: 'transactions', label: 'Transactions', icon: Send },
                  { id: 'loans', label: 'Loans', icon: CreditCard },
                  { id: 'bank', label: 'Bank Info', icon: Settings }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl transition-all duration-300 ${
                      activeTab === id 
                        ? 'bg-gray-700 text-white border border-gray-600' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'account' && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Account Statistics */}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Eye className="w-6 h-6 mr-2" />
                    Account Overview
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Balance:</span>
                      <span className="text-white font-semibold">{accountInfo.balance} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">With Interest:</span>
                      <span className="text-green-400 font-semibold">{accountInfo.balanceWithInterest} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Deposits:</span>
                      <span className="text-white">{accountInfo.depositCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Withdrawals:</span>
                      <span className="text-white">{accountInfo.withdrawalCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`font-semibold ${accountInfo.isActive ? 'text-green-400' : 'text-red-400'}`}>
                        {accountInfo.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interest Section */}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
                    Interest Earnings
                  </h3>
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-green-400 mb-2">
                      +{(parseFloat(accountInfo.balanceWithInterest) - parseFloat(accountInfo.balance)).toFixed(6)} ETH
                    </p>
                    <p className="text-gray-500">Accrued Interest</p>
                  </div>
                  <button
                    onClick={claimInterest}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center border border-green-500"
                  >
                    {isLoading ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : <TrendingUp className="w-5 h-5 mr-2" />}
                    Claim Interest
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Deposit */}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Download className="w-6 h-6 mr-2 text-green-400" />
                    Deposit
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Amount (ETH)</label>
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder={`Min: ${bankInfo.minimumDeposit}`}
                        step="0.001"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Minimum deposit: {bankInfo.minimumDeposit} ETH<br/>
                      Interest rate: {bankInfo.interestRate}% annual
                    </p>
                    <button
                      onClick={handleDeposit}
                      disabled={isLoading || !depositAmount || !accountInfo.isActive}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center border border-green-500"
                    >
                      {isLoading ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : <Download className="w-5 h-5 mr-2" />}
                      {isLoading ? 'Processing...' : 'Deposit'}
                    </button>
                  </div>
                </div>

                {/* Withdraw */}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Send className="w-6 h-6 mr-2 text-red-400" />
                    Withdraw
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Amount (ETH)</label>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.0"
                        step="0.001"
                        max={accountInfo.balanceWithInterest}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Available: {accountInfo.balanceWithInterest} ETH
                    </p>
                    <button
                      onClick={handleWithdraw}
                      disabled={isLoading || !withdrawAmount || !accountInfo.isActive}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center border border-red-500"
                    >
                      {isLoading ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                      {isLoading ? 'Processing...' : 'Withdraw'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'loans' && (
              <div className="space-y-6">
                {/* Current Loan Status */}
                {loanInfo.isActive && (
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <CreditCard className="w-6 h-6 mr-2 text-yellow-400" />
                      Active Loan
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Loan Amount:</span>
                          <span className="text-white font-semibold">{loanInfo.amount} ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Interest Rate:</span>
                          <span className="text-white">{loanInfo.interestRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Repayment Amount:</span>
                          <span className="text-red-400 font-semibold">{loanInfo.repaymentAmount} ETH</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <input
                          type="number"
                          value={repayAmount}
                          onChange={(e) => setRepayAmount(e.target.value)}
                          placeholder={loanInfo.repaymentAmount}
                          step="0.001"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        />
                        <button
                          onClick={repayLoan}
                          disabled={isLoading || !repayAmount}
                          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center border border-yellow-500"
                        >
                          {isLoading ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : <CreditCard className="w-5 h-5 mr-2" />}
                          Repay Loan
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Apply for New Loan */}
                {!loanInfo.isActive && (
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <CreditCard className="w-6 h-6 mr-2 text-blue-400" />
                      Apply for Loan
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Loan Amount (ETH)</label>
                          <input
                            type="number"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(e.target.value)}
                            placeholder="0.0"
                            step="0.001"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Duration (Days)</label>
                          <input
                            type="number"
                            value={loanDuration}
                            onChange={(e) => setLoanDuration(e.target.value)}
                            placeholder="30"
                            min="1"
                            max="365"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="text-sm text-gray-400 space-y-2">
                          <p>• Loan interest rate: {parseFloat(bankInfo.interestRate) + 3}%</p>
                          <p>• Requires 10% collateral in deposits</p>
                          <p>• Maximum duration: 365 days</p>
                          <p>• Your deposit balance: {accountInfo.balance} ETH</p>
                        </div>
                        <button
                          onClick={applyForLoan}
                          disabled={isLoading || !loanAmount || !loanDuration || !accountInfo.isActive}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center border border-blue-500"
                        >
                          {isLoading ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : <CreditCard className="w-5 h-5 mr-2" />}
                          Apply for Loan
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bank' && (
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Settings className="w-6 h-6 mr-2" />
                  Bank Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bank Reserve:</span>
                      <span className="text-white font-semibold">{bankInfo.bankReserve} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Interest Rate:</span>
                      <span className="text-green-400">{bankInfo.interestRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Loan Rate:</span>
                      <span className="text-yellow-400">{parseFloat(bankInfo.interestRate) + 3}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Minimum Deposit:</span>
                      <span className="text-white">{bankInfo.minimumDeposit} ETH</span>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contract Address:</span>
                      <span className="text-gray-400 font-mono text-xs">{CONTRACT_ADDRESS}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Network:</span>
                      <span className="text-gray-400">Ethereum</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Version:</span>
                      <span className="text-gray-400">1.0.0</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoBankingSystem;