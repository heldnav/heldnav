import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiskSheet } from "../components/RiskSheet";
import { TxLine } from "../components/TxLine";
import { toWei } from "../lib/contracts";
import { useProtocolActions, useProtocolPosition } from "../lib/protocol";
import { LIQUIDATION_THRESHOLD_BPS, formatUsd } from "../lib/risk";

export function PositionPage() {
  const position = useProtocolPosition();
  const actions = useProtocolActions(() => {
    void position.refetch();
  });
  const [repayAmt, setRepayAmt] = useState(0);
  const [withdrawAmt, setWithdrawAmt] = useState(0);

  useEffect(() => {
    setRepayAmt(position.debtUsd > 0 ? Number(position.debtUsd.toFixed(2)) : 0);
    setWithdrawAmt(position.collateralUsd > 0 ? Number(position.collateralUsd.toFixed(2)) : 0);
  }, [position.debtUsd, position.collateralUsd]);

  const needsApprove = repayAmt > 0 && position.hnvUsdAllowance < toWei(repayAmt);
  const liveDisabled = !position.isConnected || !position.deployed || actions.busy;

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">Position</p>
          <h1>Open line</h1>
          <p className="lede">The posted asset stays yours. hnvUSD in the wallet is the liquidity this line already unlocked. Repay before you withdraw.</p>
        </div>
      </header>
      {!position.isConnected && <p className="notice">Connect a wallet to load this address.</p>}
      <div className="split">
        <form
          className="panel form-card"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="balances">
            <div className="balance">
              <span>Collateral</span>
              <b>{position.isConnected ? formatUsd(position.collateralUsd) : "—"}</b>
            </div>
            <div className="balance">
              <span>Debt</span>
              <b>{position.isConnected ? formatUsd(position.debtUsd) : "—"}</b>
            </div>
          </div>
          <p className="note">Wallet hnvUSD {position.isConnected ? formatUsd(position.walletHnvUsdBal) : "—"}</p>
          <label className="amount">
            <span className="amount-label">
              Repay
              <button type="button" className="text-btn" onClick={() => setRepayAmt(Number(position.debtUsd.toFixed(2)))}>
                All
              </button>
            </span>
            <span className="amount-box">
              <input type="number" min="0" step="any" value={repayAmt} onChange={(event) => setRepayAmt(Number(event.target.value))} />
              <em>hnvUSD</em>
            </span>
          </label>
          <label className="amount">
            <span className="amount-label">
              Withdraw
              <button type="button" className="text-btn" onClick={() => setWithdrawAmt(Number(position.collateralUsd.toFixed(2)))}>
                All
              </button>
            </span>
            <span className="amount-box">
              <input
                type="number"
                min="0"
                step="any"
                value={withdrawAmt}
                onChange={(event) => setWithdrawAmt(Number(event.target.value))}
              />
              <em>HNVWA</em>
            </span>
          </label>
          <TxLine {...actions} />
          <div className="actions">
            {needsApprove ? (
              <button type="button" className="btn" disabled={liveDisabled || position.debtUsd <= 0} onClick={() => actions.approveHnvUsd()}>
                Approve hnvUSD
              </button>
            ) : (
              <button
                type="button"
                className="btn"
                disabled={liveDisabled || repayAmt <= 0 || position.debtUsd <= 0}
                onClick={() => actions.repay(Math.min(repayAmt, position.debtUsd))}
              >
                Repay
              </button>
            )}
            <button
              type="button"
              className="btn secondary"
              disabled={liveDisabled || withdrawAmt <= 0 || position.collateralUsd <= 0 || position.debtUsd > 0}
              onClick={() => actions.withdraw(Math.min(withdrawAmt, position.collateralUsd))}
            >
              Withdraw
            </button>
            <Link className="btn secondary" to="/borrow">
              Draw more
            </Link>
          </div>
        </form>
        <RiskSheet
          collateralUsd={position.collateralUsd}
          debtUsd={position.debtUsd}
          healthFactor={position.healthFactor}
          ltvBps={position.ltvBps || 7000}
          liquidationThresholdBps={LIQUIDATION_THRESHOLD_BPS}
          maxBorrow={position.maxBorrow}
        />
      </div>
    </>
  );
}
