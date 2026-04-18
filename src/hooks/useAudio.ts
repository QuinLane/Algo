"use client";

import { useState, useEffect, useRef } from "react";
import { playTone, resumeCtx } from "@/lib/sound/audioEngine";
import type { SortFrame, SearchFrame } from "@/types/algorithm";

type AudioFrame = SortFrame | SearchFrame | null;

export function useAudio(frame: AudioFrame, maxValue: number) {
  const [enabled, setEnabled] = useState(false);
  const prevFrameRef = useRef<AudioFrame>(null);

  useEffect(() => {
    if (!enabled || !frame || frame === prevFrameRef.current) return;
    prevFrameRef.current = frame;

    const searchFrame = frame as SearchFrame;
    if (searchFrame.current !== undefined && !("compared" in frame)) {
      playTone(frame.array[searchFrame.current] ?? searchFrame.current, maxValue);
      return;
    }

    const sortFrame = frame as SortFrame;
    const indices = sortFrame.compared?.length
      ? sortFrame.compared
      : sortFrame.swapped?.length
      ? sortFrame.swapped
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
