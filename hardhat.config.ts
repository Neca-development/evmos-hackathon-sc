import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.10",


  networks: {
    evmos: {
      url: "https://eth.bd.evmos.dev:8545",
      accounts: ["007255c435e073b94033b10bf89aeb56130566949e87c185b5810670cc7b7bd6"],
    },
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/AUPHVLbU_NY9KuMq4OsgSB8FDDMb-OFs',
      accounts: ["007255c435e073b94033b10bf89aeb56130566949e87c185b5810670cc7b7bd6"]
    }
  },
  etherscan: {
    customChains: [{
      network: "evmos",
      chainId: 9000,
      urls: {
        apiURL: "https://evm.evmos.dev/",
        browserURL: ""
      }
    }],
    apiKey: "c1d22a69-fd0e-4083-a152-d2c4e54072b2",
  },
  gasReporter: {
    enabled: true,
    // coinmarketcap: 'af8ddfb6-5886-41fe-80b5-19259a3a03be',
    currency: 'USD',
    
    gasPrice: 23,
  },
};

export default config;
