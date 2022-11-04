const hre = require("hardhat");

async function main() {

   
    const VotingEscrow = await ethers.getContractFactory("VotingEscrow");
    const VeloToken = await ethers.getContractFactory("Velo");

    const FormatTypes = ethers.utils.FormatTypes;
    
    console.log(VotingEscrow.interface.format(FormatTypes.full))

    console.log("---------------------------------------")

    /* succetiple to allow for transfers.
      'function safeTransferFrom(address _from, address _to, uint256 _tokenId) @49000000',
      'function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes _data) @49000000',
      'function transferFrom(address _from, address _to, uint256 _tokenId) @49000000',
      'function isApprovedForAll(address _owner, address _operator) view returns (bool) @49000000',
      'function approve(address _approved, uint256 _tokenId) @49000000',
      'function setApprovalForAll(address _operator, bool _approved) @49000000',
    */
    //
    console.log(VeloToken.interface.getSighash("transfer(address _to, uint256 _value)")); //encapsulates velo token as well as any erc20
    console.log(VotingEscrow.interface.getSighash("create_lock_for(uint _value, uint _lock_duration, address _to) returns (uint)")) //Avoids nft creation to someone else using bonded funds (bypass by creating externally and sending it to the manager instead)
    console.log(VotingEscrow.interface.getSighash("safeTransferFrom(address _from, address _to, uint256 _tokenId)")); //ecapsulates velo token + nft
    console.log(VotingEscrow.interface.getSighash("safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes _data)"));
    console.log(VotingEscrow.interface.getSighash("transferFrom(address _from, address _to, uint256 _tokenId)"));
    console.log(VotingEscrow.interface.getSighash("isApprovedForAll(address _owner, address _operator) view returns (bool)"));
    console.log(VotingEscrow.interface.getSighash("approve(address _approved, uint256 _tokenId)"));// velo + nft as well
    console.log(VotingEscrow.interface.getSighash("setApprovalForAll(address _operator, bool _approved)"));


    /*
      0xa9059cbb
      0xd4e54c3b
      0x42842e0e
      0xb88d4fde
      0x23b872dd
      0xe985e9c5
      0x095ea7b3
      0xa22cb465
    */

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*
[
  'constructor(address token_addr, address art_proxy)',
  'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
  'event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate)',
  'event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance)',
  'event Deposit(address indexed provider, uint256 tokenId, uint256 value, uint256 indexed locktime, uint8 deposit_type, uint256 ts)',
  'event Supply(uint256 prevSupply, uint256 supply)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event Withdraw(address indexed provider, uint256 tokenId, uint256 value, uint256 ts)',
  'function DELEGATION_TYPEHASH() view returns (bytes32) @49000000',
  'function DOMAIN_TYPEHASH() view returns (bytes32) @49000000',
  'function MAX_DELEGATES() view returns (uint256) @49000000',
  'function abstain(uint256 _tokenId) @49000000',
  'function approve(address _approved, uint256 _tokenId) @49000000',
  'function artProxy() view returns (address) @49000000',
  'function attach(uint256 _tokenId) @49000000',
  'function attachments(uint256) view returns (uint256) @49000000',
  'function balanceOf(address _owner) view returns (uint256) @49000000',
  'function balanceOfAtNFT(uint256 _tokenId, uint256 _block) view returns (uint256) @49000000',
  'function balanceOfNFT(uint256 _tokenId) view returns (uint256) @49000000',
  'function balanceOfNFTAt(uint256 _tokenId, uint256 _t) view returns (uint256) @49000000',
  'function block_number() view returns (uint256) @49000000',
  'function checkpoint() @49000000',
  'function checkpoints(address, uint32) view returns (uint256 timestamp) @49000000',
  'function create_lock(uint256 _value, uint256 _lock_duration) returns (uint256) @49000000',
  'function create_lock_for(uint256 _value, uint256 _lock_duration, address _to) returns (uint256) @49000000',
  'function decimals() view returns (uint8) @49000000',
  'function delegate(address delegatee) @49000000',
  'function delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) @49000000',
  'function delegates(address delegator) view returns (address) @49000000',
  'function deposit_for(uint256 _tokenId, uint256 _value) @49000000',
  'function detach(uint256 _tokenId) @49000000',
  'function epoch() view returns (uint256) @49000000',
  'function getApproved(uint256 _tokenId) view returns (address) @49000000',
  'function getPastTotalSupply(uint256 timestamp) view returns (uint256) @49000000',
  'function getPastVotes(address account, uint256 timestamp) view returns (uint256) @49000000',
  'function getPastVotesIndex(address account, uint256 timestamp) view returns (uint32) @49000000',
  'function getVotes(address account) view returns (uint256) @49000000',
  'function get_last_user_slope(uint256 _tokenId) view returns (int128) @49000000',
  'function increase_amount(uint256 _tokenId, uint256 _value) @49000000',
  'function increase_unlock_time(uint256 _tokenId, uint256 _lock_duration) @49000000',
  'function isApprovedForAll(address _owner, address _operator) view returns (bool) @49000000',
  'function isApprovedOrOwner(address _spender, uint256 _tokenId) view returns (bool) @49000000',
  'function locked(uint256) view returns (int128 amount, uint256 end) @49000000',
  'function locked__end(uint256 _tokenId) view returns (uint256) @49000000',
  'function merge(uint256 _from, uint256 _to) @49000000',
  'function name() view returns (string) @49000000',
  'function nonces(address) view returns (uint256) @49000000',
  'function numCheckpoints(address) view returns (uint32) @49000000',
  'function ownerOf(uint256 _tokenId) view returns (address) @49000000',
  'function ownership_change(uint256) view returns (uint256) @49000000',
  'function point_history(uint256) view returns (int128 bias, int128 slope, uint256 ts, uint256 blk) @49000000',
  'function safeTransferFrom(address _from, address _to, uint256 _tokenId) @49000000',
  'function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes _data) @49000000',
  'function setApprovalForAll(address _operator, bool _approved) @49000000',
  'function setArtProxy(address _proxy) @49000000',
  'function setTeam(address _team) @49000000',
  'function setVoter(address _voter) @49000000',
  'function slope_changes(uint256) view returns (int128) @49000000',
  'function supply() view returns (uint256) @49000000',
  'function supportsInterface(bytes4 _interfaceID) view returns (bool) @49000000',
  'function symbol() view returns (string) @49000000',
  'function team() view returns (address) @49000000',
  'function token() view returns (address) @49000000',
  'function tokenOfOwnerByIndex(address _owner, uint256 _tokenIndex) view returns (uint256) @49000000',
  'function tokenURI(uint256 _tokenId) view returns (string) @49000000',
  'function totalSupply() view returns (uint256) @49000000',
  'function totalSupplyAt(uint256 _block) view returns (uint256) @49000000',
  'function totalSupplyAtT(uint256 t) view returns (uint256) @49000000',
  'function transferFrom(address _from, address _to, uint256 _tokenId) @49000000',
  'function user_point_epoch(uint256) view returns (uint256) @49000000',
  'function user_point_history(uint256, uint256) view returns (int128 bias, int128 slope, uint256 ts, uint256 blk) @49000000',
  'function user_point_history__ts(uint256 _tokenId, uint256 _idx) view returns (uint256) @49000000',
  'function version() view returns (string) @49000000',
  'function voted(uint256) view returns (bool) @49000000',
  'function voter() view returns (address) @49000000',
  'function voting(uint256 _tokenId) @49000000',
  'function withdraw(uint256 _tokenId) @49000000'
]

*/
