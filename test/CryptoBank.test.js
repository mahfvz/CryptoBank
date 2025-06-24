const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CryptoBank", function () {
  let CryptoBank, cryptoBank, owner, addr1;
  const { parseEther, ZeroAddress } = ethers;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    CryptoBank = await ethers.getContractFactory("CryptoBank");
    cryptoBank = await CryptoBank.deploy(); // No .deployed() in Ethers v6
  });

  it("Should set the right owner", async function () {
    expect(await cryptoBank.owner()).to.equal(owner.address);
  });

  it("Should accept deposits", async function () {
    const depositAmount = parseEther("1");

    await expect(() =>
      addr1.sendTransaction({
        to: cryptoBank.address,
        value: depositAmount,
        data: "0x" // force receive() or fallback() call
      })
    ).to.changeEtherBalances(
      [addr1, cryptoBank],
      [-depositAmount, depositAmount]
    );

    expect(await cryptoBank.getBalance()).to.equal(depositAmount);
  });

  it("Should emit Deposit event on deposit", async function () {
    const depositAmount = parseEther("0.5");

    await expect(
      addr1.sendTransaction({
        to: cryptoBank.address,
        value: depositAmount,
        data: "0x"
      })
    )
      .to.emit(cryptoBank, "Deposit")
      .withArgs(addr1.address, depositAmount);
  });

  it("Should allow owner to withdraw funds", async function () {
    const depositAmount = parseEther("1");
    const withdrawAmount = parseEther("0.4");

    await owner.sendTransaction({
      to: cryptoBank.address,
      value: depositAmount,
      data: "0x"
    });

    await expect(() =>
      cryptoBank.withdraw(withdrawAmount)
    ).to.changeEtherBalances([cryptoBank, owner], [-withdrawAmount, withdrawAmount]);
  });

  it("Should not allow non-owner to withdraw", async function () {
    await expect(
      cryptoBank.connect(addr1).withdraw(parseEther("0.1"))
    ).to.be.revertedWith("Not the wallet owner");
  });

  it("Should allow owner to withdraw all", async function () {
    const depositAmount = parseEther("0.6");

    await owner.sendTransaction({
      to: cryptoBank.address,
      value: depositAmount,
      data: "0x"
    });

    await expect(() =>
      cryptoBank.withdrawAll()
    ).to.changeEtherBalances(
      [cryptoBank, owner],
      [-depositAmount, depositAmount]
    );
  });

  it("Should allow ownership transfer", async function () {
    await cryptoBank.transferOwnership(addr1.address);
    expect(await cryptoBank.owner()).to.equal(addr1.address);
  });

  it("Should not allow ownership transfer to zero address", async function () {
    await expect(
      cryptoBank.transferOwnership(ZeroAddress)
    ).to.be.revertedWith("New owner cannot be zero address");
  });

  it("Should reject zero withdrawals", async function () {
    await expect(cryptoBank.withdraw(0)).to.be.revertedWith(
      "Withdrawal amount must be greater than 0"
    );
  });

  it("Should reject deposits of 0 ether", async function () {
    await expect(
      cryptoBank.deposit({ value: 0 })
    ).to.be.revertedWith("Deposit amount must be greater than 0");
  });
});
