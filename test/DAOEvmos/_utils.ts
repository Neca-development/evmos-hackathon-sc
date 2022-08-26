import { DaoEvmos, DaoEvmosFactory } from "../../typechain-types";

export async function createDAO(daoFactory: DaoEvmosFactory): Promise<DaoEvmos> {
  const dao = await daoFactory.createDAO("asdasd", "asda", 'asda')
  const receipt = await dao.wait()
  
  //@ts-ignore
  const daoCreated = await ethers.getContractAt("DaoEvmos", receipt?.events[0].args?.dao)
  return daoCreated
}