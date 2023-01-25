const Web3 = require("web3");

const INFURA_API_KEY = 'https://mainnet.infura.io/v3/835c29b38fb544699de27051a0a7279f';
const delay = 15000; // 15 sec
const CALC_UTC_TIME = 10800000; // 3 hours
const CALC_IST_TIME = 9000000; // 2 hours 30 minutes

const web3 = new Web3(INFURA_API_KEY);


async function main() {
  gasChecker();
}


async function gasChecker() {
  gas();
  setInterval(function() {
    gas();
  }, delay);
}


async function gas() {
  let currentTime = Date.now();
  
  const dateObjectMSK = new Date(currentTime);
  const moscowTime = dateObjectMSK.toLocaleTimeString(); // MSK

  const dateObjectUTC = new Date(currentTime - CALC_UTC_TIME);
  const universalTime = dateObjectUTC.toLocaleTimeString(); // UTC
  
  const dateObjectIST = new Date(currentTime + CALC_IST_TIME);
  const indianTime = dateObjectIST.toLocaleTimeString(); // IST
  
  gasPrice = await web3.eth.getGasPrice();

  console.log('UTC:', universalTime, 'MSK:', moscowTime, 'IST:', indianTime, '| Gas base price:', gasPrice/1000000000)
}

main();