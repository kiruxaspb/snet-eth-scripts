# MANUAL

**Install dependencies:**
```
npm install
```
**Commands:**

1) *Get full information about funds of smart contract :*
```
npm run report
```
2) *Get information from stake contract :*
   * *value of stakers/active stakers*
   * *all about funds*
```
npm run stake
```
3) *Get information about total claimable funds :*
```
npm run claim
```
4) *Get information about claimable funds from current window :*
```
npm run currentClaim
```
5) *Gas tracker with MSK, UTC, IST time zone + gas base price :*
    * *update every 15 sec*
    * *save results in file*
```
npm run gas
```

OPTIONAL:
```
npm install pm2 -g
```
PM2 is a daemon process manager that will help you manage and keep your application.
Using this for 24/7 work script

```
cd staking/src/
pm2 start gas.js
```
```
pm2 stop gas.js (OR [ID Process])
```
