const Web3 = require("web3");
const { clear } = require("console");
const smart = require('./smart/abi.json');
const token = require('./smart/tokenABI.json');
const config = require('./config/config.json');

const tokenStakeContractABI = smart.abi;
const agixTokenContractABI = token.token;

const web3 = new Web3(config.INFURA_API_KEY_MAINNET);
const tokenStakeContract = new web3.eth.Contract(tokenStakeContractABI, config.STAKE_CONTRACT_ADDRESS_MAINNET);
const tokenContract = new web3.eth.Contract(agixTokenContractABI, config.AGIX_TOKEN_ADDRESS);


async function main() {
  console.log('--- START SCRIPT ---');
  stakeInfo();
}


async function stakeInfo() {
  let stakersValue = 0;
  let approvedAmountValue = 0;
  let pendingApprovedAmountValue = 0;
  
  console.log('--- GETTING DATA ---');
  let stakers = await getStakers();
  let stakeIndex = await getCurrentStakeIndex();
  let totalStaked = await getStakedAmount();
  let actualBalanceAGIX = await tokenStakeContractBalance();

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
  console.log('Staked in current window( ID:', stakeIndex,'):', pendingApprovedAmountValue / config.TOKEN_DECIMALS);
  console.log('Total staked fund in current window( ID:', stakeIndex,'):', (approvedAmountValue + pendingApprovedAmountValue) / config.TOKEN_DECIMALS, 'AGIX');
  console.log('Total staked fund in current window( ID:', stakeIndex,')...\n\t...after distribution reward:', Number(totalStaked) / config.TOKEN_DECIMALS, 'AGIX');
  console.log('----------------------------------------------------------\n');
  console.log('Actual balance tokens on stake contract:', actualBalanceAGIX, 'AGIX');
}


/* function for get all stakers list */
async function getStakers() {
  let stakeHolders = await tokenStakeContract.methods.getStakeHolders().call();

  console.log("Staker records:", stakeHolders.length);

  return stakeHolders;
}


/* function for get value of current stake index */
async function getCurrentStakeIndex() {
  let _currentStakeMapIndex = await tokenStakeContract.methods.currentStakeMapIndex().call();

  console.log("Current Stake Index:", _currentStakeMapIndex);

  return _currentStakeMapIndex;
}


/* get all staked value of AGIX Tokens */
async function getStakedAmount() {
  let totalStakedAmount = await tokenStakeContract.methods.windowTotalStake().call();

  console.log("Total staked:", totalStakedAmount);
  
  return totalStakedAmount;
}


/* get balance of AGIX Tokens on stake tokens smart contract */
async function tokenStakeContractBalance() {
  let fullAmountAgix = await tokenContract.methods.balanceOf(config.STAKE_CONTRACT_ADDRESS_MAINNET).call();
  let balance = Number(fullAmountAgix) / config.TOKEN_DECIMALS;
  console.log('Actual balance of AGIX', balance);
    
  return balance;
}

// TODO: separate func for total stake, stake in window, value of stakers


// TODO: current window claimable tokens
// TODO: total claimable tokens

main();