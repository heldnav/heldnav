const express = require("express");
const cors = require("./middleware/cors");
const health = require("./modules/health/routes");
const portfolio = require("./modules/portfolio/routes");
const markets = require("./modules/markets/routes");
const positions = require("./modules/positions/routes");
const governance = require("./modules/governance/routes");

function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json());
  app.use(cors);
  app.use("/v1/health", health);
  app.use("/v1/portfolio", portfolio);
  app.use("/v1/markets", markets);
  app.use("/v1/positions", positions);
  app.use("/v1/governance", governance);
  app.use(function notFound(_req, res) {
    res.status(404).json({ error: "Not found" });
  });
  return app;
}

module.exports = { createApp };
