const Web3 = require("web3");
const { clear } = require("console");
const abi = require('./smart/abi.json');

const web3 = new Web3('https://mainnet.infura.io/v3/835c29b38fb544699de27051a0a7279f');
const stakeAddress = '0x13e1367A455C45Aa736D7Ff2C5656bA2bD05AD46';
const ABI = abi.abi;
const tokenStakeContract = new web3.eth.Contract(ABI, stakeAddress);


async function main() {
  console.log('[ START SCRIPT ]');
  getStakeInfo(web3);
}


async function getStakeInfo(web3) {
  let stakersVALUE = 0;
  let approvedAmountVALUE = 0;
  let pendingApprovedAmountVALUE = 0;
  let claimableAmountVALUE = 0;
  
  console.log('Getting data...');
  let stakers = await getStakers(web3);
  let stakeIndex = await getCurrentStakeIndex(web3);
  let totalStaked = await getStakedAmount(web3);

  /* get all data about each staker */
  for (let i = 0; i < stakers.length; i++) {
    let staker = await tokenStakeContract.methods.getStakeInfo(stakeIndex, stakers[i]).call();
    let approvedAmount = Number(staker.approvedAmount);
    let pendingApprovedAmount = Number(staker.pendingForApprovalAmount);
    // let claimableAmount = Number(staker.claimableAmount);

    if (pendingApprovedAmount > 0 || approvedAmount > 0) {
      approvedAmountVALUE += approvedAmount;
      pendingApprovedAmountVALUE += pendingApprovedAmount;
      stakersVALUE += 1;
    }
    // claimableAmountVALUE += claimableAmount;

    /* processing indicator */
    clear();
    let percent = (i/stakers.length) * 100;
    console.log('Processing:', percent.toFixed(2), '%');
  }

  console.log('\nProcessing has been completed!\n');

  console.log('----------------------------------------------------------');
  console.log('Stake window index:', stakeIndex);
  console.log('Staker records:', stakers.length);
  console.log('Active stakers:', stakersVALUE);
  console.log('Staked above current window:', approvedAmountVALUE/100000000);
  console.log('Staked in current window:', pendingApprovedAmountVALUE/100000000);
  console.log('Total staked fund in current window', (approvedAmountVALUE + pendingApprovedAmountVALUE)/100000000);
  console.log('Total staked fund in current window...\n\t...after distribution reward:', Number(totalStaked)/100000000);
  // console.log('Funds requested for withdrawal:', claimableAmountVALUE);
  console.log('----------------------------------------------------------\n');
}


/* function for get all stakers list */
async function getStakers(web3) {
  var tokenStakeContract = new web3.eth.Contract(ABI, '0x13e1367A455C45Aa736D7Ff2C5656bA2bD05AD46');
  const stakeHolders = await tokenStakeContract.methods.getStakeHolders().call();

  console.log("Staker records:", stakeHolders.length);

  return stakeHolders;
}


/* function for get value of current stake index */
async function getCurrentStakeIndex(web3) {
  const _currentStakeMapIndex = await tokenStakeContract.methods.currentStakeMapIndex().call();

  console.log("Current Stake Index:", _currentStakeMapIndex);

  return _currentStakeMapIndex;
}


/* get all staked value of AGIX Tokens */
async function getStakedAmount(web3) {
  const ABI = abi.abi;
  var tokenStakeContract = new web3.eth.Contract(ABI, stakeAddress);
  let totalStakedAmount = await tokenStakeContract.methods.windowTotalStake().call();

  console.log("Total staked:", totalStakedAmount);
  
  return totalStakedAmount;
}

main();