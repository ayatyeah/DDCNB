"use client";

import { RefObject, useEffect } from "react";

type ScrollControllerProps = {
  enabled: boolean;
  animationEndProgress?: number;
  frameCount: number;
  sectionRef: RefObject<HTMLElement | null>;
  onFrameChange: (frameIndex: number) => void;
  onProgressChange: (progress: number) => void;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function ScrollController({
  enabled,
  animationEndProgress = 1,
  frameCount,
  sectionRef,
  onFrameChange,
  onProgressChange,
}: ScrollControllerProps) {
  useEffect(() => {
    if (!enabled) return;

    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / scrollableDistance);
      const frameProgress = clamp(progress / animationEndProgress);
      const frameIndex = Math.min(frameCount - 1, Math.round(frameProgress * (frameCount - 1)));

      onProgressChange(progress);
      onFrameChange(frameIndex);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [animationEndProgress, enabled, frameCount, onFrameChange, onProgressChange, sectionRef]);

  return null;
}
