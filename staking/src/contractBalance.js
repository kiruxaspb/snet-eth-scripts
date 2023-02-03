const Web3 = require("web3");
const token = require('./smart/tokenABI.json');
const config = require('./config/config.json');

const ABI = token.token;

const web3 = new Web3(config.INFURA_API_KEY_MAINNET);
const tokenStakeContract = new web3.eth.Contract(ABI, '0x5B7533812759B45C2B44C19e320ba2cD2681b542');


async function test() {
  let temp = await tokenStakeContract.methods.balanceOf('0x13e1367A455C45Aa736D7Ff2C5656bA2bD05AD46').call();
  let balance = Number(temp)/100000000;
  console.log(balance);
  
  return balance;
}

test();