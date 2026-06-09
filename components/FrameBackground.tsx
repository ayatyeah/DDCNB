"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

const FRAME_COUNT = 240;
const MAX_PIXEL_RATIO = 2;
const STORY_END_PROGRESS = 0.56;
const GLASS_FADE_DISTANCE = 0.18;
const PRELOAD_RADIUS = 18;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const frameSrcs = Array.from({ length: FRAME_COUNT }, (_, index) => {
  const frameNumber = String(index + 1).padStart(3, "0");
  return `/img/ezgif-frame-${frameNumber}.webp`;
});

function getClosestLoadedFrame(
  frames: Map<number, HTMLImageElement>,
  target: number,
) {
  const directFrame = frames.get(target);
  if (directFrame) return directFrame;

  for (let offset = 1; offset < FRAME_COUNT; offset += 1) {
    const previous = frames.get(target - offset);
    if (previous) return previous;

    const next = frames.get(target + offset);
    if (next) return next;
  }

  return undefined;
}

function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = width / height;

  let drawWidth = width;
  let drawHeight = height;

  if (imageRatio > canvasRatio) {
    drawHeight = height;
    drawWidth = height * imageRatio;
  } else {
    drawWidth = width;
    drawHeight = width / imageRatio;
  }

  context.drawImage(
    image,
    (width - drawWidth) / 2,
    (height - drawHeight) / 2,
    drawWidth,
    drawHeight,
  );
}

type FrameBackgroundProps = {
  progress: number;
};

export function FrameBackground({ progress }: FrameBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedFrames = useRef(new Map<number, HTMLImageElement>());
  const loadingFrames = useRef(new Set<number>());
  const renderedFrame = useRef(-1);
  const progressRef = useRef(progress);
  const rafRef = useRef(0);

  progressRef.current = progress;

  const getFrameIndex = () =>
    Math.round(
      clamp(progressRef.current / STORY_END_PROGRESS) * (FRAME_COUNT - 1),
    );

  const renderFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const frameIndex = getFrameIndex();
    const image = getClosestLoadedFrame(loadedFrames.current, frameIndex);
    if (!image) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    context.clearRect(0, 0, width, height);
    drawCover(context, image, width, height);
    renderedFrame.current = frameIndex;
  };

  const requestRenderIfNeeded = (frameIndex: number) => {
    const currentIndex = getFrameIndex();
    if (frameIndex === currentIndex && renderedFrame.current !== currentIndex) {
      renderFrame();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let animationFrame = 0;

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      renderFrame();
    };

    const tick = () => {
      const frameIndex = getFrameIndex();
      if (renderedFrame.current !== frameIndex) {
        renderFrame();
      }

      animationFrame = window.requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const frameIndex = getFrameIndex();

    const candidates = Array.from(
      { length: PRELOAD_RADIUS * 2 + 1 },
      (_, offset) => {
        const distance = offset % 2 === 0 ? offset / 2 : -(offset + 1) / 2;
        return frameIndex + distance;
      },
    ).filter((index) => index >= 0 && index < FRAME_COUNT);

    candidates.forEach((index) => {
      if (
        loadedFrames.current.has(index) ||
        loadingFrames.current.has(index)
      )
        return;

      loadingFrames.current.add(index);
      const image = new Image();
      image.decoding = "async";
      image.src = frameSrcs[index];
      image.onload = () => {
        loadingFrames.current.delete(index);
        if (cancelled) return;
        loadedFrames.current.set(index, image);
        requestRenderIfNeeded(index);
      };
      image.onerror = () => {
        loadingFrames.current.delete(index);
      };
    });

    return () => {
      cancelled = true;
    };
  }, [progress]);

  useEffect(() => {
    let cancelled = false;
    let nextFrame = 0;

    const preloadNext = () => {
      if (cancelled) return;

      while (
        nextFrame < FRAME_COUNT &&
        (loadedFrames.current.has(nextFrame) ||
          loadingFrames.current.has(nextFrame))
      ) {
        nextFrame += 1;
      }

      if (nextFrame >= FRAME_COUNT) return;

      const index = nextFrame;
      nextFrame += 1;
      loadingFrames.current.add(index);

      const image = new Image();
      image.decoding = "async";
      image.src = frameSrcs[index];
      image.onload = () => {
        loadingFrames.current.delete(index);
        if (!cancelled) {
          loadedFrames.current.set(index, image);
          window.setTimeout(preloadNext, 16);
        }
      };
      image.onerror = () => {
        loadingFrames.current.delete(index);
        if (!cancelled) {
          window.setTimeout(preloadNext, 16);
        }
      };
    };

    window.setTimeout(preloadNext, 120);

    return () => {
      cancelled = true;
    };
  }, []);

  const glassOpacity = clamp(
    (progress - STORY_END_PROGRESS) / GLASS_FADE_DISTANCE,
  );

  return (
    <div
      className="canvasShell"
      style={{ "--glass-opacity": glassOpacity } as CSSProperties}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="storyCanvas" />
      <div className="canvasShade" />
      <div className="glassBackdrop" />
    </div>
  );
}