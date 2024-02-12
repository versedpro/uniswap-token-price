const ethers = require("ethers");
require("dotenv").config();

// Alchemy provider
const provider = new ethers.AlchemyProvider("mainnet", process.env.ALCHEMY_API_KEY);

// contant variables
const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

// ABI
const poolABI = [
  `function slot0(
    ) external view returns
    (uint160 sqrtPriceX96,
    int24 tick,
    uint16 observationIndex,
    uint16 observationCardinality,
    uint16 observationCardinalityNext,
    uint8 feeProtocol,
    bool unlocked)`,
];
const factoryABI = [
  `function getPool(
    address tokenA,
    address tokenB,
    uint24 fee
  ) external view returns (address pool)`,
];

const getPrice = async (token0, token1, feeAmount) => {
  try {
    const factory = new ethers.Contract(FACTORY_ADDRESS, factoryABI, provider);
    const poolAddress = await factory.getPool(token0, token1, feeAmount);
    console.log("Pool address: ", poolAddress);
    const pool = new ethers.Contract(poolAddress, poolABI, provider);
    const slot0 = await pool.slot0();
    return slot0;
  } catch (error) {
    console.log("Error fetching price from Uniswap: ", error);
  }
};

// Replace second param with ERC20 token contract address
getPrice(WETH_ADDRESS, "0x170Cf5AFe3BF2371610205E429FDD58C860d38E5", 10000).then((res) => {
  const price = res[0];
  const priceInEth = Number(price) ** 2 / 2 ** 192;
  console.log(priceInEth + " ETH");
});
