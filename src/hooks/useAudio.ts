"use client";

import { useState, useEffect, useRef } from "react";
import { playTone, resumeCtx } from "@/lib/sound/audioEngine";
import type { SortFrame } from "@/types/algorithm";

export function useAudio(frame: SortFrame | null, maxValue: number) {
  const [enabled, setEnabled] = useState(false);
  const prevFrameRef = useRef<SortFrame | null>(null);

  useEffect(() => {
    if (!enabled || !frame || frame === prevFrameRef.current) return;
    prevFrameRef.current = frame;

    const indices = frame.compared.length
      ? frame.compared
      : frame.swapped.length
      ? frame.swapped
      : [];

    if (indices.length > 0) {
      const value = frame.array[indices[0]];
      playTone(value, maxValue);
    }
  }, [frame, enabled, maxValue]);

  const toggle = () => {
    resumeCtx();
    setEnabled((v) => !v);
  };

  return { enabled, toggle };
}
