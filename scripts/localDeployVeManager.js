const hre = require("hardhat");
const {VeManagerSDK} = require("../VeManagerSDK")
async function main() {
	this.signers = await ethers.getSigners()

	//Mainnet
	/*
	const VeloAddr = "0x3c8B650257cFb5f272f799F5e2b4e65093a11a05"
	const VoterAddr = "0x09236cfF45047DBee6B921e00704bed6D6B8Cf7e"
	const VotingEscrowAddr = "0x9c7305eb78a432ced5C4D14Cac27E8Ed569A2e26"
	*/
	//local
	/*
		Velo 0x5FbDB2315678afecb367f032d93F642f64180aa3
		VeArtProxy 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
		VotingEscrow 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
	*/
	
	const VeloAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
	const VotingEscrowAddr = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
	

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


  	/*
    [Velo, Voter, VotingEscrow] = await Promise.all([
    	Velo.attach(VeloAddr),
    	Voter.attach(VoterAddr),
    	VotingEscrow.attach(VotingEscrowAddr)
    ])*/

    

 	Velo = await Velo.deploy();
    await Velo.deployed()

    console.log("Velo " + Velo.address);

    VeArtProxy = await VeArtProxy.deploy();
    await VeArtProxy.deployed()

    console.log("VeArtProxy " + VeArtProxy.address);

    VotingEscrow = await VotingEscrow.deploy(Velo.address, VeArtProxy.address);
    await VotingEscrow.deployed()

    console.log("VotingEscrow " + VotingEscrow.address);



    VeManager = await VeManager.deploy(Velo.address, VotingEscrow.address, this.signers[1].address);
    await VeManager.deployed()


    await Velo.setMinter(VeManager.address);

    const addressesMapping = {
		[Velo.address]: Velo,
		[VotingEscrow.address]: VotingEscrow,
		[VeManager.address]: VeManager
	}

    let SDK = new VeManagerSDK(addressesMapping, VeManager.address)


    console.log("---------------------------------------")
    

    var testTarget = [Velo.address, Velo.address]
    var testFunctionCalls = [
    "function initialMint(address _recipient) external",
    "function approve(address _spender, uint _value) external returns (bool)",
    ]
    var testArguements = [
    	[VeManager.address],
    	[VeManager.address, "10000000000000000000000"]
    ]

    const testCalls = SDK.encodeBatchedTx(testTarget, testFunctionCalls, testArguements)
    console.log(testCalls)
    //this should revert btw
    await VeManager.execute(testTarget, testCalls, true).catch(err => {
    	console.log(err)
    })

    var Targets = [Velo.address, Velo.address]
    var FunctionCalls = [
    "function initialMint(address _recipient)",
    "function setRedemptionReceiver(address _receiver)",
    //"function create_lock_for(uint _value, uint _lock_duration, address _to) external nonreentrant returns (uint)" NOPE
    ]
    var Arguements = [
    	[VeManager.address],
    	[this.signers[1].address]
    ]
    
    const encodedCalls = SDK.encodeBatchedTx(Targets, FunctionCalls, Arguements)
    console.log(encodedCalls)


	await VeManager.execute(Targets, encodedCalls, true).catch(err => {
    	console.log(err)
    })

	console.log("Manager balance post initialMint: " + await Velo.balanceOf(VeManager.address))

    await VeManager.drain([Velo.address])
	console.log("Manager balance post Drain: " + await Velo.balanceOf(VeManager.address))

    await Velo.approve(VotingEscrow.address, ethers.utils.parseUnits("1500000"))
    await VotingEscrow.create_lock_for(ethers.utils.parseUnits("1500000"), 4 * 365 * 86400, VeManager.address)

    console.log("NFT BAL of VeManager : " + await VotingEscrow.balanceOf(VeManager.address))




    console.log(SDK.getDecodedTx(Targets, encodedCalls))

    let rawCall = SDK.getRawEncodedTx(Targets, encodedCalls, true)
    console.log(rawCall);

    let rawDecoded = SDK.getRawDecodedTx(rawCall)
    console.log(JSON.stringify(rawDecoded, null, 4))




    console.log("done")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


