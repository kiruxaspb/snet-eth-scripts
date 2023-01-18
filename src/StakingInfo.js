var Web3 = require("web3");
var abi = require('./abi.json');
const { clear } = require("console");
// var fs = require("fs")

const web3 = new Web3('https://mainnet.infura.io/v3/abeaf693685a48d78fc05331f9eee8d8');

async function stakers(web3) {
  let stakersVALUE = 0;
  let approvedAmountVALUE = 0;
  let pendingApprovedAmountVALUE = 0;
  let claimableAmountVALUE = 0;
  const ABI = abi.abi;
  var tokenStakeContract = new web3.eth.Contract(ABI, '0x13e1367A455C45Aa736D7Ff2C5656bA2bD05AD46');

  console.log('Script Starting... Get all the stakers...');
  let stakers = await tokenStakeContract.methods.getStakeHolders().call();

  
  /* get all data about each staker */
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



    /* processing indicator */
    clear();
    // console.log(i, '/', stakers.length);
    let percent = (i/stakers.length) * 100;
    console.log('Processing:', percent.toFixed(2), '%');
  }

  console.log('[INFO] Processing has been completed!');
  console.log('Processed:', stakers.length, 'records');
  console.log('-----------------RESULTS---------------');
  console.log('---------------------------------------');
  console.log('Stakers:', stakersVALUE);
  console.log('-----staking above current window------');
  console.log('approvedAmount:', approvedAmountVALUE);
  console.log('---------------------------------------');
  console.log('------staking in current window--------');
  console.log('pendingForApprovalAmount:', pendingApprovedAmountVALUE);
  console.log('---------------------------------------');
  console.log('--total staked fund in current window--');
  console.log('total:', approvedAmountVALUE + pendingApprovedAmountVALUE);
  console.log('---------------------------------------');
  console.log('-------funds ready for withdrawal------');
  console.log('claimableAmount:', claimableAmountVALUE);
  console.log('---------------------------------------');
}
stakers(web3);



/* get all staked value of AGIX Tokens */
async function getStakedAmount(web3) {
  const ABI = abi.abi;
  var tokenStakeContract = new web3.eth.Contract(ABI, '0x13e1367A455C45Aa736D7Ff2C5656bA2bD05AD46');
  let amount = await tokenStakeContract.methods.windowTotalStake().call();
  console.log('Total Staked Amount --', amount)
}
// getStakedAmount(web3);




/* function for get all stakers list */
async function getStakers(web3) {
  const ABI = abi.abi;
  var tokenStakeContract = new web3.eth.Contract(ABI, '0x13e1367A455C45Aa736D7Ff2C5656bA2bD05AD46');
  const result = await tokenStakeContract.methods.getStakeHolders().call();
  console.log("getStakeHolders result -- ", result);
  return result;
}
// getStakers(web3);




/* function for get value of AGIX tokens ready for claim */
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

  console.log('total claimableAmount --', amount)
}
// claimable(web3);







//const bigIntVal = Number(staker.pendingForApprovalAmount);
  //console.log(bigIntVal);


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