import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { deployFixture } from "./_setup.test";
import { expect } from "chai"
import { createDAO } from "./_utils";

export const createVoting =  function (): void {
  /*-------------------------------------------------------------Positive tests-----------------------------------------------------------*/
  it("Voting should be CREATED", async function(){
    const { daoFactory, owner, otherAccount } = await loadFixture(deployFixture);

    const dao = await createDAO(daoFactory)
    
    // const signature = await owner.signMessage(dao.address.toLowerCase()+otherAccount.address.toLowerCase()+"2" )

    // await dao.connect(otherAccount).mintNft(2, signature)

    await dao.createVoting()

    expect((await dao.votes(0)).ownerVoting).to.be.equal(owner.address)
  })

  
  it("should be EMIT event when voting was created", async function(){
    const { daoFactory, owner, otherAccount } = await loadFixture(deployFixture);

    const dao = await createDAO(daoFactory)
    
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;

    await dao.createVoting()


    await expect(dao.createVoting()).to.be.emit(dao, "VoteCreated").withArgs(1, dao.address, timestampBefore+2)
    
  })
/*-------------------------------------------------------------Negative tests-----------------------------------------------------------*/
  
}