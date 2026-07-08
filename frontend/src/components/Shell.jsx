import { NavLink } from "react-router-dom";
import { useConnection, useSwitchChain } from "wagmi";
import { contracts, isDeployed } from "../lib/contracts";
import { WalletButton } from "./WalletButton";

const LINKS = [
  { to: "/", label: "Portfolio", end: true },
  { to: "/markets", label: "Markets" },
  { to: "/borrow", label: "Borrow" },
  { to: "/position", label: "Position" },
  { to: "/governance", label: "Governance" },
];

export function Shell({ children }) {
  const connection = useConnection();
  const switchChain = useSwitchChain();
  const wrongChain = connection.isConnected && connection.chainId !== contracts.chainId;

  return (
    <div className="shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">H</span>
          <strong>Heldnav</strong>
        </NavLink>
        <nav className="nav">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="topbar-end">
          <span className={wrongChain ? "net is-warn" : "net"}>
            {wrongChain ? `Chain ${connection.chainId}` : `Anvil ${contracts.chainId}`}
          </span>
          <WalletButton />
        </div>
      </header>
      <main className="page">
        {!isDeployed() && (
          <p className="notice">
            <span>
              Contracts are not deployed. Run <code>npm run chain</code>, then <code>npm run deploy:local</code>.
            </span>
          </p>
        )}
        {wrongChain && (
          <p className="notice is-warn">
            <span>This desk settles on chain {contracts.chainId}.</span>
            <button type="button" className="btn secondary" onClick={() => switchChain.mutate({ chainId: contracts.chainId })}>
              Switch network
            </button>
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
