const Web3 = require("web3");
const { clear } = require("console");
const smart = require('./smart/abi.json');
const config = require('./config/config.json');

const ABI = smart.abi;

const web3 = new Web3(config.INFURA_API_KEY_MAINNET);
const tokenStakeContract = new web3.eth.Contract(ABI, config.STAKE_CONTRACT_ADDRESS_MAINNET);


async function main() {
  totalClaimbaleAmount();
}


async function totalClaimbaleAmount() {
  let claimableAmountValue = 0;
  let stakers = await getStakers();
  let stakeIndex = await getCurrentStakeIndex();

  for (let i = 0; i < stakers.length; i++) {
    let stakerCheck = await tokenStakeContract.methods.getStakeInfo(stakeIndex, stakers[i]).call();
      // if staker have any stake => dont search claim
      if ( Number(stakerCheck.approvedAmount) == 0 && Number(stakerCheck.pendingForApprovalAmount) == 0) {
        // checking claimalbeAmount in every stage window
        for (let j = 0; j < stakeIndex; j++) {
          let staker = await tokenStakeContract.methods.getStakeInfo(j, stakers[i]).call();
          claimableAmountValue += Number(staker.claimableAmount);
        }
      }

    clear();
    let percent = (i/(stakers.length - 1)) * 100;
    console.log('Processing:', percent.toFixed(2), '%');
  }

  console.log('Not taken claimable tokens from all stake windows:', claimableAmountValue / config.TOKEN_DECIMALS, 'AGIX');
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

  console.log("Total staked:", totalStakedAmount / config.TOKEN_DECIMALS, "AGIX");
  
  return totalStakedAmount;
}

main();