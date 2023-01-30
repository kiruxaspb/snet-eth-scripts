const Web3 = require("web3");
const { clear } = require("console");
const abi = require('./smart/abi.json');

const INFURA_API_KEY = 'https://mainnet.infura.io/v3/835c29b38fb544699de27051a0a7279f';
const STAKE_CONTRACT_ADDRESS_MAINNET = '0x13e1367A455C45Aa736D7Ff2C5656bA2bD05AD46';
const ABI = abi.abi;
const TOKEN_DECIMALS = 100000000;

const web3 = new Web3(INFURA_API_KEY);
const tokenStakeContract = new web3.eth.Contract(ABI, STAKE_CONTRACT_ADDRESS_MAINNET);


async function main() {
  getCurrentClaimableAmount(web3);
}

async function getCurrentClaimableAmount(web3) {
  let claimableAmountValue = 0;
  let stakers = await getStakers(web3);
  let stakeIndex = await getCurrentStakeIndex(web3);

  for (let i = 0; i < stakers.length; i++) {
    // calc claimableAmount in current window, for claim in next time
    let StakerInfo = await tokenStakeContract.methods.getStakeInfo(stakeIndex - 1, stakers[i]).call();
    claimableAmountValue += Number(StakerInfo.claimableAmount);
    

    clear();
    let percent = (i/(stakers.length - 1)) * 100;
    console.log('Processing:', percent.toFixed(2), '%');
  }

  console.log('Claimable tokens after current window:', claimableAmountValue / TOKEN_DECIMALS, 'AGIX');
  }



/* function for get all stakers list */
async function getStakers(web3) {
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
  let totalStakedAmount = await tokenStakeContract.methods.windowTotalStake().call();

  console.log("Total staked:", totalStakedAmount / TOKEN_DECIMALS, "AGIX");
  
  return totalStakedAmount;
}

main();