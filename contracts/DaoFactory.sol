// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;


import "./DaoEvmos.sol";


contract DaoEvmosFactory {
  
  address signer;
  address signerVerification;

  constructor(address _signer,address _signerVerification){
    signer = _signer;
    signerVerification = _signerVerification;
  }


  function createDAO(
      string memory name,
      string memory symbol,
      string memory _tokenURI
    ) public{
      
      DaoEvmos dao = new DaoEvmos(name, symbol, signer, signerVerification, _tokenURI);

      emit DAOCreated(address(dao), msg.sender);
  }

  event DAOCreated(address dao, address creator);
   
}
