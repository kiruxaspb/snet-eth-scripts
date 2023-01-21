const Web3 = require("web3");

const web3 = new Web3('https://mainnet.infura.io/v3/abeaf693685a48d78fc05331f9eee8d8');

// TODO: Integration with Excel

async function stat() {
gas();
setInterval(function() {
  gas();
}, 15000);
}

stat();

async function gas() {
  let time = Date.now();
  // console.log('time:', time);

  const dateObject = new Date(time);
  const msk = dateObject.toLocaleString();
  console.log('MSK Time:', msk);


  const dateObject2 = new Date(time-10800000);
  const utc = dateObject2.toLocaleString();
  console.log('UTC Time:', utc);

  const dateObject3 = new Date(time+12600000);
  const ist = dateObject3.toLocaleString();
  console.log('IST Time:', ist);


  gasPrice = await web3.eth.getGasPrice();
  console.log('Gas base price', gasPrice/1000000000);
}