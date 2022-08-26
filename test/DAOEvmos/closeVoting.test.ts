import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployFixture } from "./_setup.test";
import { createDAO } from "./_utils";

export const closeVoting =  function (): void {
  /*-------------------------------------------------------------Positive tests-----------------------------------------------------------*/
  it("should be VOATED if user have HIGH nft", async function(){
    const { daoFactory, owner, otherAccount } = await loadFixture(deployFixture);

    const dao = await createDAO(daoFactory)
    
    const signature = await owner.signMessage(dao.address.toLowerCase()+otherAccount.address.toLowerCase()+"2" )

    await dao.connect(otherAccount).mintNft(2, signature)
 
    await dao.createVoting()

    await dao.connect(otherAccount).vote(0, 1)
    
    await dao.closeVoting(0)
    

    
    expect((await dao.votes(0)).status).to.be.equal(2)
    
  })

  
  it("should be EMIT event when user voted", async function(){
    const { daoFactory, owner, otherAccount } = await loadFixture(deployFixture);

    const dao = await createDAO(daoFactory)
    
    const signature = await owner.signMessage(dao.address.toLowerCase()+otherAccount.address.toLowerCase()+"2" )

    await dao.connect(otherAccount).mintNft(2, signature)
 
    await dao.createVoting()


    await expect(dao.connect(otherAccount).vote(0, 2)).to.be.emit(dao, "Voted").withArgs(otherAccount.address, dao.address, 0, 2, 2)
    
  })
/*-------------------------------------------------------------Negative tests-----------------------------------------------------------*/
it("should be reverted if user dont have nft", async function(){
  const { daoFactory, owner, otherAccount } = await loadFixture(deployFixture);

  const dao = await createDAO(daoFactory)
  

  await dao.createVoting() 
  
  await expect(dao.connect(otherAccount).vote(0, 1)).to.be.revertedWith("You cant't participate in this DAO")
  
})

it("should be reverted if VOTING DONT EXIST", async function(){
  const { daoFactory, owner, otherAccount } = await loadFixture(deployFixture);

  const dao = await createDAO(daoFactory)
  
  const signature = await owner.signMessage(dao.address.toLowerCase()+otherAccount.address.toLowerCase()+"2" )

  await dao.connect(otherAccount).mintNft(2, signature)
  
  await expect(dao.connect(otherAccount).vote(0, 1)).to.be.revertedWith("Voting already ended or not started yet")
})

it("should be reverted if USER ALREADY VOTED", async function(){
  const { daoFactory, owner, otherAccount } = await loadFixture(deployFixture);

  const dao = await createDAO(daoFactory)
  
  const signature = await owner.signMessage(dao.address.toLowerCase()+otherAccount.address.toLowerCase()+"2" )

  await dao.connect(otherAccount).mintNft(2, signature)

  await dao.createVoting()

  await dao.connect(otherAccount).vote(0, 1)
  
  
  
  await expect(dao.connect(otherAccount).vote(0, 1)).to.be.revertedWith("You already vote")
  
})

it("should be reverted if USER WANT TO ABSTAIN", async function(){
  const { daoFactory, owner, otherAccount } = await loadFixture(deployFixture);

  const dao = await createDAO(daoFactory)
  
  const signature = await owner.signMessage(dao.address.toLowerCase()+otherAccount.address.toLowerCase()+"2" )

  await dao.connect(otherAccount).mintNft(2, signature)

  await dao.createVoting()

  console.log(await dao.tokenURI(0));
  
  
  await expect(dao.connect(otherAccount).vote(0, 0)).to.be.revertedWith("If you want abstain, just don't vote")
  
})

}