"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import AppShell from "@/components/AppShell";
import { sendMessage } from "@/app/actions";
import type { ChatMessage, SafeUser } from "@/lib/db";

const threads = [
  { initials: "MK", cls: "a2", online: true, name: "Maya Kim", time: "2m", last: "Pushed the charting module — ready for QA 🎉", unread: 2 },
  { initials: "RT", cls: "a3", online: false, name: "Rita Torres (QA)", time: "1h", last: "Found 2 minor bugs in the export flow…", unread: 1 },
  { initials: "DA", cls: "a4", online: true, name: "Diego Alvarez", time: "3h", last: "Daily update: auth + onboarding done ✓", unread: 0 },
  { initials: "SD", cls: "a5", online: false, name: "SDMP Support", time: "2d", last: "Your refund for INV-1031 has been processed", unread: 0 },
];

export default function ChatClient({ user, messages }: { user: SafeUser; messages: ChatMessage[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState(0);
  const [pending, startTransition] = useTransition();
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages.length]);

  function send(e?: React.FormEvent) {
    e?.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setError(null);
    startTransition(async () => {
      const res = await sendMessage(text);
      if (res?.error) setError(res.error);
      else setDraft("");
      router.refresh();
    });
  }

  return (
    <AppShell
      active="messages"
      user={user}
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

        {/* Conversation (persisted in the data layer) */}
        <div className="chat">
          <div className="chat-head">
            <span className="avatar-wrap"><span className="avatar a2 online">MK</span></span>
            <div className="flex1"><b className="small">Maya Kim</b><div className="tiny" style={{ color: "var(--success)" }}>● Online · Fintech Dashboard</div></div>
            <button className="btn btn-secondary btn-sm">📞 Voice</button>
            <button className="btn btn-secondary btn-sm">🎥 Video</button>
            <button className="btn btn-secondary btn-sm">🖥️ Share screen</button>
          </div>

          <div className="chat-body" ref={bodyRef}>
            <span className="day-sep">Today · July 3</span>

            {messages.map((m) => {
              const me = m.senderId === user.id;
              return (
                <div key={m.id} className={`msg${me ? " me" : ""}`}>
                  {!me && <span className="avatar sm a2">{m.senderInitials}</span>}
                  <div>
                    <div className="bubble">
                      {m.file ? (
                        <>📎 <b>{m.file.split(" (")[0]}</b> <span className="tiny text-3">({m.file.split(" (")[1]}</span><br /><span className="tiny text-3">{m.text}</span></>
                      ) : (
                        m.text
                      )}
                      {m.code && <div className="code-snip mt-1">{m.code}</div>}
                    </div>
                    <div className="tiny text-3 mt-1" style={me ? { textAlign: "right" } : undefined}>{m.time}</div>
                  </div>
                </div>
              );
            })}

            <div className="card pad row between" style={{ alignSelf: "center", maxWidth: 480, width: "100%", borderColor: "var(--primary)" }}>
              <div className="small"><b>🔒 Milestone 2 submitted for approval</b><div className="tiny text-3">$4,000 releases after QA verification + your approval</div></div>
              <Link className="btn btn-primary btn-sm" href="/project">Review</Link>
            </div>

            <div className="msg"><span className="avatar sm a2">MK</span><div className="bubble typing"><i /><i /><i /></div></div>
          </div>

          {error && (
            <div className="tiny" style={{ color: "var(--danger)", padding: "6px 20px" }}>⚠️ {error}</div>
          )}
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
              disabled={pending}
            />
            <button className="btn btn-primary btn-sm" style={{ borderRadius: "var(--r-full)", padding: "9px 18px" }} type="submit" disabled={pending}>
              {pending ? "Sending…" : "Send ➤"}
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
