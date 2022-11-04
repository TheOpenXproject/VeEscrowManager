// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

    const startTime = parseFloat((new Date().getTime()/1000).toFixed(0))

    this.signers = await ethers.getSigners()
    this.network = await signers[0].provider.getNetwork()
    this.deployer = this.signers[0]
    this.accountWithMoney0 = this.signers[1]
    this.accountWithMoney1 = this.signers[2]

    var deadline = new Date();
    deadline = parseInt(deadline / 1000) + 42000;


 const opxVelo = "0x46f21fDa29F1339e0aB543763FF683D399e393eC"
 const velo = "0xc3864f98f2a61A7cAeb95b039D031b4E2f55e0e9" //"0x3c8B650257cFb5f272f799F5e2b4e65093a11a05"

  const factory = "0x25CbdDb98b35ab1FF77413456B31EC81A6B6B746"
  const router = "0x9c12939390052919aF3155f41Bf4160Fd3666A6f"
  // We get the contract to deploy
    const Pair = await hre.ethers.getContractFactory("Pair");

    this.velo = await Pair.attach(velo);

    
    this.opxVelo = await Pair.attach(opxVelo);

  const PairFactory = await hre.ethers.getContractFactory("PairFactory");
  this.PairFactory = await PairFactory.attach(factory);
  //await this.PairFactory.createPair(this.opxVelo.address, this.velo.address, false)

  console.log(await this.PairFactory.getPair(this.opxVelo.address, this.velo.address, false))
  const Router = await hre.ethers.getContractFactory("Router");
  this.Router = await Router.attach(router);
    await this.velo.approve(this.opxVelo.address, hre.ethers.utils.parseUnits('3000000000', 18))

  await this.opxVelo.deposit(hre.ethers.utils.parseUnits('5', 18), this.deployer.address)

  await this.opxVelo.approve(this.Router.address, hre.ethers.utils.parseUnits('3000000000', 18))
  await this.velo.approve(this.Router.address, hre.ethers.utils.parseUnits('3000000000', 18))

  await this.Router.addLiquidity(this.opxVelo.address,
						this.velo.address, 
						false,
						hre.ethers.utils.parseUnits('2.69', 18), 
						hre.ethers.utils.parseUnits('1', 18),
						"1",
						"1",
						this.deployer.address, 
						deadline,
						{ from: this.deployer.address })


  console.log(await this.PairFactory.getPair(this.opxVelo.address, this.velo.address, false))


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
