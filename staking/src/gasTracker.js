const Web3 = require("web3");

const web3 = new Web3('https://mainnet.infura.io/v3/835c29b38fb544699de27051a0a7279f');
const delay = 15000 // 15 sec

async function stat2() {
  gas2();
  setInterval(function() {
    gas2();
  }, delay);
  }
  
  stat2();
  
  async function gas2() {
    let time = Date.now();
    // console.log('time:', time);
  
    const dateObject = new Date(time);
    const msk = dateObject.toLocaleTimeString();
    // console.log('MSK Time:', msk);
  
  
    const dateObject2 = new Date(time-10800000);
    const utc = dateObject2.toLocaleTimeString();
    //console.log('UTC Time:', utc);
  
    const dateObject3 = new Date(time+12600000);
    const ist = dateObject3.toLocaleTimeString();
    //console.log('IST Time:', ist);
  
  
    gasPrice = await web3.eth.getGasPrice();
    //console.log('Gas base price', gasPrice/1000000000);

    console.log('UTC:', utc, 'MSK:', msk, 'IST:', ist, 'Gas base price:', gasPrice/1000000000)
  }