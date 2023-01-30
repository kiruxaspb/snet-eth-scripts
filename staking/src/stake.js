const Web3 = require("web3");
const { clear } = require("console");
const smart = require('./smart/abi.json');
const config = require('./config/config.json');

const ABI = smart.abi;

const web3 = new Web3(config.INFURA_API_KEY_MAINNET);
const tokenStakeContract = new web3.eth.Contract(ABI, config.STAKE_CONTRACT_ADDRESS_MAINNET);


async function main() {
  console.log('[ START SCRIPT ]');
  stakeInfo(web3);
}


async function stakeInfo(web3) {
  let stakersValue = 0;
  let approvedAmountValue = 0;
  let pendingApprovedAmountValue = 0;
  
  console.log('Getting data...');
  let stakers = await getStakers(web3);
  let stakeIndex = await getCurrentStakeIndex(web3);
  let totalStaked = await getStakedAmount(web3);

  /* get all data about each staker */
  for (let i = 0; i < stakers.length; i++) {
    let staker = await tokenStakeContract.methods.getStakeInfo(stakeIndex, stakers[i]).call();
    let approvedAmount = Number(staker.approvedAmount);
    let pendingApprovedAmount = Number(staker.pendingForApprovalAmount);

    if (pendingApprovedAmount > 0 || approvedAmount > 0) {
      approvedAmountValue += approvedAmount;
      pendingApprovedAmountValue += pendingApprovedAmount;
      stakersValue += 1;
    }

    /* processing indicator */
    clear();
    let percent = (i/(stakers.length - 1)) * 100;
    console.log('Processing:', percent.toFixed(2), '%');
  }

  console.log('\nProcessing has been completed!\n');

  console.log('----------------------------------------------------------');
  console.log('Stake window index:', stakeIndex);
  console.log('Staker records:', stakers.length);
  console.log('Active stakers:', stakersValue);
  console.log('----------------------------------------------------------');
  console.log('Staked above current window:', approvedAmountValue / config.TOKEN_DECIMALS, 'AGIX');
  console.log('Staked in current window:', pendingApprovedAmountValue / config.TOKEN_DECIMALS);
  console.log('Total staked fund in current window', (approvedAmountValue + pendingApprovedAmountValue) / config.TOKEN_DECIMALS, 'AGIX');
  console.log('Total staked fund in current window...\n\t...after distribution reward:', Number(totalStaked) / config.TOKEN_DECIMALS, 'AGIX');
  console.log('----------------------------------------------------------\n');
}


/* function for get all stakers list */
async function getStakers(web3) {
  let stakeHolders = await tokenStakeContract.methods.getStakeHolders().call();

  console.log("Staker records:", stakeHolders.length);

  return stakeHolders;
}


/* function for get value of current stake index */
async function getCurrentStakeIndex(web3) {
  let _currentStakeMapIndex = await tokenStakeContract.methods.currentStakeMapIndex().call();

  console.log("Current Stake Index:", _currentStakeMapIndex);

  return _currentStakeMapIndex;
}


/* get all staked value of AGIX Tokens */
async function getStakedAmount(web3) {
  let totalStakedAmount = await tokenStakeContract.methods.windowTotalStake().call();

  console.log("Total staked:", totalStakedAmount);
  
  return totalStakedAmount;
}

main();