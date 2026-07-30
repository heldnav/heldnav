import { useQuery } from "@tanstack/react-query";
import { useConnection } from "wagmi";
import { apiGet, apiPost } from "../lib/api";

const FALLBACK = {
  id: "AIP-003",
  title: "Lower the hnvUSD LTV from 70% to 65%",
  description: "Tighten the maximum borrow against HNVWA.",
  forPct: 72,
  againstPct: 28,
  forVotes: 72,
  againstVotes: 28,
  ballots: 0,
  voted: false,
  status: "active",
};

export function GovernancePage() {
  const connection = useConnection();
  const address = connection.address || "";
  const query = useQuery({
    queryKey: ["proposals", address],
    queryFn: () => apiGet(`/governance/proposals${address ? `?address=${address}` : ""}`),
  });
  const proposal = query.data?.[0] || FALLBACK;

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">Governance</p>
          <h1>Parameter votes</h1>
          <p className="lede">A change to LTV or the liquidation threshold reprices every open line. Each address votes once.</p>
        </div>
      </header>
      <article className="proposal">
        <div className="proposal-top">
          <span className="pill is-live">{proposal.status === "active" ? "Active" : proposal.status}</span>
          <span className="asset-token">{proposal.id}</span>
        </div>
        <h2>{proposal.title}</h2>
        <p className="lede">{proposal.description}</p>
        <div className="vote-pair">
          <div>
            <div className="vote-meta">
              <span>For</span>
              <b>{proposal.forPct}%</b>
            </div>
            <div className="vote-bar" aria-hidden="true">
              <span style={{ width: `${proposal.forPct}%` }} />
            </div>
          </div>
          <div>
            <div className="vote-meta">
              <span>Against</span>
              <b>{proposal.againstPct}%</b>
            </div>
            <div className="vote-bar is-nay" aria-hidden="true">
              <span style={{ width: `${proposal.againstPct}%` }} />
            </div>
          </div>
        </div>
        <p className="note">
          {proposal.forVotes} for · {proposal.againstVotes} against
          {proposal.ballots ? ` · ${proposal.ballots} saved from this desk` : ""}
        </p>
        <div className="actions">
          <button
            type="button"
            className="btn"
            disabled={!address || proposal.voted}
            onClick={async () => {
              const result = await apiPost(`/governance/proposals/${proposal.id}/vote`, { support: true, address });
              if (result.ok || result.status === 409) await query.refetch();
            }}
          >
            {!address ? "Connect to vote" : proposal.voted ? "Vote recorded" : "Vote for"}
          </button>
        </div>
      </article>
    </>
  );
}
