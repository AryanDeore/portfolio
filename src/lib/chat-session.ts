/** Lightweight session storage with TTL for chat history. */

type Msg = { role: "user" | "assistant"; content: string };

const KEY = "chat_session_v1";
const TTL_MS = 20 * 60 * 1000; // 20 minutes

export function loadSession(): { messages: Msg[]; ts: number } | null {
  /** Loads the session (messages + timestamp) from sessionStorage, or null if missing/expired. */
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { messages: Msg[]; ts: number };
    if (Date.now() - parsed.ts > TTL_MS) {
      sessionStorage.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    sessionStorage.removeItem(KEY);
    return null;
  }
}

export function saveSession(messages: Msg[]): void {
  /** Saves messages with a fresh timestamp to sessionStorage. */
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify({ messages, ts: Date.now() }));
}

export function clearSession(): void {
  /** Clears the stored chat session. */
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
