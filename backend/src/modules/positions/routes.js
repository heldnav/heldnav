const express = require("express");
const { isAddress } = require("viem");
const { readPool, readPosition } = require("../../lib/chain");
const { DEFAULT_LTV_BPS, LIQUIDATION_THRESHOLD_BPS, formatHf, healthFactor, maxBorrowUsd, num } = require("../../lib/risk");

const router = express.Router();

router.get("/preview/borrow", async function preview(req, res) {
  const pool = await readPool();
  const ltvBps = pool ? pool.ltvBps : DEFAULT_LTV_BPS;
  const liquidationThresholdBps = pool ? pool.liquidationThresholdBps : LIQUIDATION_THRESHOLD_BPS;
  const collateralUsd = num(req.query.collateralUsd, 10000);
  const borrowUsd = num(req.query.borrowUsd, 6000);
  const max = maxBorrowUsd(collateralUsd, ltvBps);
  const hf = healthFactor(collateralUsd, borrowUsd, liquidationThresholdBps);
  res.json({
    source: pool ? "chain" : "catalogue",
    collateralUsd,
    borrowUsd,
    ltvBps,
    liquidationThresholdBps,
    maxBorrowUsd: max,
    healthFactor: formatHf(hf),
    withinLtv: borrowUsd <= max,
  });
});

router.get("/:address", async function position(req, res) {
  if (!isAddress(req.params.address)) {
    res.status(400).json({ error: "Invalid address" });
    return;
  }
  const row = await readPosition(req.params.address);
  if (!row) {
    res.status(503).json({ error: "Chain unavailable" });
    return;
  }
  res.json(row);
});

module.exports = router;
