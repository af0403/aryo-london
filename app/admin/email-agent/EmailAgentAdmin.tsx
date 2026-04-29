"use client";

import { useEffect, useState } from "react";

type EmailLog = {
  id: string;
  from_email: string;
  subject: string;
  body: string;
  ai_response: string;
  sent_at: string;
  overridden: boolean;
  override_response: string | null;
};

type Props = { adminKey: string };

export default function EmailAgentAdmin({ adminKey }: Props) {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [overrideText, setOverrideText] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);
  const [sent, setSent] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(`/api/email-agent/logs?key=${adminKey}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.logs) setLogs(d.logs);
        else setError(d.message ?? "Failed to load logs.");
      })
      .catch(() => setError("Failed to load logs."))
      .finally(() => setLoading(false));
  }, [adminKey]);

  const handleOverride = async (log: EmailLog) => {
    const text = overrideText[log.id];
    if (!text?.trim()) return;
    setSending(log.id);
    try {
      const res = await fetch(`/api/email-agent/override?key=${adminKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: log.id, to: log.from_email, subject: log.subject, response: text }),
      });
      if (res.ok) {
        setSent((prev) => ({ ...prev, [log.id]: true }));
        setLogs((prev) =>
          prev.map((l) => (l.id === log.id ? { ...l, overridden: true, override_response: text } : l))
        );
      } else {
        const d = await res.json();
        alert(d.message ?? "Send failed.");
      }
    } finally {
      setSending(null);
    }
  };

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px", fontFamily: "Arial, sans-serif" }}>
      <p style={{ margin: "0 0 4px", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#999" }}>Admin</p>
      <h1 style={{ margin: "0 0 32px", fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 26, color: "#111" }}>
        Email Agent Log
      </h1>

      {loading && <p style={{ color: "#888" }}>Loading&hellip;</p>}
      {error && <p style={{ color: "#c00" }}>{error}</p>}

      {!loading && !error && logs.length === 0 && (
        <p style={{ color: "#888" }}>No emails handled yet.</p>
      )}

      {logs.map((log) => (
        <div
          key={log.id}
          style={{
            border: "1px solid #ddd",
            borderLeft: log.overridden ? "3px solid #888" : "3px solid #c8b99a",
            background: "#faf9f7",
            marginBottom: 16,
            padding: "18px 20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: "#111" }}>{log.from_email}</p>
              <p style={{ margin: "0 0 4px", fontSize: 13, color: "#555" }}>{log.subject}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>
                {new Date(log.sent_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                {log.overridden && (
                  <span style={{ marginLeft: 10, color: "#888", fontStyle: "italic" }}>overridden</span>
                )}
              </p>
            </div>
            <button
              onClick={() => setExpanded(expanded === log.id ? null : log.id)}
              style={{
                background: "none",
                border: "1px solid #ccc",
                padding: "4px 12px",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                color: "#555",
                flexShrink: 0,
              }}
            >
              {expanded === log.id ? "Collapse" : "Expand"}
            </button>
          </div>

          {expanded === log.id && (
            <div style={{ marginTop: 20 }}>
              <p style={{ margin: "0 0 6px", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#999" }}>
                Customer message
              </p>
              <pre style={{ margin: "0 0 20px", fontSize: 12, color: "#555", lineHeight: 1.65, whiteSpace: "pre-wrap", background: "#f0eeeb", padding: "12px 14px", borderLeft: "2px solid #ddd" }}>
                {log.body}
              </pre>

              <p style={{ margin: "0 0 6px", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#999" }}>
                {log.overridden ? "Original AI draft" : "AI response sent"}
              </p>
              <pre style={{ margin: "0 0 20px", fontSize: 12, color: "#444", lineHeight: 1.65, whiteSpace: "pre-wrap", background: "#f0eeeb", padding: "12px 14px", borderLeft: "2px solid #c8b99a" }}>
                {log.ai_response}
              </pre>

              {log.overridden && log.override_response && (
                <>
                  <p style={{ margin: "0 0 6px", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#999" }}>Override sent</p>
                  <pre style={{ margin: "0 0 20px", fontSize: 12, color: "#444", lineHeight: 1.65, whiteSpace: "pre-wrap", background: "#f0eeeb", padding: "12px 14px", borderLeft: "2px solid #888" }}>
                    {log.override_response}
                  </pre>
                </>
              )}

              {!sent[log.id] && (
                <div>
                  <p style={{ margin: "0 0 8px", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#999" }}>
                    Override &amp; resend
                  </p>
                  <textarea
                    rows={6}
                    value={overrideText[log.id] ?? ""}
                    onChange={(e) => setOverrideText((prev) => ({ ...prev, [log.id]: e.target.value }))}
                    placeholder="Write your override reply here…"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      border: "1px solid #ccc",
                      padding: "10px 12px",
                      fontSize: 13,
                      fontFamily: "Arial, sans-serif",
                      lineHeight: 1.6,
                      resize: "vertical",
                      background: "#fff",
                      color: "#111",
                    }}
                  />
                  <button
                    onClick={() => handleOverride(log)}
                    disabled={sending === log.id || !overrideText[log.id]?.trim()}
                    style={{
                      marginTop: 10,
                      background: "#111",
                      color: "#fff",
                      border: "none",
                      padding: "10px 24px",
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      cursor: sending === log.id ? "not-allowed" : "pointer",
                      opacity: !overrideText[log.id]?.trim() ? 0.4 : 1,
                    }}
                  >
                    {sending === log.id ? "Sending…" : "Send override"}
                  </button>
                </div>
              )}

              {sent[log.id] && (
                <p style={{ fontSize: 13, color: "#666", fontStyle: "italic" }}>Override sent.</p>
              )}
            </div>
          )}
        </div>
      ))}
    </main>
  );
}
