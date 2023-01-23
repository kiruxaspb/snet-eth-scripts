const Web3 = require("web3");
const { clear } = require("console");
const abi = require('./smart/abi.json');


const web3 = new Web3('https://mainnet.infura.io/v3/835c29b38fb544699de27051a0a7279f');
const stakeAddress = '0x13e1367A455C45Aa736D7Ff2C5656bA2bD05AD46';
const ABI = abi.abi;
const tokenStakeContract = new web3.eth.Contract(ABI, stakeAddress);


async function main() {
  getStakeInfo(web3);
}


async function getStakeInfo(web3) {
  let claimableAmountVALUE = 0;
  let stakers = await getStakers(web3);
  let stakeIndex = await getCurrentStakeIndex(web3);
  for (let i = 0; i < stakers.length; i++) {
 
  let stakerCheck = await tokenStakeContract.methods.getStakeInfo(stakeIndex, stakers[i]).call();
    // if staker have any stake => dont search claim
    if ( Number(stakerCheck.approvedAmount) == 0 && Number(stakerCheck.pendingForApprovalAmount) == 0) {
      // checking claimalbeAmount in every stage window
      for (let j = 0; j < stakeIndex; j++) {
        let staker = await tokenStakeContract.methods.getStakeInfo(j, stakers[i]).call();
        claimableAmountVALUE += Number(staker.claimableAmount);
      }
    }

    clear();
    let percent = (i/stakers.length) * 100;
    console.log('Processing:', percent.toFixed(2), '%');
  }

  console.log('Total claimable tokens:', claimableAmountVALUE/100000000)
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