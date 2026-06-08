"use client";

import { useEffect, useRef } from "react";

type CanvasRendererProps = {
  frames: Array<HTMLImageElement | undefined>;
  frameIndex: number;
  progress: number;
};

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

  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

function getRenderableFrame(frames: Array<HTMLImageElement | undefined>, index: number) {
  for (let offset = 0; offset < frames.length; offset += 1) {
    const back = frames[index - offset];
    if (back) return back;

    const forward = frames[index + offset];
    if (forward) return forward;
  }

  return undefined;
}

export function CanvasRenderer({ frames, frameIndex, progress }: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef(frames);
  const requestedFrame = useRef(frameIndex);
  const displayedFrame = useRef(frameIndex);
  const renderedFrame = useRef(-1);
  const progressRef = useRef(progress);

  useEffect(() => {
    framesRef.current = frames;
    requestedFrame.current = frameIndex;
    progressRef.current = progress;
  }, [frameIndex, frames, progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || frames.length === 0) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let rafId = 0;

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      renderedFrame.current = -1;
    };

    const render = () => {
      const targetFrame = requestedFrame.current;
      displayedFrame.current += (targetFrame - displayedFrame.current) * 0.28;
      const nextFrame = Math.round(displayedFrame.current);

      if (nextFrame !== renderedFrame.current) {
        const image = getRenderableFrame(framesRef.current, nextFrame);
        if (!image) {
          rafId = window.requestAnimationFrame(render);
          return;
        }

        const width = window.innerWidth;
        const height = window.innerHeight;

        context.clearRect(0, 0, width, height);
        drawCover(context, image, width, height);

        renderedFrame.current = nextFrame;
      }

      rafId = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [frames.length]);

  return (
    <div className="canvasShell" aria-hidden="true">
      <canvas ref={canvasRef} className="storyCanvas" />
      <div className="canvasShade" />
    </div>
  );
}
