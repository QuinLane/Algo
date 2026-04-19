"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { DPTrace, DPFrame } from "@/types/algorithm";

export type PlayerState = "idle" | "playing" | "paused" | "done";

const SPEED_MS: Record<number, number> = {
  0.25: 800,
  0.5: 400,
  1: 200,
  2: 80,
  4: 30,
};

export function useDPPlayer(trace: DPTrace | null) {
  const [step, setStep] = useState(0);
  const [playerState, setPlayerState] = useState<PlayerState>("idle");
  const [speed, setSpeed] = useState<number>(1);

  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const stepRef = useRef(0);
  const traceRef = useRef(trace);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    stopRaf();
    traceRef.current = trace;
    setStep(0);
    stepRef.current = 0;
    setPlayerState("idle");
  }, [trace, stopRaf]);

  const tick = useCallback(
    (timestamp: number) => {
      const delay = SPEED_MS[speed] ?? 200;
      if (timestamp - lastTickRef.current >= delay) {
        lastTickRef.current = timestamp;
        const total = traceRef.current?.frames.length ?? 0;
        const next = stepRef.current + 1;
        if (next >= total) {
          stepRef.current = total - 1;
          setStep(total - 1);
          setPlayerState("done");
          return;
        }
        stepRef.current = next;
        setStep(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    },
    [speed]
  );

  const play = useCallback(() => {
    if (!trace || trace.frames.length === 0) return;
    if (stepRef.current >= trace.frames.length - 1) {
      stepRef.current = 0;
      setStep(0);
    }
    setPlayerState("playing");
    lastTickRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  }, [trace, tick]);

  const pause = useCallback(() => {
    stopRaf();
    setPlayerState("paused");
  }, [stopRaf]);

  const stepForward = useCallback(() => {
    stopRaf();
    setPlayerState("paused");
    const total = traceRef.current?.frames.length ?? 0;
    const next = Math.min(stepRef.current + 1, total - 1);
    stepRef.current = next;
    setStep(next);
    if (next === total - 1) setPlayerState("done");
  }, [stopRaf]);

  const stepBack = useCallback(() => {
    stopRaf();
    setPlayerState("paused");
    const prev = Math.max(stepRef.current - 1, 0);
    stepRef.current = prev;
    setStep(prev);
  }, [stopRaf]);

  const scrubTo = useCallback(
    (s: number) => {
      stopRaf();
      setPlayerState("paused");
      const clamped = Math.max(0, Math.min(s, (trace?.frames.length ?? 1) - 1));
      stepRef.current = clamped;
      setStep(clamped);
    },
    [stopRaf, trace]
  );

  const reset = useCallback(() => {
    stopRaf();
    stepRef.current = 0;
    setStep(0);
    setPlayerState("idle");
  }, [stopRaf]);

  useEffect(() => {
    if (playerState === "playing") {
      stopRaf();
      lastTickRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [speed]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => stopRaf(), [stopRaf]);

  const frame: DPFrame | null = trace?.frames[step] ?? null;
  const totalSteps = trace?.frames.length ?? 0;

  return { step, totalSteps, frame, playerState, speed, setSpeed, play, pause, stepForward, stepBack, scrubTo, reset };
}
