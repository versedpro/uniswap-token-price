const { Fetcher, Route, Token, Trade, TokenAmount, TradeType, ChainId } = require("@uniswap/sdk");
const { ethers } = require("ethers");
const config = require("../config/config");

const fetchTokenPriceInEth = async (tokenAddress) => {
  const provider = new ethers.JsonRpcProvider(config.rpcUrl, "mainnet");
  try {
    // Fetch the data for the given ERC20 token and WETH
    const token = await Fetcher.fetchTokenData(ChainId.MAINNET, ethers.getAddress(tokenAddress), provider);
    const WETH = await Fetcher.fetchTokenData(
      ChainId.MAINNET,
      ethers.getAddress("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"),
      provider
    );

    // Get the pair data
    const pair = await Fetcher.fetchPairData(token, WETH, provider);

    // Create a route
    const route = new Route([pair], WETH);

    // Create trade instance for the token's price in terms of ETH
    const trade = new Trade(
      route,
      new TokenAmount(WETH, "1000000000000000000"), // 1 WETH (18 decimals)
      TradeType.EXACT_INPUT
    );

    // Get the price of the token in terms of ETH
    const tokenPriceInEth = trade.executionPrice.invert().toSignificant(6);

    return tokenPriceInEth;
  } catch (error) {
    console.error("Error fetching token price from Uniswap: ", error);
    return null;
  }
};

module.exports = fetchTokenPriceInEth;

/** Example usage
(async () => {
  const tokenAddress = ""; // Replace with ERC20 token contract address
  const price = await fetchTokenPriceInEth(tokenAddress);
  const priceinwei = ethers.utils.parseEther(price.toString());
  // const amount = amount/decimals x price in eth
  // const credit = amount / rate
  // const totalineth = amount * price;

  console.log(`Price: ${price} ETH`);
  console.log(`Price: ${priceinwei} wei`);
})();
 */
