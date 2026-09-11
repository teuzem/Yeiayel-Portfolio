"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  RotateCcw,
  Search,
  Send,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  submitTwinFeedback,
  type TwinFeedbackInput,
} from "@/app/actions/submit-twin-feedback";
import { submitTwinReview } from "@/app/actions/submit-twin-review";
import { chatWithTwin, type TwinChatResponse } from "@/app/actions/twin-chat";
import { useOptionalAuth } from "@/components/AuthProvider";
import { ChatMarkdown } from "@/components/chat/ChatMarkdown";
import { useLocale } from "@/components/LocaleProvider";
import { useSidebar } from "@/components/ui/sidebar";
import type { TwinFeedbackProfile, TwinProfile } from "@/lib/twin";
import { cn } from "@/lib/utils";

interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
  source?: TwinChatResponse["source"];
  model?: string;
  feedback?: TwinFeedbackInput["rating"];
  feedbackPersisted?: boolean;
  researched?: boolean;
  researchAttempted?: boolean;
  researchProvider?: TwinChatResponse["researchProvider"];
  researchStatus?: TwinChatResponse["researchStatus"];
  sources?: TwinChatResponse["sources"];
  reviewAcknowledgement?: boolean;
}

interface StoredFeedbackProfile extends TwinFeedbackProfile {
  reviewCount: number;
  ratingTotal: number;
}

const QUICK_PROMPTS = ["experience", "skills", "built", "whoAreYou"] as const;
const MEMORY_KEY = "yeiayel-ai-twin-history-v3";
const LEGACY_MEMORY_PREFIX = "yeiayel-ai-twin-history-v2";
const REVIEW_PREFIX = "yeiayel-ai-twin-review-v1";
const FEEDBACK_PROFILE_PREFIX = "yeiayel-ai-twin-feedback-profile-v1";
const MAX_STORED_TURNS = 40;

