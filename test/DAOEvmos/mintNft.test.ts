import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { deployFixture } from "./_setup.test";
import { expect } from "chai"
import { createDAO } from "./_utils";

export const mintNFT =  function (): void {
  /*-------------------------------------------------------------Positive tests-----------------------------------------------------------*/
  it("NFT should be MINTED", async function(){
    const { daoFactory, owner, otherAccount } = await loadFixture(deployFixture);

    const dao = await createDAO(daoFactory)
    
    const signature = await owner.signMessage(dao.address.toLowerCase()+otherAccount.address.toLowerCase()+"2" )

    await dao.connect(otherAccount).mintNft(2, signature)

    expect(await dao.ownerOf(0)).to.be.equal(otherAccount.address)
    expect(await dao.balanceOf(otherAccount.address)).to.be.equal(1)
    expect(await dao.rarityForNft(0)).to.be.equal(2)

  })

  
  it("should be EMIT event when nft was minted", async function(){
    const { daoFactory, owner, otherAccount } = await loadFixture(deployFixture);

    const dao = await createDAO(daoFactory)
    
    const signature = await owner.signMessage(dao.address.toLowerCase()+otherAccount.address.toLowerCase()+"2" )

    await expect(dao.connect(otherAccount).mintNft(2, signature)).to.be.emit(dao, "Minted").withArgs(otherAccount.address, dao.address, 0, 2)
    
  })
/*-------------------------------------------------------------Negative tests-----------------------------------------------------------*/
  it("should revert if signature incorrect", async function(){
    const { daoFactory, owner, otherAccount } = await loadFixture(deployFixture);

    const dao = await createDAO(daoFactory)
    
    const signature = await owner.signMessage(dao.address.toLowerCase()+otherAccount.address.toLowerCase()+"1" )

    await expect(dao.connect(otherAccount).mintNft(2, signature)).to.be.revertedWith("Incorrect rarity")
    
  })

  it("should revert if user already have nft", async function(){
    const { daoFactory, owner, otherAccount } = await loadFixture(deployFixture);

    const dao = await createDAO(daoFactory)
    
    const signature = await owner.signMessage(dao.address.toLowerCase()+otherAccount.address.toLowerCase()+"1" )
    await dao.connect(otherAccount).mintNft(1, signature)

    await expect(dao.connect(otherAccount).mintNft(1, signature)).to.be.revertedWith("Token already minted")
    
  })
}