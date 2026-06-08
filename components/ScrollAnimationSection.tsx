"use client";

import { useCallback, useRef, useState } from "react";
import { CanvasRenderer } from "@/components/CanvasRenderer";
import { FrameLoader } from "@/components/FrameLoader";
import { OverlayContent } from "@/components/OverlayContent";
import { ScrollController } from "@/components/ScrollController";

const FRAME_COUNT = 240;

export function ScrollAnimationSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleFrameChange = useCallback((nextFrame: number) => {
    setFrameIndex((current) => (current === nextFrame ? current : nextFrame));
  }, []);

  const handleProgressChange = useCallback((nextProgress: number) => {
    setScrollProgress(nextProgress);
  }, []);

  return (
    <FrameLoader frameCount={FRAME_COUNT} batchSize={8}>
      {({ frames }) => (
        <main className="pageShell">
          <CanvasRenderer frames={frames} frameIndex={frameIndex} progress={scrollProgress} />

          <div className="progressTrack" aria-hidden="true">
            <div style={{ transform: `scaleX(${scrollProgress})` }} />
          </div>

          <section ref={sectionRef} className="scrollSection">
            <span id="services" className="servicesAnchor" aria-hidden="true" />
            <ScrollController
              enabled
              animationEndProgress={0.58}
              frameCount={FRAME_COUNT}
              sectionRef={sectionRef}
              onFrameChange={handleFrameChange}
              onProgressChange={handleProgressChange}
            />
            <OverlayContent progress={scrollProgress} />
          </section>

          <section id="about" className="afterSection">
            <p className="kicker">О центре</p>
            <h2>Лидер в цифровой трансформации финансовой инфраструктуры.</h2>
            <p>
              Миссия DDC - быть эталоном в цифровой трансформации, обеспечивая Национальный Банк
              и дочерние структуры надежными IT-решениями, безопасной инфраструктурой и устойчивыми сервисами.
            </p>
          </section>
        </main>
      )}
    </FrameLoader>
  );
}
