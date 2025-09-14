"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import "./BlobCursor.css";

interface BlobCursorProps {
  blobType?: "circle" | "square";
  fillColor?: string;
  trailCount?: number;
  sizes?: number[];
  innerSizes?: number[];
  innerColor?: string;
  opacities?: number[];
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  filterId?: string;
  filterStdDeviation?: number;
  filterColorMatrixValues?: string;
  useFilter?: boolean;
  fastDuration?: number;
  slowDuration?: number;
  fastEase?: string;
  slowEase?: string;
  zIndex?: number;
}

export default function BlobCursor({
  blobType = "circle",
  fillColor = "#06b6d4",
  trailCount = 3,
  sizes = [40, 80, 50],
  innerSizes = [15, 25, 18],
  innerColor = "rgba(255,255,255,0.9)",
  opacities = [0.8, 0.6, 0.4],
  shadowColor = "rgba(6,182,212,0.3)",
  shadowBlur = 15,
  shadowOffsetX = 0,
  shadowOffsetY = 0,
  filterId = "blob",
  filterStdDeviation = 20,
  filterColorMatrixValues = "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 25 -10",
  useFilter = true,
  fastDuration = 0.1,
  slowDuration = 0.3,
  fastEase = "power3.out",
  slowEase = "power1.out",
  zIndex = 100,
}: BlobCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<(HTMLDivElement | null)[]>([]);

  const updateOffset = useCallback(() => {
    if (!containerRef.current) return { left: 0, top: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return { left: rect.left, top: rect.top };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const { left, top } = updateOffset();
      const x = e.clientX - left;
      const y = e.clientY - top;

      blobsRef.current.forEach((blob, index) => {
        if (!blob) return;
        
        const isLast = index === blobsRef.current.length - 1;
        const duration = isLast ? fastDuration : slowDuration;
        const ease = isLast ? fastEase : slowEase;

        gsap.to(blob, {
          x: x + shadowOffsetX,
          y: y + shadowOffsetY,
          duration,
          ease,
        });
      });
    },
    [updateOffset, shadowOffsetX, shadowOffsetY, fastDuration, slowDuration, fastEase, slowEase]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const { left, top } = updateOffset();
      const touch = e.touches[0];
      const x = touch.clientX - left;
      const y = touch.clientY - top;

      blobsRef.current.forEach((blob, index) => {
        if (!blob) return;
        
        const isLast = index === blobsRef.current.length - 1;
        const duration = isLast ? fastDuration : slowDuration;
        const ease = isLast ? fastEase : slowEase;

        gsap.to(blob, {
          x: x + shadowOffsetX,
          y: y + shadowOffsetY,
          duration,
          ease,
        });
      });
    },
    [updateOffset, fastDuration, slowDuration, fastEase, slowEase, shadowOffsetX, shadowOffsetY]
  );

  useEffect(() => {
    const onResize = () => updateOffset();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateOffset]);

  return (
    <div
      ref={containerRef}
      className="blob-container"
      style={{ zIndex }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {useFilter && (
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <filter id={filterId}>
            <feGaussianBlur
              in="SourceGraphic"
              result="blur"
              stdDeviation={filterStdDeviation}
            />
            <feColorMatrix in="blur" values={filterColorMatrixValues} />
          </filter>
        </svg>
      )}

      <div
        className="blob-main"
        style={{ filter: useFilter ? `url(#${filterId})` : undefined }}
      >
        {Array.from({ length: trailCount }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              blobsRef.current[i] = el;
            }}
            className="blob"
            style={{
              width: sizes[i],
              height: sizes[i],
              borderRadius: blobType === "circle" ? "50%" : "0%",
              backgroundColor: fillColor,
              opacity: opacities[i],
              boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`,
            }}
          >
            <div
              className="inner-dot"
              style={{
                width: innerSizes[i],
                height: innerSizes[i],
                top: (sizes[i] - innerSizes[i]) / 2,
                left: (sizes[i] - innerSizes[i]) / 2,
                backgroundColor: innerColor,
                borderRadius: blobType === "circle" ? "50%" : "0%",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}