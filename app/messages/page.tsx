"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AppShell from "@/components/AppShell";

type Msg = { me?: boolean; text: string; time: string; code?: string; file?: string };

const initialMessages: Msg[] = [
  { text: "Morning Andre! The real-time chart streaming is in. WebSocket layer pushes deltas every 500ms with backpressure handling.", time: "9:14 AM" },
  {
    text: "Here's the subscription hook if you want a peek:",
    time: "9:15 AM",
    code: `const usePriceStream = (symbol: string) =>
  useSubscription(PRICE_STREAM, {
    variables: { symbol },
    onData: ({ data }) => buffer.push(data),
  });`,
  },
  { me: true, text: "This looks great! 🔥 How does it behave on flaky connections?", time: "9:22 AM · Read ✓✓" },
  { text: "Auto-reconnect with exponential backoff, and the buffer replays missed deltas. Rita can hammer it in QA — I added a network-throttle test case to the checklist.", time: "9:24 AM" },
  { text: "Friday demo recording — full walkthrough of M2", time: "9:26 AM", file: "milestone-2-demo.mp4 (38 MB)" },
];

const threads = [
  { initials: "MK", cls: "a2", online: true, name: "Maya Kim", time: "2m", last: "Pushed the charting module — ready for QA 🎉", unread: 2 },
  { initials: "RT", cls: "a3", online: false, name: "Rita Torres (QA)", time: "1h", last: "Found 2 minor bugs in the export flow…", unread: 1 },
  { initials: "DA", cls: "a4", online: true, name: "Diego Alvarez", time: "3h", last: "Daily update: auth + onboarding done ✓", unread: 0 },
  { initials: "SD", cls: "a5", online: false, name: "SDMP Support", time: "2d", last: "Your refund for INV-1031 has been processed", unread: 0 },
];

export default function Messages() {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [activeThread, setActiveThread] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages]);

  function send(e?: React.FormEvent) {
    e?.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setMessages((m) => [...m, { me: true, text, time: `${time} · Sent ✓` }]);
    setDraft("");
  }

  return (
    <AppShell
      active="messages"
      flush
      topbar={
        <>
          <b>Messages</b>
          <div style={{ flex: 1 }} />
        </>
      }
    >
      <div className="chat-layout">
        {/* Threads */}
        <div className="threads">
          {threads.map((t, i) => (
            <button key={t.name} className={`thread${i === activeThread ? " active" : ""}`} onClick={() => setActiveThread(i)}>
              <span className="avatar-wrap"><span className={`avatar ${t.cls}${t.online ? " online" : ""}`}>{t.initials}</span></span>
              <div className="flex1" style={{ minWidth: 0 }}>
                <div className="row between"><b className="small">{t.name}</b><span className="tiny text-3">{t.time}</span></div>
                <div className="tiny text-3" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.last}</div>
              </div>
              {t.unread > 0 && <span className="badge badge-danger">{t.unread}</span>}
            </button>
          ))}
        </div>

        {/* Conversation */}
        <div className="chat">
          <div className="chat-head">
            <span className="avatar-wrap"><span className="avatar a2 online">MK</span></span>
            <div className="flex1"><b className="small">Maya Kim</b><div className="tiny" style={{ color: "var(--success)" }}>● Online · Fintech Dashboard</div></div>
            <button className="btn btn-secondary btn-sm">📞 Voice</button>
            <button className="btn btn-secondary btn-sm">🎥 Video</button>
            <button className="btn btn-secondary btn-sm">🖥️ Share screen</button>
          </div>

          <div className="chat-body" ref={bodyRef}>
            <span className="day-sep">Today · July 2</span>

            {messages.map((m, i) => (
              <div key={i} className={`msg${m.me ? " me" : ""}`}>
                {!m.me && <span className="avatar sm a2">MK</span>}
                <div>
                  <div className="bubble">
                    {m.file ? (
                      <>📎 <b>{m.file.split(" (")[0]}</b> <span className="tiny text-3">({m.file.split(" (")[1]}</span><br /><span className="tiny text-3">{m.text}</span></>
                    ) : (
                      m.text
                    )}
                    {m.code && <div className="code-snip mt-1">{m.code}</div>}
                  </div>
                  <div className="tiny text-3 mt-1" style={m.me ? { textAlign: "right" } : undefined}>{m.time}</div>
                </div>
              </div>
            ))}

            <div className="card pad row between" style={{ alignSelf: "center", maxWidth: 480, width: "100%", borderColor: "var(--primary)" }}>
              <div className="small"><b>🔒 Milestone 2 submitted for approval</b><div className="tiny text-3">$4,000 releases after QA verification + your approval</div></div>
              <Link className="btn btn-primary btn-sm" href="/project">Review</Link>
            </div>

            <div className="msg"><span className="avatar sm a2">MK</span><div className="bubble typing"><i /><i /><i /></div></div>
          </div>

          <form className="chat-foot" onSubmit={send}>
            <button type="button" className="btn btn-ghost btn-sm">📎</button>
            <button type="button" className="btn btn-ghost btn-sm">{"{ }"}</button>
            <button type="button" className="btn btn-ghost btn-sm">🎤</button>
            <input
              className="input"
              style={{ borderRadius: "var(--r-full)" }}
              placeholder="Message Maya… (@task to mention a task)"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" style={{ borderRadius: "var(--r-full)", padding: "9px 18px" }} type="submit">
              Send ➤
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
