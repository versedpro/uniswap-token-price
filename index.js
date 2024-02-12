const { ethers } = require("ethers");
const fetchTokenPriceInEth = require("./uniswapV2.js");

const tokenAddress = ""; // Replace with ERC20 token contract address
const price = await fetchTokenPriceInEth(tokenAddress);
const priceinwei = ethers.utils.parseEther(price.toString());
// const amount = amount/decimals x price in eth
// const credit = amount / rate
// const totalineth = amount * price;

console.log(`Price: ${price} ETH`);
console.log(`Price: ${priceinwei} wei`);
