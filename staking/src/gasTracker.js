const Web3 = require("web3");

const web3 = new Web3('https://mainnet.infura.io/v3/835c29b38fb544699de27051a0a7279f');
const delay = 15000 // 15 sec


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

  const dateObjectUTC = new Date(currentTime-10800000);
  const universalTime = dateObjectUTC.toLocaleTimeString(); // UTC
  
  const dateObjectIST = new Date(currentTime+12600000);
  const indianTime = dateObjectIST.toLocaleTimeString(); // IST
  
  gasPrice = await web3.eth.getGasPrice();

  console.log('UTC:', universalTime, 'MSK:', moscowTime, 'IST:', indianTime, 'Gas base price:', gasPrice/1000000000)
}

main();