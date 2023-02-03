const Web3 = require("web3");
const token = require('./smart/tokenABI.json');
const config = require('./config/config.json');

const ABI = token.token;

const web3 = new Web3(config.INFURA_API_KEY_MAINNET);
const tokenContract = new web3.eth.Contract(ABI, config.AGIX_TOKEN_ADDRESS);


async function tokenStakeContractBalance() {
  let fullAmountAgix = await tokenContract.methods.balanceOf(config.STAKE_CONTRACT_ADDRESS_MAINNET).call();
  let balance = Number(fullAmountAgix) / config.TOKEN_DECIMALS;
  console.log(balance);
  
  return balance;
}

tokenStakeContractBalance();