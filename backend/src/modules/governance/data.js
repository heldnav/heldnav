const PROPOSALS = [
  {
    id: "AIP-003",
    title: "Lower the hnvUSD LTV from 70% to 65%",
    description:
      "Tighten the maximum borrow against HNVWA. The change would reduce capacity on every open line and widen the distance to liquidation.",
    openingFor: 72,
    openingAgainst: 28,
    status: "active",
  },
];

function findProposal(id) {
  return PROPOSALS.find(function match(item) {
    return item.id === id;
  });
}

module.exports = { PROPOSALS, findProposal };
