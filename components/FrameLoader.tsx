"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type FrameLoaderProps = {
  frameCount: number;
  sourceFrameCount?: number;
  batchSize?: number;
  basePath?: string;
  children: (state: {
    frames: Array<HTMLImageElement | undefined>;
    loaded: boolean;
    loadedCount: number;
    progress: number;
    sources: string[];
  }) => React.ReactNode;
};

const makeFrameSrc = (basePath: string, sourceIndex: number) =>
  `${basePath}/frame-${String(sourceIndex + 1).padStart(4, "0")}.webp`;

const waitForIdle = () =>
  new Promise<void>((resolve) => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => resolve(), { timeout: 90 });
      return;
    }

    globalThis.setTimeout(resolve, 24);
  });

export function FrameLoader({
  frameCount,
  sourceFrameCount = frameCount,
  batchSize = 8,
  basePath = "/frames",
  children,
}: FrameLoaderProps) {
  const sources = useMemo(
    () =>
      Array.from({ length: frameCount }, (_, index) => {
        const sourceIndex =
          frameCount <= 1
            ? 0
            : Math.round((index * (sourceFrameCount - 1)) / (frameCount - 1));

        return makeFrameSrc(basePath, sourceIndex);
      }),
    [basePath, frameCount, sourceFrameCount],
  );
  const [frames, setFrames] = useState<Array<HTMLImageElement | undefined>>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    const loadedFrames: Array<HTMLImageElement | undefined> = new Array(frameCount);

    const loadImage = (src: string, index: number) =>
      new Promise<void>((resolve) => {
        const image = new Image();
        image.decoding = "async";
        if ("fetchPriority" in image) {
          image.fetchPriority = index < batchSize ? "high" : "low";
        }
        image.onload = () => {
          loadedFrames[index] = image;
          setLoadedCount((count) => count + 1);
          resolve();
        };
        image.onerror = () => resolve();
        image.src = src;
      });

    const loadBatches = async () => {
      setLoadedCount(0);
      setFrames([]);

      for (let start = 0; start < sources.length; start += batchSize) {
        if (cancelled.current) return;

        const batch = sources.slice(start, start + batchSize);
        await Promise.all(batch.map((src, offset) => loadImage(src, start + offset)));
        setFrames([...loadedFrames]);
        await waitForIdle();
      }

      if (!cancelled.current) {
        setFrames([...loadedFrames]);
      }
    };

    loadBatches();

    return () => {
      cancelled.current = true;
    };
  }, [batchSize, frameCount, sources]);

  const progress = frameCount === 0 ? 0 : loadedCount / frameCount;

  return children({
    frames,
    loaded: loadedCount === frameCount,
    loadedCount,
    progress,
    sources,
  });
}
