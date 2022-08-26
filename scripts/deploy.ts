import { ethers } from "hardhat";

async function main() {

  const SignerVerification = await ethers.getContractFactory('SignerVerification')
  const signerVer = await SignerVerification.deploy()
  await signerVer.deployed()

  console.log("SignerVer", signerVer.address);
  

  const DAOFactory = await ethers.getContractFactory("DaoEvmosFactory");
  const daoFactory = await DAOFactory.deploy("0xce26cE7b50c23268e7a45988c70086a86ddA1f37", signerVer.address);

  await daoFactory.deployed();

  console.log("DAOFactory", daoFactory.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
