const express = require("express");
const { getAddress, isAddress } = require("viem");
const { findProposal, PROPOSALS } = require("./data");
const { castVote } = require("./store");
const { present } = require("./tally");

const router = express.Router();

function voter(req) {
  const raw = req.query.address || "";
  return isAddress(raw) ? getAddress(raw).toLowerCase() : "";
}

router.get("/proposals", function list(req, res) {
  const address = voter(req);
  res.json(PROPOSALS.map(function map(proposal) {
    return present(proposal, address);
  }));
});

router.get("/proposals/:id", function detail(req, res) {
  const found = findProposal(req.params.id);
  if (!found) {
    res.status(404).json({ error: "Proposal not found" });
    return;
  }
  res.json(present(found, voter(req)));
});

router.post("/proposals/:id/vote", function vote(req, res) {
  const found = findProposal(req.params.id);
  if (!found) {
    res.status(404).json({ error: "Proposal not found" });
    return;
  }
  const raw = req.body && req.body.address;
  if (!isAddress(raw || "")) {
    res.status(400).json({ error: "A wallet address is required" });
    return;
  }
  const address = getAddress(raw).toLowerCase();
  const support = Boolean(req.body && req.body.support);
  const result = castVote(found.id, address, support);
  const body = present(found, address);
  if (!result.ok) {
    res.status(409).json({ error: "Already voted", proposal: body });
    return;
  }
  res.status(201).json({ status: "recorded", proposal: body });
});

module.exports = router;
