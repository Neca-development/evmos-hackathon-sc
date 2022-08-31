// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import '@openzeppelin/contracts/utils/Strings.sol';
import "hardhat/console.sol";

interface ISignerVerification {
	/**
	 * @dev Returns bool value if message is verified by right signer.
	 */
	function isMessageVerified(address signer, bytes calldata signature,string calldata concatenatedParams) external pure returns (bool);
    
    /**
	 * @dev Returns address of signer;
	 */
    function getSigner(bytes calldata signature, string calldata concatenatedParams) external pure returns (address);

}


contract DaoEvmos is ERC721{



   enum RarityNFT {
    UNRARITY,
    LOW,
    MEDIUM,
    HIGH
   }
  
  enum VoteType {
    ABSTAINED,
    POSITIVE,
    NEGATIVE
  }

   enum VotingStatus {
    PREPARATION,
    PROCESSING,
    EXECUTED
   }
    
    struct VoteInfo {
      uint256 positiveVote; 
      uint256 negativeVote;
    }

    struct Vote{
        string voteLink;
        uint votingStart;
        uint votingEnd;
        address ownerVoting;
        VotingStatus status; 
    }

    string tokenBaseURI;

    uint256 currentVoteId;
    uint256 currentTokenId;

    address private signer;
    ISignerVerification signerVerification;

    mapping(address => mapping(uint256 => bool)) public hasVote;
    mapping(address => mapping(uint256 => VoteType)) public voteTypes; 
    mapping(uint256 => Vote) public votes;
    mapping(uint256 => VoteInfo) public votesInfo;
    mapping(address => uint256) public tokenForOwner; 
    mapping(uint256 => RarityNFT) public rarityForNft;
    

    constructor(
      string memory name,
      string memory symbol,
      address _signer,
      address _signerVerification,
      string memory _tokenBaseURI
    ) ERC721(name, symbol){
        signer = _signer;
        signerVerification = ISignerVerification(_signerVerification);
        tokenBaseURI = _tokenBaseURI;
    } 

    function mintNft(RarityNFT _tokenRarity, bytes memory signature) external {
      require(signerVerification.isMessageVerified(signer, signature, _concatParams(msg.sender, _tokenRarity)), 'Incorrect rarity');
      require(balanceOf(msg.sender) == 0, "Token already minted");

      _mint(msg.sender, currentTokenId);

      rarityForNft[currentTokenId] = _tokenRarity;
      
      emit Minted(msg.sender, address(this), currentTokenId, _tokenRarity);

      currentTokenId++;
      
    }

    function createVoting(string memory _voteLink) public {
      
      require(votes[currentVoteId].votingStart == 0, "Vote already created");

      votes[currentVoteId] = Vote({
        voteLink: _voteLink,
        votingStart: block.timestamp,
        votingEnd: 0,
        ownerVoting: msg.sender,
        status: VotingStatus.PROCESSING
    });

      emit VoteCreated(currentVoteId, address(this), block.timestamp, _voteLink);

      currentVoteId++;
    }

    function vote(uint256 votingId, VoteType voteType) public {
      
      require(balanceOf(msg.sender) != 0, "You cant't participate in this DAO");
      require(votes[votingId].status == VotingStatus.PROCESSING, "Voting already ended or not started yet");
      require(!hasVote[msg.sender][votingId], "You already vote");
      require(voteType != VoteType.ABSTAINED, "If you want abstain, just don't vote");
      
      VoteInfo storage voteInfo = votesInfo[votingId];
      
      if(voteType == VoteType.POSITIVE){
        voteInfo.positiveVote += uint256(rarityForNft[tokenForOwner[msg.sender]]);

      }else if(voteType == VoteType.NEGATIVE){
          voteInfo.negativeVote += uint256(rarityForNft[tokenForOwner[msg.sender]]);
      }
    
      hasVote[msg.sender][votingId] = true;
      voteTypes[msg.sender][votingId] = voteType;

      emit Voted(msg.sender, address(this), votingId, uint256(rarityForNft[tokenForOwner[msg.sender]]), voteType);

    }

    function closeVoting(uint256 votingId) public {
      require(votes[votingId].ownerVoting == msg.sender, "You can't complete a vote that isn't yours");
      require(votes[votingId].votingStart != 0, "Such a vote does not exist.");
      
      votes[votingId].votingEnd = block.timestamp;
      votes[votingId].status = VotingStatus.EXECUTED;

      emit VoteClosed(votingId, address(this), block.timestamp);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), 'ERC721Metadata: URI query for nonexistent token');
        
        return string(abi.encodePacked(tokenBaseURI, "/", Strings.toString(uint256(rarityForNft[tokenId]))));
	}

    function _concatParams(
    address _sender,
		RarityNFT _tokenRarity
		
	) internal view returns (string memory) {
		return
			string(
				abi.encodePacked(
          _addressToString(address(this)),
          _addressToString(_sender),
					Strings.toString(uint256(_tokenRarity))
					
				)
			);
	}

	function _addressToString(address _addr) internal pure returns (string memory) {
		bytes memory addressBytes = abi.encodePacked(_addr);

		bytes memory stringBytes = new bytes(42);

		stringBytes[0] = '0';
		stringBytes[1] = 'x';

		for (uint256 i = 0; i < 20; i++) {
			uint8 leftValue = uint8(addressBytes[i]) / 16;
			uint8 rightValue = uint8(addressBytes[i]) - 16 * leftValue;

			bytes1 leftChar = leftValue < 10 ? bytes1(leftValue + 48) : bytes1(leftValue + 87);
			bytes1 rightChar = rightValue < 10 ? bytes1(rightValue + 48) : bytes1(rightValue + 87);

			stringBytes[2 * i + 3] = rightChar;
			stringBytes[2 * i + 2] = leftChar;
		}

		return string(stringBytes);
	}

  function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override{

        if(to != address(0)){
          require(rarityForNft[tokenId] != RarityNFT.HIGH, "You can't transfer this token");
        }

    }

  event VoteCreated(uint256 votingId, address dao, uint256 startTimestamp, string voteLink);
  event VoteClosed(uint256 votingId, address dao, uint256 closeTimestamp);
  event Voted(address user, address dao, uint256 votingId, uint256 voteCount, VoteType voteType);
  event Minted(address user, address dao, uint256 tokenId, RarityNFT rarityNft);
}
