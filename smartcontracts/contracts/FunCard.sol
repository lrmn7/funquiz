// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FunCard
 * @author L RMN
 */
contract FunCard is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    uint256 public mintFee;

    event CardMinted(uint256 indexed tokenId, address indexed owner, string tokenURI);

    constructor() ERC721("FunCard", "FUNCARD") Ownable(msg.sender) {
        mintFee = 0.001 ether;
    }

    function safeMint(address to, string memory uri) public payable {
        require(msg.value == mintFee, "FunCard: Insufficient mint fee.");
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit CardMinted(tokenId, to, uri);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function setMintFee(uint256 _newMintFee) public onlyOwner {
        mintFee = _newMintFee;
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed.");
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return super.tokenURI(tokenId);
    }
}