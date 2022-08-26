import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployFixture } from "./_setup.test";
import { createDAO } from "./_utils";

export const createDAOTest = function (): void {

  it("DAO should be CREATED", async function(){
    const { daoFactory, owner, otherAccount } = await loadFixture(deployFixture);

    const dao = await createDAO(daoFactory)
    
    
    expect(await dao.name()).to.be.equal("asdasd")
    expect(await dao.symbol()).to.be.equal("asda")
  })
}