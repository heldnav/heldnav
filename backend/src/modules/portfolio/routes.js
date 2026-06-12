const express = require("express");
const { readPool } = require("../../lib/chain");

const router = express.Router();

router.get("/", async function portfolio(_req, res) {
  const pool = await readPool();
  if (!pool) {
    res.json({
      source: "unavailable",
      collateralUsd: null,
      debtUsd: null,
      healthFactor: null,
      ltvBps: null,
      liquidationThresholdBps: null,
      borrowAprBps: null,
    });
    return;
  }
  res.json(pool);
});

module.exports = router;
