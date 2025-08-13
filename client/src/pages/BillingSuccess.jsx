import { useLocation } from "react-router-dom";

function BillingSuccess() {
  const { search } = useLocation();
  const sessionId = new URLSearchParams(search).get("session_id");

  // optional: verify with your API and show plan/status
  // fetch(`${API}/stripe/session?id=${sessionId}`) ...

  return (
    <div className="p-8">
      <h1>🎉 Payment successful!</h1>
      <p>Session: {sessionId}</p>
      <p>Your subscription will activate shortly.</p>
    </div>
  );
}
export default BillingSuccess;
