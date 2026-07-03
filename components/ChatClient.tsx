"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import AppShell from "@/components/AppShell";
import { sendMessage } from "@/app/actions";
import type { ChatMessage, SafeUser } from "@/lib/db";

export default function ChatClient({ user, messages }: { user: SafeUser; messages: ChatMessage[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
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
          <button className="thread active">
            <span className="avatar-wrap"><span className="avatar a5 online">#</span></span>
            <div className="flex1" style={{ minWidth: 0 }}>
              <div className="row between"><b className="small">General</b></div>
              <div className="tiny text-3" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {messages.length ? messages[messages.length - 1].text : "Platform-wide chat"}
              </div>
            </div>
          </button>
          <div className="tiny text-3" style={{ padding: "14px 16px" }}>
            Project threads open automatically when you hire a developer or a tester is assigned.
          </div>
        </div>

        {/* Conversation */}
        <div className="chat">
          <div className="chat-head">
            <span className="avatar-wrap"><span className="avatar a5 online">#</span></span>
            <div className="flex1"><b className="small">General</b><div className="tiny" style={{ color: "var(--success)" }}>● {user.name} · {user.role}</div></div>
            <button className="btn btn-secondary btn-sm">📞 Voice</button>
            <button className="btn btn-secondary btn-sm">🎥 Video</button>
            <button className="btn btn-secondary btn-sm">🖥️ Share screen</button>
          </div>

          <div className="chat-body" ref={bodyRef}>
            {messages.length === 0 && (
              <div className="card pad center col" style={{ gap: 8, alignSelf: "center", maxWidth: 420, marginTop: 40 }}>
                <span style={{ fontSize: "1.6rem" }}>💬</span>
                <b className="small">No messages yet</b>
                <p className="tiny text-3">Say hello — messages are encrypted in transit and persist in your workspace.</p>
              </div>
            )}
            {messages.map((m) => {
              const me = m.senderId === user.id;
              return (
                <div key={m.id} className={`msg${me ? " me" : ""}`}>
                  {!me && <span className="avatar sm a2">{m.senderInitials}</span>}
                  <div>
                    {!me && <div className="tiny text-3">{m.senderName}</div>}
                    <div className="bubble">
                      {m.text}
                      {m.code && <div className="code-snip mt-1">{m.code}</div>}
                    </div>
                    <div className="tiny text-3 mt-1" style={me ? { textAlign: "right" } : undefined}>{m.time}</div>
                  </div>
                </div>
              );
            })}
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
              placeholder="Message #general…"
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
