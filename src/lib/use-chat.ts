/** React hook for sending messages and handling streaming responses. */

import { useCallback, useState } from "react";

export type Msg = { role: "user" | "assistant"; content: string };

type SendOpts = {
  stream?: boolean;
  k?: number;
  model?: string;
  temperature?: number;
  use_hyde?: boolean;
  rerank?: "none" | "cheap" | "llm";
  rerank_top_n?: number;
};

export function useChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = { current: null as AbortController | null };

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
  }, []);

  const send = useCallback(
    async (userText: string, opts: SendOpts = {}) => {
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

      const stream = opts.stream ?? true;
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
          setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
          const idx = messages.length + 1;
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = new TextDecoder().decode(value);
            acc += chunk;
            setMessages((prev) => {
              const copy = [...prev];
              copy[idx] = { role: "assistant", content: acc };
              return copy;
            });
          }
        }
      } catch (e) {
        setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${String(e)}` }]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  return { messages, isLoading, send, reset };
}