function createTurnId(role: ChatTurn["role"]): string {
  return `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function legacyMemoryKey(locale: "en" | "fr"): string {
  return `${LEGACY_MEMORY_PREFIX}-${locale}`;
}

function reviewKey(locale: "en" | "fr", userId?: string | null): string {
  return `${REVIEW_PREFIX}-${locale}-${userId || "guest"}`;
}

function feedbackProfileKey(
  locale: "en" | "fr",
  userId?: string | null,
): string {
  return `${FEEDBACK_PROFILE_PREFIX}-${locale}-${userId || "guest"}`;
}

function emptyFeedbackProfile(): StoredFeedbackProfile {
  return {
    reviewCount: 0,
    ratingTotal: 0,
    helpfulCount: 0,
    notHelpfulCount: 0,
  };
}

function readFeedbackProfile(
  locale: "en" | "fr",
  userId?: string | null,
): StoredFeedbackProfile {
  try {
    const value = window.localStorage.getItem(
      feedbackProfileKey(locale, userId),
    );
    if (!value) return emptyFeedbackProfile();
    const parsed = JSON.parse(value) as Partial<StoredFeedbackProfile>;
    const reviewCount = Math.max(0, Number(parsed.reviewCount) || 0);
    const ratingTotal = Math.max(0, Number(parsed.ratingTotal) || 0);
    return {
      reviewCount,
      ratingTotal,
      averageRating: reviewCount ? ratingTotal / reviewCount : undefined,
      latestNote:
        typeof parsed.latestNote === "string"
          ? parsed.latestNote.slice(0, 600)
          : undefined,
      helpfulCount: Math.max(0, Number(parsed.helpfulCount) || 0),
      notHelpfulCount: Math.max(0, Number(parsed.notHelpfulCount) || 0),
    };
  } catch {
    return emptyFeedbackProfile();
  }
}

function storeFeedbackProfile(
  locale: "en" | "fr",
  userId: string | null | undefined,
  profile: StoredFeedbackProfile,
): void {
  try {
    window.localStorage.setItem(
      feedbackProfileKey(locale, userId),
      JSON.stringify(profile),
    );
  } catch {
    // The in-memory profile continues improving the active conversation.
  }
}

function readStoredTurns(locale: "en" | "fr"): ChatTurn[] {
  try {
    const value =
      window.localStorage.getItem(MEMORY_KEY) ||
      window.localStorage.getItem(legacyMemoryKey(locale));
    if (!value) return [];
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .slice(-MAX_STORED_TURNS)
      .filter((turn): turn is ChatTurn =>
        Boolean(
          turn &&
            typeof turn === "object" &&
            typeof turn.id === "string" &&
            (turn.role === "user" || turn.role === "assistant") &&
            typeof turn.content === "string",
        ),
      )
      .map((turn) => ({
        ...turn,
        content: turn.content.slice(0, 8_000),
      }));
  } catch {
    return [];
  }
}

function storeTurns(turns: ChatTurn[]): void {
  try {
    const persistentTurns = turns
      .filter((turn) => !turn.error)
      .slice(-MAX_STORED_TURNS);
    window.localStorage.setItem(MEMORY_KEY, JSON.stringify(persistentTurns));
  } catch {
    // Browser storage is optional; in-memory chat continues to work.
  }
}

function HumanAvatar({
  src,
  fallbackSrc,
  label,
  size = "h-9 w-9",
  rounded = "rounded-full",
}: {
  src?: string | null;
  fallbackSrc?: string | null;
  label: string;
  size?: string;
  rounded?: string;
}) {
  const [activeSrc, setActiveSrc] = useState(src || fallbackSrc || null);
  const monogram = label.trim().charAt(0).toUpperCase() || "?";

  useEffect(() => {
    setActiveSrc(src || fallbackSrc || null);
  }, [fallbackSrc, src]);

  if (activeSrc) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden border border-border/70",
          size,
          rounded,
        )}
      >
        <Image
          src={activeSrc}
          alt={label}
          fill
          sizes="40px"
          className="object-cover"
          onError={() => {
            if (activeSrc !== fallbackSrc && fallbackSrc) {
              setActiveSrc(fallbackSrc);
            } else {
              setActiveSrc(null);
            }
          }}
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
  const { user, openUserProfile } = useOptionalAuth();
  const { isMobile, setOpen, setOpenMobile } = useSidebar();
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const localeRef = useRef(locale);
  const loadedMemoryLocale = useRef<"en" | "fr" | null>(null);
  const requestSequence = useRef(0);
  const [retryText, setRetryText] = useState("");
  const [memoryReady, setMemoryReady] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewNote, setReviewNote] = useState("");
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewDismissedUntil, setReviewDismissedUntil] = useState(0);
  const [feedbackProfile, setFeedbackProfile] =
    useState<StoredFeedbackProfile>(emptyFeedbackProfile);

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
    loadedMemoryLocale.current = null;
    setMemoryReady(false);
    setTurns(readStoredTurns(locale));
    setRetryText("");
    loadedMemoryLocale.current = locale;
    setMemoryReady(true);
  }, [locale]);

  useEffect(() => {
    try {
      setReviewSubmitted(
        window.localStorage.getItem(reviewKey(locale, user?.id)) ===
          "submitted",
      );
    } catch {
      setReviewSubmitted(false);
    }
    setReviewOpen(false);
    setReviewRating(0);
    setReviewNote("");
    setReviewDismissedUntil(0);
    setFeedbackProfile(readFeedbackProfile(locale, user?.id));
  }, [locale, user?.id]);

  useEffect(() => {
    const questionCount = turns.filter((turn) => turn.role === "user").length;
    if (
      questionCount >= 5 &&
      questionCount > reviewDismissedUntil &&
      !reviewSubmitted
    ) {
      setReviewOpen(true);
    }
  }, [reviewDismissedUntil, reviewSubmitted, turns]);

  useEffect(() => {
    if (!memoryReady || loadedMemoryLocale.current !== locale) return;
    storeTurns(turns);
  }, [locale, memoryReady, turns]);

  useEffect(() => {
    if (busy) scrollToBottom();
  }, [busy, scrollToBottom]);

  useEffect(() => {
    if (localeRef.current === locale) return;
    localeRef.current = locale;
    requestSequence.current += 1;
    setInput("");
    setRetryText("");
    setBusy(false);
  }, [locale]);

  const send = async (text?: string) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || busy) return;
    const history = turns.filter((turn) => !turn.error);
    const next: ChatTurn[] = [
      ...history,
      {
        id: createTurnId("user"),
        role: "user",
        content: trimmed.slice(0, 4_000),
      },
    ];
    const requestId = ++requestSequence.current;
    const requestLocale = locale;
    setTurns(next);
    setInput("");
    setRetryText("");
    setBusy(true);
    scrollToBottom();
    try {
      const result: TwinChatResponse = await chatWithTwin(
        next.map((t) => ({
          role: t.role,
          content: t.content,
          webResearch: t.researched === true,
        })),
        profile,
        requestLocale,
        feedbackProfile,
      );
      if (
        requestId !== requestSequence.current ||
        requestLocale !== localeRef.current
      ) {
        return;
      }
      setTurns((prev) => [
        ...prev,
        {
          id: createTurnId("assistant"),
          role: "assistant",
          content: result.message,
          error: !result.ok,
          source: result.source,
          model: result.model,
          researched: result.researched,
          researchAttempted: result.researchAttempted,
          researchProvider: result.researchProvider,
          researchStatus: result.researchStatus,
          sources: result.sources,
        },
      ]);
    } catch {
      if (
        requestId !== requestSequence.current ||
        requestLocale !== localeRef.current
      ) {
        return;
      }
      setRetryText(trimmed);
      setTurns((prev) => [
        ...prev,
        {
          id: createTurnId("assistant"),
          role: "assistant",
          content: dict.chat.connectionError,
          error: true,
        },
      ]);
    } finally {
      if (requestId === requestSequence.current) {
        setBusy(false);
        inputRef.current?.focus();
      }
    }
  };

  const quickPromptKey = (
    key: (typeof QUICK_PROMPTS)[number],
  ): keyof typeof dict.chat => `${key}Prompt`;

  const clearConversation = () => {
    requestSequence.current += 1;
    setTurns([]);
    setInput("");
    setRetryText("");
    setBusy(false);
    try {
      window.localStorage.removeItem(MEMORY_KEY);
      window.localStorage.removeItem(legacyMemoryKey(locale));
    } catch {
      // Clearing in-memory history is still sufficient.
    }
  };

  const closeChat = () => {
    requestSequence.current += 1;
    setBusy(false);
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  const updateFeedbackProfile = (
    update: (current: StoredFeedbackProfile) => StoredFeedbackProfile,
  ) => {
    setFeedbackProfile((current) => {
      const next = update(current);
      storeFeedbackProfile(locale, user?.id, next);
      return next;
    });
  };

  const sendFeedback = async (
    turn: ChatTurn,
    rating: TwinFeedbackInput["rating"],
  ) => {
    if (turn.feedback || turn.error) return;
    const turnIndex = turns.findIndex((item) => item.id === turn.id);
    const question = [...turns]
      .slice(0, turnIndex)
      .reverse()
      .find((item) => item.role === "user")?.content;
    if (!question) return;

    setTurns((current) =>
      current.map((item) =>
        item.id === turn.id ? { ...item, feedback: rating } : item,
      ),
    );
    updateFeedbackProfile((current) => ({
      ...current,
      helpfulCount:
        (current.helpfulCount || 0) + (rating === "helpful" ? 1 : 0),
      notHelpfulCount:
        (current.notHelpfulCount || 0) + (rating === "not-helpful" ? 1 : 0),
    }));
    try {
      const result = await submitTwinFeedback({
        messageId: turn.id,
        rating,
        locale,
        question,
        answer: turn.content,
        source: turn.source,
        model: turn.model,
        researched: turn.researched,
        researchProvider: turn.researchProvider,
        researchSourceCount: turn.sources?.length,
      });
      setTurns((current) =>
        current.map((item) =>
          item.id === turn.id
            ? { ...item, feedbackPersisted: result.persisted }
            : item,
        ),
      );
    } catch {
      setTurns((current) =>
        current.map((item) =>
          item.id === turn.id ? { ...item, feedbackPersisted: false } : item,
        ),
      );
    }
  };

  const submitReview = async () => {
    if (reviewBusy || !reviewRating) return;
    setReviewBusy(true);
    try {
      const result = await submitTwinReview({
        rating: reviewRating,
        note: reviewNote,
        locale,
        questionCount: turns.filter((turn) => turn.role === "user").length,
        userId: user?.id,
        userName: user?.fullName || undefined,
        userEmail: user?.primaryEmail || undefined,
      });
      updateFeedbackProfile((current) => ({
        ...current,
        reviewCount: current.reviewCount + 1,
        ratingTotal: current.ratingTotal + reviewRating,
        averageRating:
          (current.ratingTotal + reviewRating) / (current.reviewCount + 1),
        latestNote: reviewNote.trim().slice(0, 600) || current.latestNote,
      }));
      try {
        window.localStorage.setItem(reviewKey(locale, user?.id), "submitted");
      } catch {
        // The submitted state still remains active for this session.
      }
      setReviewSubmitted(true);
      setReviewOpen(false);
      const response =
        reviewRating >= 4
          ? dict.chat.reviewThanksHigh
          : reviewRating === 3
            ? dict.chat.reviewThanksMedium
            : dict.chat.reviewThanksLow;
      const persistence = result.persisted
        ? dict.chat.reviewSaved
        : dict.chat.reviewSavedLocally;
      setTurns((current) => [
        ...current,
        {
          id: createTurnId("assistant"),
          role: "assistant",
          content: `${response}\n\n${persistence}`,
          reviewAcknowledgement: true,
        },
      ]);
    } finally {
      setReviewBusy(false);
    }
  };

  const customerName = user?.fullName || user?.primaryEmail || dict.chat.you;

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-background text-foreground md:border-r md:border-border/60">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="flex shrink-0 items-center gap-3 border-b border-border/60 bg-background px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4">
        <div className="shrink-0">
          <HumanAvatar src={profile?.profileImageUrl} label={ownerName} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{ownerName}</p>
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {dict.chat.availableOnline}
          </p>
        </div>
        {user ? (
          <button
            type="button"
            onClick={openUserProfile}
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={dict.chat.editProfile}
            title={dict.chat.editProfile}
          >
            <HumanAvatar
              src={user.imageUrl}
              fallbackSrc={profile?.visitorFallbackAvatarUrl}
              label={customerName}
              size="h-8 w-8"
            />
          </button>
        ) : null}
        {turns.length ? (
          <button
            type="button"
            onClick={clearConversation}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={dict.chat.clearHistory}
            title={dict.chat.clearHistory}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={closeChat}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={dict.misc.closeChat}
          title={dict.misc.closeChat}
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      {/* ── Messages ───────────────────────────────────────── */}
      <div
        ref={listRef}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-4 sm:py-5"
      >
        <AnimatePresence initial>
          {turns.length === 0 ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex min-h-full flex-col justify-center py-2"
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
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2.5">
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
                key={turn.id}
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
                    "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm sm:max-w-[80%] sm:px-4",
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
                    <>
                      <ChatMarkdown content={turn.content} />
                      {turn.sources?.length ? (
                        <div className="mt-3 border-t border-border/50 pt-2.5">
                          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
                            <Search className="h-3.5 w-3.5 text-primary" />
                            {dict.chat.verifiedSources}
                          </p>
                          <div className="grid gap-1.5">
                            {turn.sources.map((source, sourceIndex) => (
                              <a
                                key={`${turn.id}-${source.url}`}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex min-w-0 items-center gap-2 rounded-lg border border-border/60 bg-background/70 px-2.5 py-2 text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-muted"
                              >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-semibold text-primary">
                                  {sourceIndex + 1}
                                </span>
                                <span className="min-w-0 flex-1 truncate">
                                  {source.title}
                                </span>
                                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : turn.researchAttempted ? (
                        <p className="mt-2 border-t border-border/50 pt-2 text-[10px] text-muted-foreground">
                          {dict.chat.researchUnavailable}
                        </p>
                      ) : null}
                      {turn.error && retryText && i === turns.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => send(retryText)}
                          className="mt-2 inline-flex items-center gap-1.5 font-medium underline underline-offset-4"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          {dict.chat.retry}
                        </button>
                      ) : null}
                      {!turn.error && !turn.reviewAcknowledgement ? (
                        <div className="mt-2 flex items-center gap-1 border-t border-border/50 pt-2">
                          <span className="mr-1 text-[10px] text-muted-foreground">
                            {turn.feedback
                              ? turn.feedbackPersisted === false
                                ? dict.chat.feedbackSavedLocally
                                : dict.chat.feedbackThanks
                              : dict.chat.wasHelpful}
                          </span>
                          <button
                            type="button"
                            onClick={() => sendFeedback(turn, "helpful")}
                            disabled={Boolean(turn.feedback)}
                            className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-default",
                              turn.feedback === "helpful"
                                ? "bg-primary/10 text-primary"
                                : "",
                            )}
                            aria-label={dict.chat.helpful}
                            title={dict.chat.helpful}
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => sendFeedback(turn, "not-helpful")}
                            disabled={Boolean(turn.feedback)}
                            className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-default",
                              turn.feedback === "not-helpful"
                                ? "bg-destructive/10 text-destructive"
                                : "",
                            )}
                            aria-label={dict.chat.notHelpful}
                            title={dict.chat.notHelpful}
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>

                {turn.role === "user" &&
                  (user ? (
                    <HumanAvatar
                      src={user.imageUrl}
                      fallbackSrc={profile?.visitorFallbackAvatarUrl}
                      label={customerName}
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/70 bg-muted text-foreground/50">
                      <User className="h-4 w-4" />
                    </div>
                  ))}
              </motion.div>
            ))
          )}

          {reviewOpen ? (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
              aria-labelledby="twin-review-title"
            >
              <div className="mb-3">
                <p id="twin-review-title" className="text-sm font-semibold">
                  {dict.chat.reviewTitle}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {dict.chat.reviewSubtitle}
                </p>
              </div>
              <div
                className="mb-3 flex items-center gap-1"
                role="radiogroup"
                aria-label={dict.chat.reviewRating}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setReviewRating(value)}
                    className="rounded-md p-1 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`${value} / 5`}
                    aria-pressed={reviewRating === value}
                  >
                    <Star
                      className={cn(
                        "h-7 w-7",
                        value <= reviewRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/40",
                      )}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewNote}
                onChange={(event) => setReviewNote(event.target.value)}
                maxLength={2_000}
                placeholder={dict.chat.reviewPlaceholder}
                className="min-h-20 w-full resize-y rounded-xl border border-border/60 bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const questionCount = turns.filter(
                      (turn) => turn.role === "user",
                    ).length;
                    setReviewDismissedUntil(questionCount + 2);
                    setReviewOpen(false);
                  }}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {dict.chat.reviewLater}
                </button>
                <button
                  type="button"
                  onClick={submitReview}
                  disabled={!reviewRating || reviewBusy}
                  className="rounded-lg bg-foreground px-3 py-2 text-sm text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {reviewBusy
                    ? dict.chat.reviewSending
                    : dict.chat.reviewSubmit}
                </button>
              </div>
            </motion.section>
          ) : null}

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
                <span className="ml-2 text-[11px] text-muted-foreground">
                  {dict.chat.researching}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Composer ───────────────────────────────────────── */}
      <div className="shrink-0 border-t border-border/60 bg-background px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
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
              maxLength={4_000}
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
          {dict.chat.memoryNotice}
        </p>
      </div>
    </div>
  );
}

export default TwinChat;
