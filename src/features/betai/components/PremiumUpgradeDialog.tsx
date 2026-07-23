import { useEffect, useRef, useState } from "react";
import {
  PREMIUM_UPGRADE_EVENT,
  type PremiumUpgradeRequest,
} from "../../../services/premiumUpgradeService";
import "./PremiumUpgradeDialog.css";

export default function PremiumUpgradeDialog() {
  const [request, setRequest] = useState<PremiumUpgradeRequest | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const handleRequest = (event: Event) => {
      const detail = (event as CustomEvent<PremiumUpgradeRequest>).detail;
      setRequest(detail);
      dialogRef.current?.showModal();
    };
    window.addEventListener(PREMIUM_UPGRADE_EVENT, handleRequest);
    return () => window.removeEventListener(PREMIUM_UPGRADE_EVENT, handleRequest);
  }, []);

  const close = () => {
    dialogRef.current?.close();
    setRequest(null);
  };

  return (
    <dialog className="premium-dialog" ref={dialogRef} onClose={() => setRequest(null)}>
      <div className="premium-dialog-eyebrow">BetAI Premium</div>
      <h2>{request?.featureName ?? "Premium feature"}</h2>
      <p>{request?.description} Upgrade to unlock this feature for every analyzed wager.</p>
      <div className="premium-dialog-actions">
        <button type="button" className="premium-dialog-secondary" onClick={close}>Not now</button>
        <button type="button" className="premium-dialog-primary" onClick={close}>View Premium</button>
      </div>
    </dialog>
  );
}
