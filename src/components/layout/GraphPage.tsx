"use client";

import { useState, useEffect, useCallback } from "react";
import type { AlgorithmMeta, GraphTrace } from "@/types/algorithm";
import type { GraphData } from "@/lib/utils/graphUtils";
import { generateRandomGraph } from "@/lib/utils/graphUtils";
import { useGraphPlayer } from "@/hooks/useGraphPlayer";
import GraphVisualizer from "@/components/visualizer/GraphVisualizer";
import PlayerControls from "@/components/controls/PlayerControls";
import StepScrubber from "@/components/controls/StepScrubber";

interface Props {
  meta: AlgorithmMeta;
  generateTrace: (data: GraphData) => GraphTrace;
  weighted?: boolean;
}

export default function GraphPage({ meta, generateTrace, weighted = false }: Props) {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [trace, setTrace] = useState<GraphTrace | null>(null);

  const { step, totalSteps, frame, playerState, speed, setSpeed, play, pause, stepForward, stepBack, scrubTo, reset } =
    useGraphPlayer(trace);

  const buildGraph = useCallback(() => {
    const data = generateRandomGraph(8, 11, weighted);
    setGraphData(data);
    setTrace(generateTrace(data));
    reset();
  }, [generateTrace, weighted, reset]);

  useEffect(() => { buildGraph(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const nodesVisited = trace?.nodesVisited ?? 0;
  const edgesRelaxed = trace?.edgesRelaxed ?? 0;
  const startId = graphData?.startId ?? "A";

  return (
    <div className="p-6 max-w-4xl flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{meta.name}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{meta.description}</p>
      </div>

      <div className="flex flex-wrap gap-6 px-4 py-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
        {[
          { label: "Start", value: startId },
          { label: "Time", value: meta.timeComplexity },
          { label: "Space", value: meta.spaceComplexity },
          { label: "Nodes visited", value: nodesVisited },
          { label: "Edges relaxed", value: edgesRelaxed },
          { label: "Step", value: `${step + 1} / ${totalSteps || 1}` },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">{label}</span>
            <span className="text-sm font-mono text-[var(--color-text-primary)]">{value}</span>
          </div>
        ))}
      </div>

      <GraphVisualizer frame={frame} showDistances={weighted} />

      <div className="flex flex-col gap-3 p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <PlayerControls
            playerState={playerState}
            speed={speed}
            soundEnabled={false}
            onPlay={play}
            onPause={pause}
            onStepBack={stepBack}
            onStepForward={stepForward}
            onSpeedChange={setSpeed}
            onSoundToggle={() => {}}
          />
          <button
            onClick={buildGraph}
            className="px-3 py-1.5 rounded text-xs bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors font-mono"
          >
            New Graph
          </button>
        </div>
        <StepScrubber step={step} totalSteps={totalSteps} onScrub={scrubTo} />
      </div>
    </div>
  );
}
