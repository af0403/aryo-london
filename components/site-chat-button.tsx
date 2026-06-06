"use client";

import { useEffect, useRef, useState } from "react";

import { CloseIcon } from "./site-icons";

type Message = {
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
};

export const SiteChatButton = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 80);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const fallbackReply =
    "Sorry, client services is unavailable right now. The fastest route for now is Instagram DM @aryolondon.";

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const conversation: Message[] = [...messages, { role: "user", content: text }];
    setMessages([...conversation, { role: "assistant", content: "", pending: true }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("Chat unavailable right now.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: reply, pending: false };
          return next;
        });
      }

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: reply.trim() ? reply : fallbackReply,
          pending: false,
        };
        return next;
      });
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: fallbackReply,
          pending: false,
        },
      ]);
    } finally {
      setStreaming(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className={`client-services-widget ${open ? "is-open" : ""}`}>
      {open ? (
        <div className="client-services-panel chat-panel" role="dialog" aria-label="Client services">
          <div className="client-services-head">
            <div>
              <p className="eyebrow">ARYO</p>
              <strong>Client Services</strong>
            </div>
            <button className="icon-button" type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              <CloseIcon className="site-icon" />
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <p className="chat-welcome">
                Ask about sizing, shipping, returns, or the Pennicella collection.
              </p>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`chat-bubble ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"} ${msg.pending ? "is-thinking" : ""}`}
                >
                  {msg.pending ? (
                    <span className="chat-typing-dots" role="status" aria-label="Assistant is thinking">
                      <span className="chat-typing-dot" />
                      <span className="chat-typing-dot" />
                      <span className="chat-typing-dot" />
                    </span>
                  ) : (
                    msg.content
                  )}
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <textarea
              ref={inputRef}
              className="chat-input"
              rows={1}
              placeholder="Type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={streaming}
            />
            <button
              className="chat-send"
              type="button"
              onClick={send}
              disabled={!input.trim() || streaming}
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      ) : null}

      <button
        className="client-services-trigger"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open client services chat"
      >
        <span>AF</span>
      </button>
    </div>
  );
};
