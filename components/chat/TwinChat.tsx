"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Send, User } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { chatWithTwin, type TwinChatResponse } from "@/app/actions/twin-chat";
import { ChatMarkdown } from "@/components/chat/ChatMarkdown";
import { useLocale } from "@/components/LocaleProvider";
import type { TwinProfile } from "@/lib/twin";
import { cn } from "@/lib/utils";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
  fallback?: boolean;
}

const QUICK_PROMPTS = ["experience", "skills", "built", "whoAreYou"] as const;

function HumanAvatar({
  src,
  label,
  size = "h-9 w-9",
  rounded = "rounded-full",
}: {
  src?: string | null;
  label: string;
  size?: string;
  rounded?: string;
}) {
  const monogram = label.trim().charAt(0).toUpperCase() || "?";
  if (src) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden border border-border/70",
          size,
          rounded,
        )}
      >
        <Image
          src={src}
          alt={label}
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center border border-border/70 bg-muted text-sm font-semibold text-foreground/70",
        size,
        rounded,
      )}
    >
      {monogram}
    </div>
  );
}

export function TwinChat({ profile }: { profile: TwinProfile | null }) {
  const { dict, locale } = useLocale();
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ownerName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    dict.chat.title;

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior,
      });
    });
  }, []);

  useEffect(() => {
    scrollToBottom("auto");
    inputRef.current?.focus();
  }, [scrollToBottom]);

  useEffect(() => {
    if (busy) scrollToBottom();
  }, [busy, scrollToBottom]);

  const send = async (text?: string) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || busy) return;
    const next: ChatTurn[] = [...turns, { role: "user", content: trimmed }];
    setTurns(next);
    setInput("");
    setBusy(true);
    scrollToBottom();
    try {
      const result: TwinChatResponse = await chatWithTwin(
        next.map((t) => ({ role: t.role, content: t.content })),
        profile,
        locale,
      );
      setTurns((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.message ?? dict.chat.fallbackError,
          error: !result.ok,
          fallback: true,
        },
      ]);
    } catch {
      setTurns((prev) => [
        ...prev,
        {
          role: "assistant",
          content: dict.chat.fallbackError,
          error: true,
          fallback: true,
        },
      ]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  const quickPromptKey = (
    key: (typeof QUICK_PROMPTS)[number],
  ): keyof typeof dict.chat => `${key}Prompt`;

  return (
    <div className="flex h-full flex-col overflow-hidden border-r border-border/60 bg-background text-foreground">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="flex items-center gap-3 border-b border-border/60 bg-background px-4 py-3">
        <HumanAvatar src={profile?.profileImageUrl} label={ownerName} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{ownerName}</p>
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {dict.chat.availableOnline}
          </p>
        </div>
      </header>

      {/* ── Messages ───────────────────────────────────────── */}
      <div
        ref={listRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-5 [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent]"
      >
        <AnimatePresence initial>
          {turns.length === 0 ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex h-full flex-col justify-center"
            >
              <div className="mb-5 flex justify-center">
                <HumanAvatar
                  src={profile?.profileImageUrl}
                  label={ownerName}
                  size="h-20 w-20"
                />
              </div>
              <p className="mb-6 text-center text-sm leading-relaxed text-muted-foreground">
                {dict.chat.greetingDefault}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {QUICK_PROMPTS.map((key, i) => (
                  <motion.button
                    key={key}
                    type="button"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * i + 0.1 }}
                    onClick={() => send(dict.chat[quickPromptKey(key)])}
                    className={cn(
                      "rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-left transition-colors hover:border-foreground/25 hover:bg-muted",
                    )}
                  >
                    <span className="mb-1 block text-sm font-medium text-foreground">
                      {dict.chat[key]}
                    </span>
                    <span className="block text-xs leading-snug text-muted-foreground">
                      {dict.chat[quickPromptKey(key)]}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            turns.map((turn, i) => (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: chat turns have no stable id
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-end gap-2",
                  turn.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {turn.role === "assistant" && (
                  <HumanAvatar
                    src={profile?.profileImageUrl}
                    label={ownerName}
                  />
                )}

                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    turn.role === "user"
                      ? "rounded-br-md bg-foreground text-background"
                      : cn(
                          "rounded-bl-md border border-border/60 bg-card",
                          turn.error
                            ? "border-destructive/40 bg-destructive/5 text-destructive"
                            : "",
                        ),
                  )}
                >
                  {turn.role === "user" ? (
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {turn.content}
                    </p>
                  ) : (
                    <ChatMarkdown content={turn.content} />
                  )}
                </div>

                {turn.role === "user" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/70 bg-muted text-foreground/50">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))
          )}

          {busy && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-2"
            >
              <HumanAvatar src={profile?.profileImageUrl} label={ownerName} />
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border/60 bg-card px-4 py-3">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="h-2 w-2 animate-bounce rounded-full bg-foreground/40"
                    style={{ animationDelay: `${d * 150}ms` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Composer ───────────────────────────────────────── */}
      <div className="border-t border-border/60 bg-background px-3 pb-3 pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2"
        >
          <div className="flex flex-1 items-center rounded-2xl border border-border/60 bg-muted/30 px-3.5 py-2 transition-colors focus-within:border-foreground/40">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.chat.placeholder}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
          </div>
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-background transition-colors",
              input.trim() && !busy
                ? "bg-foreground hover:opacity-90"
                : "cursor-not-allowed bg-muted text-muted-foreground/40",
            )}
            aria-label={dict.chat.send}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-1.5 px-1 text-center text-[10px] leading-tight text-muted-foreground/70">
          {dict.chat.disclaimer}
        </p>
      </div>
    </div>
  );
}

export default TwinChat;
