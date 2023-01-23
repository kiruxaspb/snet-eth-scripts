const Web3 = require("web3");
const { clear } = require("console");
const abi = require('../smart/abi.json');


const web3 = new Web3('https://mainnet.infura.io/v3/835c29b38fb544699de27051a0a7279f');
const stakeAddress = '0x13e1367A455C45Aa736D7Ff2C5656bA2bD05AD46';
const ABI = abi.abi;

const tokenStakeContract = new web3.eth.Contract(ABI, stakeAddress);

async function getStakeInfo(web3) {
  /*

  // vars
  let stakersVALUE = 0;
  let approvedAmountVALUE = 0;
  let pendingApprovedAmountVALUE = 0;
  let claimableAmountVALUE = 0;
  
  */

  console.log('[ START SCRIPT ]');
  console.log('Getting data....');
  
  /*
  let stakers = await getStakers(web3);
  let stakeIndex = await getCurrentStakeIndex(web3);
  let totalStaked = await getStakedAmount(web3);
  */

  // get events
  tokenStakeContract.getPastEvents('RequestForClaim', {
    fromBlock: 0,
    toBlock: 'latest'
  },
    function(error, events) { console.log(events); }
  )
  .then(function(events) {
      console.log(events) // same results as the optional callback above
  });

  }

getStakeInfo(web3);


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