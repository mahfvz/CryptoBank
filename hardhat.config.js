require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: process.env.LOCALHOST_8545_HTTP,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
