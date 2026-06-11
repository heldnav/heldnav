const DEFAULT_LTV_BPS = 7000;
const LIQUIDATION_THRESHOLD_BPS = 8000;

function healthFactor(collateralUsd, debtUsd, liquidationThresholdBps) {
  const threshold = liquidationThresholdBps == null ? LIQUIDATION_THRESHOLD_BPS : liquidationThresholdBps;
  if (debtUsd <= 0) return Number.POSITIVE_INFINITY;
  return (collateralUsd * (threshold / 10000)) / debtUsd;
}

function maxBorrowUsd(collateralUsd, ltvBps) {
  const ltv = ltvBps == null ? DEFAULT_LTV_BPS : ltvBps;
  return collateralUsd * (ltv / 10000);
}

function formatHf(hf) {
  if (!Number.isFinite(hf)) return "∞";
  return hf.toFixed(2);
}

function num(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

module.exports = {
  DEFAULT_LTV_BPS,
  LIQUIDATION_THRESHOLD_BPS,
  healthFactor,
  maxBorrowUsd,
  formatHf,
  num,
};
