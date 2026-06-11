const { createPublicClient, http } = require("viem");
const { foundry } = require("viem/chains");
const { chainReady, config } = require("./config");
const { formatHf, healthFactor } = require("./risk");

const poolAbi = [
  { type: "function", name: "ltvBps", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "liquidationThresholdBps", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalCollateral", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalDebt", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "currentBorrowAprBps", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    type: "function",
    name: "getPosition",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "collateral", type: "uint256" },
      { name: "debt", type: "uint256" },
      { name: "healthFactor", type: "uint256" },
    ],
  },
];

function client() {
  return createPublicClient({
    chain: { ...foundry, id: config.chainId },
    transport: http(config.rpcUrl, { timeout: 2000 }),
  });
}

function fromWei(value) {
  if (value == null) return null;
  return Number(value) / 1e18;
}

function succeeded(result) {
  return result && result.status === "success" ? result.result : null;
}

async function readContracts(extra) {
  if (!chainReady()) return null;
  const contracts = [
    { address: config.lendingPool, abi: poolAbi, functionName: "ltvBps" },
    { address: config.lendingPool, abi: poolAbi, functionName: "liquidationThresholdBps" },
    { address: config.lendingPool, abi: poolAbi, functionName: "totalCollateral" },
    { address: config.lendingPool, abi: poolAbi, functionName: "totalDebt" },
    { address: config.lendingPool, abi: poolAbi, functionName: "currentBorrowAprBps" },
  ];
  if (extra) contracts.push(extra);
  const rpc = client();
  try {
    return await Promise.all(contracts.map(async function read(item) {
      try {
        return { status: "success", result: await rpc.readContract(item) };
      } catch {
        return { status: "failure", result: null };
      }
    }));
  } catch {
    return null;
  }
}

function poolFrom(results) {
  if (!results) return null;
  const ltvBps = succeeded(results[0]);
  const liquidationThresholdBps = succeeded(results[1]);
  const totalCollateral = succeeded(results[2]);
  const totalDebt = succeeded(results[3]);
  if (ltvBps == null || liquidationThresholdBps == null || totalCollateral == null || totalDebt == null) return null;
  const collateralUsd = fromWei(totalCollateral);
  const debtUsd = fromWei(totalDebt);
  const borrowApr = succeeded(results[4]);
  return {
    source: "chain",
    collateralUsd,
    debtUsd,
    healthFactor: formatHf(healthFactor(collateralUsd, debtUsd, Number(liquidationThresholdBps))),
    ltvBps: Number(ltvBps),
    liquidationThresholdBps: Number(liquidationThresholdBps),
    borrowAprBps: borrowApr == null ? null : Number(borrowApr),
  };
}

async function readPool() {
  return poolFrom(await readContracts());
}

async function readPosition(address) {
  const results = await readContracts({
    address: config.lendingPool,
    abi: poolAbi,
    functionName: "getPosition",
    args: [address],
  });
  const pool = poolFrom(results);
  const position = results ? succeeded(results[5]) : null;
  if (!pool || !position) return null;
  const collateralUsd = fromWei(position.collateral);
  const debtUsd = fromWei(position.debt);
  return {
    source: "chain",
    address,
    collateralUsd,
    debtUsd,
    healthFactor: formatHf(healthFactor(collateralUsd, debtUsd, pool.liquidationThresholdBps)),
    ltvBps: pool.ltvBps,
    liquidationThresholdBps: pool.liquidationThresholdBps,
    borrowAprBps: pool.borrowAprBps,
    maxBorrowUsd: (collateralUsd * pool.ltvBps) / 10000,
  };
}

module.exports = { readPool, readPosition };
