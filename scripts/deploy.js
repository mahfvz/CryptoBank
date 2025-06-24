const hre = require("hardhat");

async function main() {
    const CryptoBank = await hre.ethers.deployContract("CryptoBank");

    await CryptoBank.waitForDeployment();

    console.log(`Contract deployed to ${await CryptoBank.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

//0x5095d3313C76E8d29163e40a0223A5816a8037D8