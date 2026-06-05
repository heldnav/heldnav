const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../../../data/votes.json");

function load() {
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(parsed.votes) ? parsed.votes : [];
  } catch {
    return [];
  }
}

function save(votes) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ votes }, null, 2));
}

function votesFor(proposalId) {
  return load().filter(function match(vote) {
    return vote.proposalId === proposalId;
  });
}

function castVote(proposalId, address, support) {
  const votes = load();
  const existing = votes.find(function match(vote) {
    return vote.proposalId === proposalId && vote.address === address;
  });
  if (existing) return { ok: false, vote: existing };
  const vote = {
    proposalId,
    address,
    support: Boolean(support),
    at: new Date().toISOString(),
  };
  votes.push(vote);
  save(votes);
  return { ok: true, vote };
}

module.exports = { votesFor, castVote };
