const { ethers } = require("ethers");
const ABI = require("./abi.json");
var url = 'https://mainnet.infura.io/v3/abeaf693685a48d78fc05331f9eee8d8';
var customHttpProvider = new ethers.providers.JsonRpcProvider(url);
customHttpProvider.getBlockNumber().then((result) => {
    console.log("Current block number: " + result);
});





const stakeAddress = new ethers.Contract('0x13e1367A455C45Aa736D7Ff2C5656bA2bD05AD46', ABI.abi, customHttpProvider);
async function test() {
  // let map = await stakeAddress.getStakeHolders();

  let test = await stakeAddress.getStakeInfo(34, '0x2799Aa9a16592847Fe8314fd6072A516402557ea');

  console.log(test);
  console.log(test.claimableAmount)
}


test();