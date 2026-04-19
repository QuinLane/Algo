"use client";

import { useState, useRef, useEffect } from "react";
import type { PathfindingFrame } from "@/types/algorithm";
import type { GridData } from "@/lib/utils/gridUtils";
import { manhattanDistance } from "@/lib/utils/gridUtils";
import { playTone, playSuccessTone, playFailTone, resumeCtx } from "@/lib/sound/audioEngine";

export function useGridAudio(frame: PathfindingFrame | null, gridData: GridData | null) {
  const [enabled, setEnabled] = useState(false);
  const prevFrameRef = useRef<PathfindingFrame | null>(null);
  const resolvedRef = useRef(false);

  // Reset resolved flag when the grid/trace resets
  useEffect(() => {
    resolvedRef.current = false;
    prevFrameRef.current = null;
  }, [gridData]);

  useEffect(() => {
    if (!enabled || !frame || !gridData) return;
    if (frame === prevFrameRef.current) return;
    prevFrameRef.current = frame;

    const { startPos, rows, cols } = gridData;
    const maxDist = rows + cols;

    if (frame.path && frame.path.length > 0 && !resolvedRef.current) {
      resolvedRef.current = true;
      playSuccessTone();
      return;
    }

    if (frame.open.length === 0 && !frame.path && !resolvedRef.current) {
      resolvedRef.current = true;
      playFailTone();
      return;
    }

    if (frame.current) {
      const dist = manhattanDistance(frame.current, startPos);
      playTone(dist, maxDist, 200, 900);
    }
  }, [frame, enabled, gridData]);

  const toggle = () => {
    resumeCtx();
    setEnabled((v) => !v);
  };

  return { enabled, toggle };
}
