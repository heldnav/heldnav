const { votesFor } = require("./store");

function present(proposal, address) {
  const ballots = votesFor(proposal.id);
  let forVotes = proposal.openingFor;
  let againstVotes = proposal.openingAgainst;
  let voted = false;
  let support = null;
  const voter = address ? address.toLowerCase() : "";
  ballots.forEach(function apply(ballot) {
    if (ballot.support) forVotes += 1;
    else againstVotes += 1;
    if (voter && ballot.address === voter) {
      voted = true;
      support = ballot.support;
    }
  });
  const total = forVotes + againstVotes;
  const forPct = total ? Math.round((forVotes / total) * 1000) / 10 : 0;
  const againstPct = total ? Math.round((100 - forPct) * 10) / 10 : 0;
  return {
    id: proposal.id,
    title: proposal.title,
    description: proposal.description,
    status: proposal.status,
    forVotes,
    againstVotes,
    forPct,
    againstPct,
    ballots: ballots.length,
    voted,
    support,
  };
}

module.exports = { present };
