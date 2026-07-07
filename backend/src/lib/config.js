const fs = require("fs");
const path = require("path");

const ZERO = "0x0000000000000000000000000000000000000000";
const deploymentPath = path.join(__dirname, "../../../frontend/src/lib/deployment.json");

function readDeployment() {
  try {
    return JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  } catch {
    return {};
  }
}

function addr(envName, fallback) {
  return process.env[envName] || fallback || ZERO;
}

const file = readDeployment();

const config = {
  chainId: Number(process.env.CHAIN_ID || file.chainId || 31337),
  rpcUrl: process.env.RPC_URL || file.rpcUrl || "http://127.0.0.1:8545",
  lendingPool: addr("LENDING_POOL_ADDRESS", file.lendingPool),
  hnvwa: addr("HNVWA_ADDRESS", file.hnvwa),
  hnvUsd: addr("STABLECOIN_ADDRESS", file.hnvUsd),
};

function chainReady() {
  return config.lendingPool !== ZERO;
}

module.exports = { config, chainReady, ZERO };
