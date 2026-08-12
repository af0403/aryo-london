"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type TouchEvent,
  type WheelEvent,
} from "react";

import type { Product } from "../lib/products";
import { CloseIcon } from "./site-icons";

type LightboxTransform = {
  scale: number;
  x: number;
  y: number;
};

type PanStart = {
  x: number;
  y: number;
  originX: number;
  originY: number;
};

type PinchStart = {
  distance: number;
  scale: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getTouchDistance = (
  first: { clientX: number; clientY: number },
  second: { clientX: number; clientY: number },
) => {
  return Math.hypot(
    second.clientX - first.clientX,
    second.clientY - first.clientY,
  );
};

export const ProductShowcase = ({ product }: { product: Product }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxTransform, setLightboxTransform] = useState<LightboxTransform>({
    scale: 1,
    x: 0,
    y: 0,
  });
  const lightboxStageRef = useRef<HTMLDivElement>(null);
  const panStartRef = useRef<PanStart | null>(null);
  const pinchStartRef = useRef<PinchStart | null>(null);
  const media = product.gallery[activeIndex] ?? {
    type: "image" as const,
    src: product.leadImage,
    alt: `${product.name} in ${product.color}`,
    fit: product.leadImageFit,
    position: product.leadImagePosition,
  };

  useEffect(() => {
    setLightboxTransform({ scale: 1, x: 0, y: 0 });
    panStartRef.current = null;
    pinchStartRef.current = null;
  }, [activeIndex]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen]);

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxTransform({ scale: 1, x: 0, y: 0 });
    panStartRef.current = null;
    pinchStartRef.current = null;
  };

  const clampTransform = (next: LightboxTransform) => {
    if (media.type === "video" || next.scale <= 1) {
      return { scale: 1, x: 0, y: 0 };
    }

    const stage = lightboxStageRef.current;
    if (!stage) return next;

    const rect = stage.getBoundingClientRect();
    const maxX = (rect.width * (next.scale - 1)) / 2;
    const maxY = (rect.height * (next.scale - 1)) / 2;

    return {
      scale: next.scale,
      x: clamp(next.x, -maxX, maxX),
      y: clamp(next.y, -maxY, maxY),
    };
  };

  const handleLightboxTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (media.type === "video") return;

    if (event.touches.length === 2) {
      pinchStartRef.current = {
        distance: getTouchDistance(event.touches[0], event.touches[1]),
        scale: lightboxTransform.scale,
      };
      panStartRef.current = null;
      return;
    }

    if (event.touches.length === 1 && lightboxTransform.scale > 1) {
      const touch = event.touches[0];
      panStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        originX: lightboxTransform.x,
        originY: lightboxTransform.y,
      };
    }
  };

  const handleLightboxTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (media.type === "video") return;

    if (event.touches.length === 2 && pinchStartRef.current) {
      event.preventDefault();
      const nextScale = clamp(
        pinchStartRef.current.scale *
          (
            getTouchDistance(event.touches[0], event.touches[1]) /
            pinchStartRef.current.distance
          ),
        1,
        4,
      );

      setLightboxTransform((current) =>
        clampTransform({
          scale: nextScale,
          x: current.x,
          y: current.y,
        }),
      );
      return;
    }

    if (
      event.touches.length === 1 &&
      panStartRef.current &&
      lightboxTransform.scale > 1
    ) {
      event.preventDefault();
      const touch = event.touches[0];
      const deltaX = touch.clientX - panStartRef.current.x;
      const deltaY = touch.clientY - panStartRef.current.y;

      setLightboxTransform(
        clampTransform({
          scale: lightboxTransform.scale,
          x: panStartRef.current.originX + deltaX,
          y: panStartRef.current.originY + deltaY,
        }),
      );
    }
  };

  const handleLightboxTouchEnd = () => {
    if (media.type === "video") return;

    if (lightboxTransform.scale <= 1) {
      setLightboxTransform({ scale: 1, x: 0, y: 0 });
    }

    panStartRef.current = null;
    pinchStartRef.current = null;
  };

  const handleLightboxWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (media.type === "video") return;

    event.preventDefault();

    const nextScale = clamp(
      lightboxTransform.scale + (event.deltaY < 0 ? 0.18 : -0.18),
      1,
      4,
    );

    setLightboxTransform((current) =>
      clampTransform({
        scale: nextScale,
        x: current.x,
        y: current.y,
      }),
    );
  };

  return (
    <section className="product-showcase reveal-block">
      <div className="product-showcase-media-column">
        {product.gallery.map((item, index) => (
          <figure className="product-showcase-frame" key={`${item.src}-${index}`}>
            <button
              className="product-showcase-frame-button"
              type="button"
              onClick={() => {
                setActiveIndex(index);
                setLightboxOpen(true);
              }}
              aria-label={`Open ${product.name} media ${index + 1} fullscreen`}
            >
              {item.type === "video" ? (
                <video
                  className="product-showcase-video"
                  poster={item.poster ?? product.leadImage}
                  aria-label={item.alt}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={{
                    objectFit: item.fit ?? product.leadImageFit ?? "cover",
                    objectPosition:
                      item.position ?? product.leadImagePosition ?? "center center",
                  }}
                >
                  <source src={item.src} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 820px) 100vw, 58vw"
                  style={{
                    objectFit: item.fit ?? product.leadImageFit ?? "cover",
                    objectPosition:
                      item.position ?? product.leadImagePosition ?? "center center",
                  }}
                />
              )}
            </button>
          </figure>
        ))}
      </div>

      {lightboxOpen ? (
        <div
          className="product-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} media viewer`}
        >
          <button
            className="product-lightbox-backdrop"
            type="button"
            onClick={closeLightbox}
            aria-label="Close fullscreen viewer"
          />

          <div className="product-lightbox-shell">
            <div className="product-lightbox-head">
              <p className="product-lightbox-meta">
                {activeIndex + 1} / {product.gallery.length}
              </p>
              <button
                className="product-lightbox-close"
                type="button"
                onClick={closeLightbox}
                aria-label="Close fullscreen viewer"
              >
                <CloseIcon className="site-icon" />
              </button>
            </div>

            <div
              className={`product-lightbox-stage ${
                media.type === "video" ? "is-video" : ""
              }`}
              ref={lightboxStageRef}
              onTouchStart={handleLightboxTouchStart}
              onTouchMove={handleLightboxTouchMove}
              onTouchEnd={handleLightboxTouchEnd}
              onTouchCancel={handleLightboxTouchEnd}
              onWheel={handleLightboxWheel}
            >
              {media.type === "video" ? (
                <video
                  key={`${media.src}-lightbox`}
                  className="product-lightbox-video"
                  poster={media.poster ?? product.leadImage}
                  aria-label={media.alt}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                  style={{
                    objectFit: media.fit ?? product.leadImageFit ?? "contain",
                    objectPosition:
                      media.position ?? product.leadImagePosition ?? "center center",
                  }}
                >
                  <source src={media.src} type="video/mp4" />
                </video>
              ) : (
                <div
                  className="product-lightbox-media"
                  style={{
                    transform: `translate3d(${lightboxTransform.x}px, ${lightboxTransform.y}px, 0) scale(${lightboxTransform.scale})`,
                  }}
                >
                  <Image
                    src={media.src}
                    alt={media.alt}
                    fill
                    priority
                    sizes="100vw"
                    style={{
                      objectFit: media.fit ?? product.leadImageFit ?? "contain",
                      objectPosition:
                        media.position ?? product.leadImagePosition ?? "center center",
                    }}
                  />
                </div>
              )}
            </div>

            <div className="product-lightbox-foot">
              <p>
                {media.type === "video"
                  ? "Tap outside to close."
                  : "Pinch to zoom. Tap outside to close."}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};
