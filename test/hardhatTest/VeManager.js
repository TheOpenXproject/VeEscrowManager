const { expect } = require("chai");
const { ethers } = require("hardhat");
const {VeManagerSDK} = require("../../VeManagerSDK")

const startTime = parseFloat((new Date().getTime()/1000).toFixed(0))

//here setup script


/*VeManager also own velo for demonstration and simplicity sake
*/
describe("VeManager tests", function () {
	before(async function () {
	this.signers = await ethers.getSigners()
    this.alice = this.signers[0]
    this.VeloBros = this.signers[1]
    this.MigratorContract = this.signers[2]

    var [
	    Velo,
	    GaugeFactory,
	    BribeFactory,
	    PairFactory,
	    Router,
	    Library,
	    VeArtProxy,
	    VotingEscrow,
	    RewardsDistributor,
	    Voter,
	    Minter,
	    VeloGovernor,
	    VeManager
	  ] = await Promise.all([
	    ethers.getContractFactory("Velo"),
	    ethers.getContractFactory("GaugeFactory"),
	    ethers.getContractFactory("BribeFactory"),
	    ethers.getContractFactory("PairFactory"),
	    ethers.getContractFactory("Router"),
	    ethers.getContractFactory("VelodromeLibrary"),
	    ethers.getContractFactory("VeArtProxy"),
	    ethers.getContractFactory("VotingEscrow"),
	    ethers.getContractFactory("RewardsDistributor"),
	    ethers.getContractFactory("Voter"),
	    ethers.getContractFactory("Minter"),
	    ethers.getContractFactory("VeloGovernor"),
	    ethers.getContractFactory("veManager")
	  ]);

	this.Velo = await Velo.deploy();
    await this.Velo.deployed()

    //console.log("Velo " + this.Velo.address);

    this.VeArtProxy = await VeArtProxy.deploy();
    await this.VeArtProxy.deployed()

    //console.log("VeArtProxy " + this.VeArtProxy.address);

    this.VotingEscrow = await VotingEscrow.deploy(this.Velo.address, this.VeArtProxy.address);
    await this.VotingEscrow.deployed()

    //console.log("VotingEscrow " + this.VotingEscrow.address);





    this.VeManager = await VeManager.deploy(this.Velo.address, this.VotingEscrow.address, this.signers[1].address);
    await this.VeManager.deployed()


    await this.Velo.setMinter(this.VeManager.address);


    //this is needed to init sdk (can work with any contract loaded through ethers) 
    // address => contractInstance
 	const addressesMapping = {
		[this.Velo.address]: Velo,
		[this.VotingEscrow.address]: VotingEscrow,
		[this.VeManager.address]: VeManager
	}

    this.SDK = new VeManagerSDK(addressesMapping, this.VeManager.address)


    ///Calls/targets/arguments
    var Targets = [this.Velo.address, this.Velo.address]
    var FunctionCalls = [
    "function initialMint(address _recipient)",
    "function setRedemptionReceiver(address _receiver)",
    ]
    var Arguements = [
    	[this.VeManager.address],
    	[this.signers[1].address]
    ]
    //into sdk go brrrrr (im tired rn)
    const encodedCalls = this.SDK.encodeBatchedTx(Targets, FunctionCalls, Arguements)
    //console.log(encodedCalls)

    //execute array of calls(bytes[]) to Targets(address[])
	await this.VeManager.execute(Targets, encodedCalls, false)
	//is meant to drain any tokens(exception with velo which allows for a 50% withdrawal once a week for pegg)
    await this.VeManager.drain([this.Velo.address])

	await this.Velo.approve(this.VotingEscrow.address, ethers.utils.parseUnits("3000000"))
	//create locks for the veManager
    await this.VotingEscrow.create_lock_for(ethers.utils.parseUnits("1500000"), 4 * 365 * 86400, this.VeManager.address)
    await this.VotingEscrow.create_lock_for(ethers.utils.parseUnits("1500000"), 4 * 365 * 86400, this.VeManager.address)



	});

	//Tests
	it("NFT bal of veManager should not be 0", async function () {
		var nftBal = await this.VotingEscrow.balanceOf(this.VeManager.address)
    	expect(nftBal.toNumber()).to.not.be.equal(0);
    	expect(nftBal.toNumber()).to.be.equal(2);
  	});

  	it("balance of NFT 1 should not be 0", async function () {
		var nftBal = await this.VotingEscrow.balanceOfNFT(1)
    	expect(nftBal.toString()).to.not.be.equal("0");
  	});

  	it("balance of NFT 2 should not be 0", async function () {
		var nftBal = await this.VotingEscrow.balanceOfNFT(2)
    	expect(nftBal.toString()).to.not.be.equal("0");
  	});
  	//Doesnt exist so 0
  	it("balance of NFT 3 should be 0", async function () {
		var nftBal = await this.VotingEscrow.balanceOfNFT(3)
    	expect(nftBal.toString()).to.be.equal("0");
  	});

  it("create_lock_for should revert", async function () {
  	var Targets = [this.Velo.address]
    var FunctionCalls = [
    	"function create_lock_for(uint _value, uint _lock_duration, address _to) external returns (uint)"
    ]

    var Arguements = [
    	["10000000000", 55555555, this.VeManager.address]
   	]
    
    const encodedCalls = this.SDK.encodeBatchedTx(Targets, FunctionCalls, Arguements)
    await expect(this.VeManager.execute(Targets, encodedCalls, true)).to.be.revertedWith("Not Allowed");
  });


  it("transfer should revert", async function () {
  	var Targets = [this.Velo.address]
    var FunctionCalls = [
    	"function transfer(address _to, uint256 _value)"
    ]

    var Arguements = [
    	[this.VeManager.address, "55555555"]
   	]
    
    const encodedCalls = this.SDK.encodeBatchedTx(Targets, FunctionCalls, Arguements)
    await expect(this.VeManager.execute(Targets, encodedCalls, true)).to.be.revertedWith("Not Allowed");
  });

it("setApprovalForAll should revert", async function () {
  	var Targets = [this.Velo.address]
    var FunctionCalls = [
    	"function setApprovalForAll(address _operator, bool _approved)"
    ]

    var Arguements = [
    	[this.alice.address, true]
   	]
    
    const encodedCalls = this.SDK.encodeBatchedTx(Targets, FunctionCalls, Arguements)
    await expect(this.VeManager.execute(Targets, encodedCalls, true)).to.be.revertedWith("Not Allowed");
  });
it("approve should revert", async function () {
  	var Targets = [this.Velo.address]
    var FunctionCalls = [
    	"function approve(address _approved, uint256 _tokenId)"
    ]

    var Arguements = [
    	[this.alice.address, 1]
   	]
    
    const encodedCalls = this.SDK.encodeBatchedTx(Targets, FunctionCalls, Arguements)
    await expect(this.VeManager.execute(Targets, encodedCalls, true)).to.be.revertedWith("Not Allowed");
  });

it("safeTransferFrom should revert", async function () {
  	var Targets = [this.Velo.address]
    var FunctionCalls = [
    	"function safeTransferFrom(address _from, address _to, uint256 _tokenId)"
    ]

    var Arguements = [
    	[this.VeManager.address, this.alice.address, 1]
   	]
    
    const encodedCalls = this.SDK.encodeBatchedTx(Targets, FunctionCalls, Arguements)
    await expect(this.VeManager.execute(Targets, encodedCalls, true)).to.be.revertedWith("Not Allowed");
  });

it("safeTransferFrom with bytes should revert", async function () {
  	var Targets = [this.Velo.address]
    var FunctionCalls = [
    	"function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes _data)"
    ]

    var Arguements = [
    	[this.VeManager.address, this.alice.address, 1, 0x00]
   	]
    
    const encodedCalls = this.SDK.encodeBatchedTx(Targets, FunctionCalls, Arguements)
    await expect(this.VeManager.execute(Targets, encodedCalls, true)).to.be.revertedWith("Not Allowed");
  });

 it("transferFrom should revert", async function () {
  	var Targets = [this.Velo.address]
    var FunctionCalls = [
    	"function transferFrom(address _from, address _to, uint256 _tokenId)"
    ]

    var Arguements = [
    	[this.VeManager.address, this.alice.address, 1]
   	]
    
    const encodedCalls = this.SDK.encodeBatchedTx(Targets, FunctionCalls, Arguements)
    await expect(this.VeManager.execute(Targets, encodedCalls, true)).to.be.revertedWith("Not Allowed");
  });

 it("deposits for NFT 1 and 2 simultaneously should be alright", async function () {
  	var Targets = [
  		this.VotingEscrow.address,
  		this.VotingEscrow.address
  	]

    var FunctionCalls = [
    	"function deposit_for(uint256 _tokenId, uint256 _value)",
    	"function deposit_for(uint256 _tokenId, uint256 _value)"
    ]

    var Arguements = [
    	[1, ethers.utils.parseUnits("150000")],
    	[2, ethers.utils.parseUnits("1500")]
   	]
    
    const encodedCalls = this.SDK.encodeBatchedTx(Targets, FunctionCalls, Arguements)

    //console.log(encodedCalls)
    await expect(this.VeManager.execute(Targets, encodedCalls, true)).to.not.be.revertedWith("Not Allowed");
    await expect(this.VeManager.execute(Targets, encodedCalls, true)).to.not.be.revertedWith("Call failed");
  });

 it("Emergency withdrawal should revert", async function () {
    await expect(this.VeManager.EmergencyWithdraw([1,2])).to.be.revertedWith("Needs approval.");
  });

 it("Emergency withdrawal should revert when allowed and address(0)", async function () {
 	await this.VeManager.connect(this.VeloBros).toggleEmergencyWithdrawal()
    await expect(this.VeManager.EmergencyWithdraw([1,2])).to.be.revertedWith("Cant be 0 address");
   	await this.VeManager.connect(this.VeloBros).toggleEmergencyWithdrawal() //disable for next tests
  });

 it("Emergency toggle should revert when Not Velo", async function () {
    await expect(this.VeManager.toggleEmergencyWithdrawal()).to.be.revertedWith("Only Velo.");
  });

 it("Emergency Withdraw to should work when everything set adn called by OPX Multisig", async function () {
 	await this.VeManager.connect(this.VeloBros).toggleEmergencyWithdrawal()
  	await this.VeManager.connect(this.VeloBros).setEmergencyTo(this.MigratorContract.address)
  	await this.VeManager.EmergencyWithdraw([1,2])
  	var nftBal = await this.VotingEscrow.balanceOf(this.MigratorContract.address)
    expect(nftBal.toNumber()).to.be.equal(2);

   	await this.VeManager.connect(this.VeloBros).toggleEmergencyWithdrawal() //disable for next tests

  });

 it("Setting migrator function twice in same week should fail", async function () {
  	await expect(this.VeManager.connect(this.VeloBros).setEmergencyTo(this.MigratorContract.address)).to.be.revertedWith("Time not elapsed.");
  });

 it("Setting migrator from OPX Multisig should fail", async function () {
  	await expect(this.VeManager.setEmergencyTo(this.MigratorContract.address)).to.be.revertedWith("Only Velo.");
  });

  it("Emergency Withdraw to should NOT work when everything set and called by Velo Multisig", async function () {
  	await expect(this.VeManager.connect(this.VeloBros).EmergencyWithdraw([1,2])).to.be.revertedWith("Ownable: caller is not the owner");
  });

   it("Calling saved calls for deposits on nft 1 and 2 should work", async function () {
	var nftBalBefore = await this.VotingEscrow.balanceOfNFT(1)
   	await expect(this.VeManager.executeSaved(0)).to.not.be.revertedWith("Not Allowed");
    await expect(this.VeManager.executeSaved(0)).to.not.be.revertedWith("Call failed");
    var nftBalAfter = await this.VotingEscrow.balanceOfNFT(1)
    expect(nftBalBefore.lt(nftBalAfter)).to.be.equal(true)

  });



});

