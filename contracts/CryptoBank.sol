// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CryptoBank {
    // Owner of the wallet
    address public owner;
    
    // Events for logging transactions
    event Deposit(address indexed from, uint256 amount);
    event Withdrawal(address indexed to, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // Modifier to restrict access to owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the wallet owner");
        _;
    }
    
    // Constructor sets the deployer as the owner
    constructor() {
        owner = msg.sender;
    }
    
    // Function to deposit Ether into the wallet
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        emit Deposit(msg.sender, msg.value);
    }
    
    // Function to withdraw Ether from the wallet (owner only)
    function withdraw(uint256 amount) public onlyOwner {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(address(this).balance >= amount, "Insufficient balance");
        
        payable(owner).transfer(amount);
        emit Withdrawal(owner, amount);
    }
    
    // Function to withdraw all Ether from the wallet (owner only)
    function withdrawAll() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(owner).transfer(balance);
        emit Withdrawal(owner, balance);
    }
    
    // Function to check wallet balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    // Function to transfer ownership of the wallet
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        require(newOwner != owner, "New owner must be different from current owner");
        
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }
    
    // Function to allow the contract to receive Ether directly
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
    
    // Fallback function
    fallback() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}