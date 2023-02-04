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
  console.log('Start script');
  stakeInfo();
}


async function stakeInfo() {
  let stakersValue = 0;
  let approvedAmountValue = 0;
  let pendingApprovedAmountValue = 0;


  console.log('\nGet staker list...');
  let stakers = await getStakers();

  console.log('\nGet current stake index...');
  let stakeIndex = await getCurrentStakeIndex();

  console.log('\nGet total staked amount...');
  let totalStaked = await getStakedAmount();

  console.log('\nGet actual balance of stake smart contract...');
  let actualBalanceAGIX = await tokenStakeContractBalance();


  /* get all data about each staker */
  console.log('\nGet staked above current window and in current window...');
  console.log('The waiting time is ~ 7 minutes.\n');
  for (let i = 0; i < stakers.length; i++) {
    let staker = await tokenStakeContract.methods.getStakeInfo(stakeIndex, stakers[i]).call();
    let approvedAmount = Number(staker.approvedAmount);
    let pendingApprovedAmount = Number(staker.pendingForApprovalAmount);

    if (pendingApprovedAmount > 0 || approvedAmount > 0) {
      approvedAmountValue += approvedAmount;
      pendingApprovedAmountValue += pendingApprovedAmount;
      stakersValue += 1;
    }
  }
  console.log('Staked above current window:', approvedAmountValue / config.TOKEN_DECIMALS, 'AGIX');
  console.log('Staked in current window( ID:', stakeIndex,'):', pendingApprovedAmountValue / config.TOKEN_DECIMALS);


  console.log('\nGet claimable funds in last window...');
  console.log('The waiting time is ~ 7 minutes.\n');
  let claimableFundsLastWindow = await currentClaimableAmount();


  console.log('\nGet total claimable funds...');
  console.log('The waiting time is ~ 1 hour 40 minutes.\n');
  let totalClaimbaleFunds = await totalClaimbaleAmount();

  console.log('\nProcessing has been completed!\n\n');

  console.log('--------------------------------REPORT------------------------------------');
  console.log('Stake window index:', stakeIndex);
  console.log('Staker records:', stakers.length);
  console.log('Active stakers:', stakersValue);
  console.log('--------------------------------------------------------------------------');
  console.log('Staked above current window:', approvedAmountValue / config.TOKEN_DECIMALS, 'AGIX');
  console.log('Staked in current window( ID:', stakeIndex,'):', pendingApprovedAmountValue / config.TOKEN_DECIMALS, 'AGIX');
  console.log('Total staked fund in current window( ID:', stakeIndex,'):', (approvedAmountValue + pendingApprovedAmountValue) / config.TOKEN_DECIMALS, 'AGIX');
  console.log('Total staked fund in current window( ID:', stakeIndex,')...\n\t...after distribution reward:', totalStaked / config.TOKEN_DECIMALS, 'AGIX');
  console.log('Total claimable funds:', totalClaimbaleFunds, 'AGIX');
  console.log('...of which in the last window:', claimableFundsLastWindow, 'AGIX');
  console.log('------------------------------------------------------------------------');
  console.log('Actual balance tokens on stake contract:', actualBalanceAGIX, 'AGIX');
  console.log('Current deficit of:', (totalStaked / config.TOKEN_DECIMALS) + totalClaimbaleFunds - actualBalanceAGIX, 'AGIX')
  console.log('------------------------------------------------------------------------\n');
   
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

  console.log("Current Stake Index:", Number(_currentStakeMapIndex));

  return Number(_currentStakeMapIndex);
}


/* get all staked value of AGIX Tokens */
async function getStakedAmount() {
  let totalStakedAmount = await tokenStakeContract.methods.windowTotalStake().call();

  console.log("Total staked:", Number(totalStakedAmount) / config.TOKEN_DECIMALS, 'AGIX');
  
  return Number(totalStakedAmount);
}


/* get balance of AGIX Tokens on stake tokens smart contract */
async function tokenStakeContractBalance() {
  let fullAmountAgix = await tokenContract.methods.balanceOf(config.STAKE_CONTRACT_ADDRESS_MAINNET).call();
  let balance = Number(fullAmountAgix) / config.TOKEN_DECIMALS;
  console.log('Actual balance of contract:', balance, 'AGIX');
    
  return balance;
}


/* get current window claimable tokens */
async function currentClaimableAmount() {
  let claimableAmountValue = 0;
  let stakers = await getStakers();
  let stakeIndex = await getCurrentStakeIndex();

  for (let i = 0; i < stakers.length; i++) {
    // calc claimableAmount in current window, for claim in next time
    let StakerInfo = await tokenStakeContract.methods.getStakeInfo(stakeIndex - 1, stakers[i]).call();
    claimableAmountValue += Number(StakerInfo.claimableAmount);
  }

  console.log('Request for claim stake from last window ( ID:', stakeIndex - 1,'):', claimableAmountValue / config.TOKEN_DECIMALS, 'AGIX');

  return claimableAmountValue / config.TOKEN_DECIMALS;
}


/* function for calc total claimable funds */
async function totalClaimbaleAmount() {
  let claimableAmountValue = 0;
  let stakers = await getStakers();
  let stakeIndex = await getCurrentStakeIndex();

  for (let i = 0; i < stakers.length; i++) {
    let stakerCheck = await tokenStakeContract.methods.getStakeInfo(stakeIndex, stakers[i]).call();
      // if staker have any stake => dont search claim
      if (Number(stakerCheck.approvedAmount) == 0 && Number(stakerCheck.pendingForApprovalAmount) == 0) {
        // checking claimalbeAmount in every stage window
        for (let j = 0; j < stakeIndex; j++) {
          let staker = await tokenStakeContract.methods.getStakeInfo(j, stakers[i]).call();
          claimableAmountValue += Number(staker.claimableAmount);
        }
      }
  }

  console.log('Not taken claimable tokens from all stake windows:', claimableAmountValue / config.TOKEN_DECIMALS, 'AGIX');

  return claimableAmountValue / config.TOKEN_DECIMALS;
}


main();