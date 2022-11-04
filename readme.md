# Hello Velodrome


First of all hello.

(Context of veManager)
for the sake of doing this simply veMAnager in managing velo token in the scripts
built an sdk to encode and decode submited tx

(fetching of onchain data using multicall shouldnt be too hard) :D


### Step 1

run this in veVeloSDK DIR (might need an npm install)

npm run build 

### Step 2

install npm packages in main directory

npm install


### Step 3

you can either run the contract on hardhat network using

npx hardhat run scripts/localDeployVeManager.js 

(you can add anything in ther to try whatever should be fast for debuging)

### Step 3.1

you can run the same tests as i did and add more to see if you can break it(doubt :D). 

npx hardhat test test/hardhatTest/VeManager.js





  VeManager tests
    ✔ NFT bal of veManager should not be 0
    ✔ balance of NFT 1 should not be 0
    ✔ balance of NFT 2 should not be 0
    ✔ balance of NFT 3 should be 0
    ✔ create_lock_for should revert
    ✔ transfer should revert
    ✔ setApprovalForAll should revert
    ✔ approve should revert
    ✔ safeTransferFrom should revert
    ✔ safeTransferFrom with bytes should revert
    ✔ transferFrom should revert
    ✔ deposits for NFT 1 and 2 simultaneously should be alright (147ms)
    ✔ Emergency withdrawal should revert
    ✔ Emergency withdrawal should revert when allowed and address(0)
    ✔ Emergency toggle should revert when Not Velo
    ✔ Emergency Withdraw to should work when everything set adn called by OPX Multisig (117ms)
    ✔ Setting migrator function twice in same week should fail
    ✔ Setting migrator from OPX Multisig should fail
    ✔ Emergency Withdraw to should NOT work when everything set and called by Velo Multisig
    ✔ Calling saved calls for deposits on nft 1 and 2 should work (181ms)


  20 passing (3s)
