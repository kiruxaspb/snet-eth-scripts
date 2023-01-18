var Web3 = require("web3");
var abi = require('./abi.json');
// var fs = require("fs")

const web3 = new Web3('https://mainnet.infura.io/v3/abeaf693685a48d78fc05331f9eee8d8');

async function stakers(web3) {
  let stakersVALUE = 0;
  let approvedAmountVALUE = 0;
  let pendingApprovedAmountVALUE = 0;
  let claimableAmountVALUE = 0;
  const ABI = abi.abi;
  var tokenStakeContract = new web3.eth.Contract(ABI, '0x13e1367A455C45Aa736D7Ff2C5656bA2bD05AD46');

  let stakers = await tokenStakeContract.methods.getStakeHolders().call();

  console.log('Staker records -- ', stakers.length)

  for (let i = 0; i < stakers.length; i++) {
    let staker = await tokenStakeContract.methods.getStakeInfo(34, stakers[i]).call();
    let approvedAmount = Number(staker.approvedAmount);
    let pendingApprovedAmount = Number(staker.pendingForApprovalAmount);
    let claimableAmount = Number(staker.claimableAmount);

    if (pendingApprovedAmount > 0 || approvedAmount > 0) {
      approvedAmountVALUE += approvedAmount;
      pendingApprovedAmountVALUE += pendingApprovedAmount;
      stakersVALUE += 1;
    }
    claimableAmountVALUE += claimableAmount;
    console.log(i, '/', stakers.length)
  }

  console.log('==================================================================================')
  console.log('Stakers:', stakersVALUE);
  console.log('approvedAmount:', approvedAmountVALUE);
  console.log('------------------------staking in current window---------------------------------');
  console.log('pendingForApprovalAmount:', pendingApprovedAmountVALUE);
  console.log('----------------------------------------------------------------------------------');
  console.log('claimableAmount:', claimableAmountVALUE)
}

stakers(web3);




async function getStakers(web3) {

  const ABI = abi.abi;

  var tokenStakeContract = new web3.eth.Contract(ABI, '0x13e1367A455C45Aa736D7Ff2C5656bA2bD05AD46');

  const result = await tokenStakeContract.methods.getStakeHolders().call();
  // 
  // 0xcb97b934bc15b74b24c2bbbcba73607ce111a41b
  // 0x2799Aa9a16592847Fe8314fd6072A516402557ea

  // 0xf60fe344c3ffc3e233818f07af31c4aa07379cdb

  console.log("getStakeHolders result -- ", result);

  // let test = await tokenStakeContract.methods.getStakeInfo(34, '0xf60fe344c3ffc3e233818f07af31c4aa07379cdb').call();
  /* let staker = await tokenStakeContract.methods.getStakeInfo(34, '0xf60fe344c3ffc3e233818f07af31c4aa07379cdb').call();

  */

  return result;
}

// getStakers(web3);

async function claimable(web3) {
  
  let amount = 0;
  const ABI = abi.abi;
  var tokenStakeContract = new web3.eth.Contract(ABI, '0x13e1367A455C45Aa736D7Ff2C5656bA2bD05AD46');

  let stakers = await tokenStakeContract.methods.getStakeHolders().call();

  for (let i = 0; i < stakers.length; i++) {
    let staker = await tokenStakeContract.methods.getStakeInfo(34, stakers[i]).call();
    let tempAmount = Number(staker.claimableAmount);
    if (tempAmount > 0) {
      amount += tempAmount;
    }
    console.log(i, amount)
  }

  console.log('total pendingForApprovalAmount -- ', amount)

  //const bigIntVal = Number(staker.pendingForApprovalAmount);
  //console.log(bigIntVal);
}

// claimable(web3);

    /*
    console.log(
      i,
      '\t| Address:', stakers[i],
      '\t| ApprovedAmount:', approvedAmount,
      '  \t | pendingApprovedAmount:', pendingApprovedAmount,
      '  \t | rewardComputeIndex:', rewardComputeIndex,
      '\t| claimableAmount:', claimableAmount
    );
  */