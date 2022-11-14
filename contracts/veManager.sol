// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;


import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/access/Ownable.sol";


/*
** 
** Simple contract to help manage veVelo restricting transfers
** 
** By Alex with <3.
*/


contract veManager is Ownable {

	struct CallsData{
		address[] targets;
		bytes[] calls;
	}

	mapping(bytes4 => bool) public isBlacklistedFunction;

	address public EmergencyTo;
	address public VeloBros;
	address public VotedEscrow;
	address public Velo;


	uint256 public lastTimeSet;
	uint256 public lastVeloCollection;

	bool public VeloApproved;

	CallsData[] SavedCalls;

	//Emergency withdrawal in case of emergencies or upgrade.
	function EmergencyWithdraw(uint256[] memory _ids) public onlyOwner {
		require(VeloApproved, "Needs approval.");
		require(EmergencyTo != address(0), "Cant be 0 address");
		for(uint256 i = 0; i < _ids.length; i++){
			IERC721(VotedEscrow).transferFrom(address(this), EmergencyTo, _ids[i]);
		}
	}


	function toggleEmergencyWithdrawal() public {
		require(msg.sender == VeloBros, "Only Velo.");
		VeloApproved = !VeloApproved;
	}


	//Allows Velo to set emergency withdraw to address once a week which prevents last second injection. 
	function setEmergencyTo(address _to) public {
		require(msg.sender == VeloBros, "Only Velo.");
		require(lastTimeSet+ 1 weeks < block.timestamp, "Time not elapsed.");
		lastTimeSet = block.timestamp;
		EmergencyTo = _to;
	}

	function savedCallsLength() public view returns (uint256){
		return SavedCalls.length;
	}

	//add transfer ***
	//add drain function ***
	//add velo token condition ***
	//add saved call function***
	//add delete saved call function

	constructor(address _velo, address _veEscrow, address _VeloBros){ 
		Velo = _velo;
		VotedEscrow = _veEscrow;
		VeloBros = _VeloBros;
		IERC20(Velo).approve(_veEscrow, 2**256 - 1); //approve nft for deposits of velo 
		isBlacklistedFunction[0xa9059cbb] = true; //transfer(address _to, uint256 _value)
		isBlacklistedFunction[0x42842e0e] = true; //safeTransferFrom(address _from, address _to, uint256 _tokenId)
		isBlacklistedFunction[0xb88d4fde] = true; //safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes _data)
		isBlacklistedFunction[0x23b872dd] = true; //transferFrom(address _from, address _to, uint256 _tokenId)
		isBlacklistedFunction[0xe985e9c5] = true; //isApprovedForAll(address _owner, address _operator) view returns (bool)
		isBlacklistedFunction[0x095ea7b3] = true; //approve(address _approved, uint256 _tokenId)
		isBlacklistedFunction[0xa22cb465] = true; //setApprovalForAll(address _operator, bool _approved)
		isBlacklistedFunction[0xd4e54c3b] = true; //function create_lock_for(uint _value, uint _lock_duration, address _to) external nonreentrant returns (uint)
	}

	//Function that executes an array of calls. will revert if one of the call fails or if the specific fuction call is banned.
	function execute(address[] memory targets, bytes[] memory calls, bool saveCall) public onlyOwner{
		for(uint256 i = 0; i < targets.length; i++) {
			require(isAllowedFunctionCall(calls[i]), "Not Allowed");
            (bool success,) = targets[i].call(calls[i]);
            require(success, "Call failed");
        }

        if(saveCall){
			CallsData memory newCall;
			newCall.targets = targets;
			newCall.calls = calls;
			SavedCalls.push(newCall);
        }	
	}


	function executeSaved(uint256 id) public onlyOwner {
		bytes[] memory calls = SavedCalls[id].calls;
		address[] memory targets = SavedCalls[id].targets;
		for(uint256 i = 0; i < targets.length; i++) {
			require(isAllowedFunctionCall(calls[i]), "Not Allowed");
            (bool success,) = targets[i].call(calls[i]);
            require(success, "Call failed");
        }
	}

	function getSavedCall(uint256 id) public view returns(address[] memory, bytes[] memory){
		return (SavedCalls[id].targets, SavedCalls[id].calls);
	}


	//Drain any rewards to Multisig
	function drain(address[] memory tokens) public onlyOwner{
		for(uint256 i = 0; i < tokens.length; i++) {
			require(tokens[i] != VotedEscrow, "You fucked up mate");
			if(tokens[i] == address(0)){ //ETH
				uint256 bal = address(this).balance;
				_safeTransferETH(owner(), bal);
				i++;
			}
			if(tokens[i] != Velo){
				uint256 bal = IERC20(tokens[i]).balanceOf(address(this));
				IERC20(tokens[i]).transfer(owner(), bal);
			}else{
				_handleVeloTransfer();
			}
		}
	}

	//this function sends 50% of velo balance to owner if called from drain. but will only execute once a week.
	function _handleVeloTransfer() internal {
		if(lastVeloCollection + 1 weeks < block.timestamp){
			lastVeloCollection = block.timestamp;
			uint256 bal = IERC20(Velo).balanceOf(address(this));
			IERC20(Velo).transfer(owner(), bal/2);
		}else{
			return; //Do nothing
		}
	}


	//Function that checks if the function signature is an allowed call.
	function isAllowedFunctionCall(bytes memory call) public view returns(bool){
		bytes4 selector = getFunctionSig(call);
		if(isBlacklistedFunction[selector]){
			return false;
		}else{
			return true;
		}
	}
	// Assembly that loads the first 4 bytes of the calldata to get the function signature. 
	function getFunctionSig(bytes memory data) public pure returns(bytes4){
		bytes4 selector;
	    assembly {
	      	selector := mload(add(data, 32))

	    }
	    return selector;
	}

	//SafeTransferETH
	function _safeTransferETH(address to, uint _value) internal {
        (bool success,) = to.call{value:_value}(new bytes(0));
        require(success, 'ETH_TRANSFER_FAILED');
    }
	

	//IERC721Holder
   function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}