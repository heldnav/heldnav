const { DEFAULT_LTV_BPS, LIQUIDATION_THRESHOLD_BPS } = require("../../lib/risk");

const MARKETS = [
  {
    id: "us-treasury",
    name: "US Treasury",
    token: "HNVWA",
    role: "Collateral",
    apy: 4.2,
    risk: "Low",
    liquidity: "hnvUSD on this chain",
    ltvBps: DEFAULT_LTV_BPS,
    liquidationThresholdBps: LIQUIDATION_THRESHOLD_BPS,
    borrowEnabled: true,
    valuation: "Mock NAV $1.00",
    description:
      "Tokenized US Treasury exposure used as collateral. One token is $1.00 NAV. Posting it opens an hnvUSD line, the stablecoin liquidity this asset unlocks.",
  },
  {
    id: "private-credit",
    name: "Private Credit",
    token: "HNVPC",
    role: "Collateral",
    apy: 8.1,
    risk: "Medium",
    liquidity: "Catalogue only",
    ltvBps: 6000,
    liquidationThresholdBps: 7500,
    borrowEnabled: false,
    valuation: "Catalogue only",
    description:
      "A higher-yield real-world book, listed so its credit limit can be compared. It does not settle on the local pool yet.",
  },
  {
    id: "tokenized-fund",
    name: "Tokenized Fund",
    token: "HNVTF",
    role: "Collateral",
    apy: 6.7,
    risk: "Medium",
    liquidity: "Catalogue only",
    ltvBps: 6500,
    liquidationThresholdBps: 7750,
    borrowEnabled: false,
    valuation: "Catalogue only",
    description:
      "Fund exposure priced as collateral, listed for the same credit comparison. It does not settle on the local pool yet.",
  },
];

function findMarket(id) {
  return MARKETS.find(function match(item) {
    return item.id === id;
  });
}

module.exports = { MARKETS, findMarket };
