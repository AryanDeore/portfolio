/** React hook for sending messages, handling streaming, and maintaining TTL-backed history. */

import { useCallback, useEffect, useRef, useState } from "react";
import { loadSession, saveSession, clearSession } from "@/lib/chat-session";

export type Msg = { role: "user" | "assistant"; content: string };

type SendOpts = {
  /** If true, use streaming endpoint; else non-stream. */
  stream?: boolean;
  /** Retrieval / generation knobs (optional). */
  k?: number;
  model?: string;
  temperature?: number;
  use_hyde?: boolean;
  rerank?: "none" | "cheap" | "llm";
  rerank_top_n?: number;
};

export function useChat() {
  /** Provides chat state and actions for a conversational UI. */
  const [messages, setMessages] = useState<Msg[]>(() => loadSession()?.messages ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Persist on changes
  useEffect(() => {
    saveSession(messages);
  }, [messages]);

  // Optional: clear session on window close
  useEffect(() => {
    const onUnload = () => clearSession();
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  const reset = useCallback(() => {
    /** Clears the conversation. */
    abortRef.current?.abort();
    setMessages([]);
    clearSession();
  }, []);

  const send = useCallback(
    async (userText: string, opts: SendOpts = {}) => {
      /** Sends a user message to the API (streaming or non-stream) and updates local state. */
      if (!userText.trim()) return;
      const payload = {
        question: userText,
        history: messages,
        k: opts.k ?? 5,
        model: opts.model ?? "openai/gpt-4o-mini",
        temperature: opts.temperature ?? 0.2,
        use_hyde: opts.use_hyde ?? false,
        rerank: opts.rerank ?? "none",
        rerank_top_n: opts.rerank_top_n,
      };

      const stream = opts.stream ?? true; // default to streaming
      const route = stream ? "/api/chat/stream" : "/api/chat";

      setMessages((prev) => [...prev, { role: "user", content: userText }]);
      setIsLoading(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(route, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(err || `HTTP ${res.status}`);
        }

        if (!stream) {
          const data = (await res.json()) as { answer: string };
          setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
        } else {
          const reader = res.body?.getReader();
          if (!reader) throw new Error("No reader for response body");
          let acc = "";
          // create placeholder assistant message and update progressively
          setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
          // Calculate the index: after adding user message, messages.length increased by 1
          // After adding placeholder, the assistant message is at messages.length
          const assistantIdx = messages.length + 1; // user message index + 1 = assistant index
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = new TextDecoder().decode(value);
            acc += chunk;
            setMessages((prev) => {
              const copy = [...prev];
              if (copy[assistantIdx]) {
                copy[assistantIdx] = { role: "assistant", content: acc };
              }
              return copy;
            });
          }
        }
      } catch (e) {
        // Append a small error marker
        setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${String(e)}` }]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  return { messages, isLoading, send, reset };
}
