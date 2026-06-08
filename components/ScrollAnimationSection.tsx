"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CanvasRenderer } from "@/components/CanvasRenderer";
import { FrameLoader } from "@/components/FrameLoader";
import { OverlayContent } from "@/components/OverlayContent";
import { ScrollController } from "@/components/ScrollController";

const SOURCE_FRAME_COUNT = 240;

function useFrameProfile() {
  const [profile, setProfile] = useState({ batchSize: 4, frameCount: 140 });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");

    const update = () => {
      setProfile(media.matches ? { batchSize: 3, frameCount: 96 } : { batchSize: 5, frameCount: 180 });
    };

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return profile;
}

export function ScrollAnimationSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameProfile = useFrameProfile();
  const [frameIndex, setFrameIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleFrameChange = useCallback((nextFrame: number) => {
    setFrameIndex((current) => (current === nextFrame ? current : nextFrame));
  }, []);

  const handleProgressChange = useCallback((nextProgress: number) => {
    setScrollProgress(nextProgress);
  }, []);

  return (
    <FrameLoader
      frameCount={frameProfile.frameCount}
      sourceFrameCount={SOURCE_FRAME_COUNT}
      batchSize={frameProfile.batchSize}
    >
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
              frameCount={frameProfile.frameCount}
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
