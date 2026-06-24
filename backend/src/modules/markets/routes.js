const express = require("express");
const { readPool } = require("../../lib/chain");
const { findMarket, MARKETS } = require("./data");

const router = express.Router();

function withPool(market, pool) {
  if (!market.borrowEnabled || !pool) return market;
  return {
    ...market,
    ltvBps: pool.ltvBps,
    liquidationThresholdBps: pool.liquidationThresholdBps,
    borrowAprBps: pool.borrowAprBps,
    limitsSource: "chain",
    assetYieldLabel: "Underlying asset yield, illustrative",
    borrowAprLabel: "Borrow APR from the pool interest model",
  };
}

router.get("/", async function list(_req, res) {
  const pool = await readPool();
  res.json(MARKETS.map(function map(market) {
    return withPool(market, pool);
  }));
});

router.get("/:id", async function detail(req, res) {
  const found = findMarket(req.params.id);
  if (!found) {
    res.status(404).json({ error: "Market not found" });
    return;
  }
  const pool = await readPool();
  res.json(withPool(found, pool));
});

module.exports = router;
