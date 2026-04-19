"use client";

import { useState, useEffect, useRef } from "react";
import { playTone, resumeCtx } from "@/lib/sound/audioEngine";
import type { SortFrame } from "@/types/algorithm";

// Left algorithm plays in the low octave, right in the high octave.
// Split at concert A (440 Hz) so the two voices never step on each other.
const LEFT_MIN = 110;
const LEFT_MAX = 440;
const RIGHT_MIN = 440;
const RIGHT_MAX = 1760;

function activeIndices(frame: SortFrame): number[] {
  if (frame.compared?.length) return frame.compared;
  if (frame.swapped?.length) return frame.swapped;
  return [];
}

export function useRaceAudio(
  leftFrame: SortFrame | null,
  rightFrame: SortFrame | null,
  maxValue: number
) {
  const [enabled, setEnabled] = useState(false);
  const prevLeftRef = useRef<SortFrame | null>(null);
  const prevRightRef = useRef<SortFrame | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (leftFrame && leftFrame !== prevLeftRef.current) {
      prevLeftRef.current = leftFrame;
      const idx = activeIndices(leftFrame);
      if (idx.length > 0) playTone(leftFrame.array[idx[0]], maxValue, LEFT_MIN, LEFT_MAX);
    }

    if (rightFrame && rightFrame !== prevRightRef.current) {
      prevRightRef.current = rightFrame;
      const idx = activeIndices(rightFrame);
      if (idx.length > 0) playTone(rightFrame.array[idx[0]], maxValue, RIGHT_MIN, RIGHT_MAX);
    }
  }, [leftFrame, rightFrame, enabled, maxValue]);

  const toggle = () => {
    resumeCtx();
    setEnabled((v) => !v);
  };

  return { enabled, toggle };
}
