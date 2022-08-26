import { ethers } from "hardhat";
import { createDAOTest } from "./createDAO.test";
import { createVoting } from "./createVoting.test";
import { mintNFT } from "./mintNft.test";
import { voteTest } from "./vote.test";



export async function deployFixture() {
    
  // Contracts are deployed using the first signer/account by default
  const [owner, otherAccount] = await ethers.getSigners();
  
  const SignerVerification = await ethers.getContractFactory('SignerVerification')
  const signerVer = await SignerVerification.deploy()

  const DAOFactory = await ethers.getContractFactory("DaoEvmosFactory");
  const daoFactory = await DAOFactory.deploy(owner.address, signerVer.address);

  return { daoFactory, owner, otherAccount };
}

describe("DAOEvmos", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  

  describe("Create dao", createDAOTest)

  describe("Mint NFT", mintNFT)

  describe("Create voting", createVoting)

  describe("Vote", voteTest)
});
