"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
  type WheelEvent,
} from "react";

import type { Product } from "../lib/products";
import { CloseIcon } from "./site-icons";
import { useModal } from "./storefront/use-modal";

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
  const gallery = product.editorialImage
    ? [
        ...product.gallery,
        { ...product.editorialImage, type: "image" as const },
      ]
    : product.gallery;
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxTransform, setLightboxTransform] = useState<LightboxTransform>(
    {
      scale: 1,
      x: 0,
      y: 0,
    },
  );
  const dialogRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const suppressClickRef = useRef(false);
  const lightboxStageRef = useRef<HTMLDivElement>(null);
  const panStartRef = useRef<PanStart | null>(null);
  const pinchStartRef = useRef<PinchStart | null>(null);
  const media = gallery[activeIndex] ?? {
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

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setLightboxTransform({ scale: 1, x: 0, y: 0 });
    panStartRef.current = null;
    pinchStartRef.current = null;
  }, []);
  useModal(lightboxOpen, closeLightbox, dialogRef);
  const nextMedia = (direction: number) =>
    setActiveIndex(
      (index) => (index + direction + gallery.length) % gallery.length,
    );

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
          (getTouchDistance(event.touches[0], event.touches[1]) /
            pinchStartRef.current.distance),
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
    <section
      className="product-showcase"
      aria-label={`${product.name} gallery`}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          if (gallery.length > 1)
            nextMedia(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        swipeRef.current = { x: touch.clientX, y: touch.clientY };
      }}
      onTouchEnd={(event) => {
        const start = swipeRef.current;
        const touch = event.changedTouches[0];
        if (
          start &&
          gallery.length > 1 &&
          Math.abs(touch.clientX - start.x) > 45 &&
          Math.abs(touch.clientY - start.y) < 60
        ) {
          suppressClickRef.current = true;
          nextMedia(touch.clientX < start.x ? 1 : -1);
        }
        swipeRef.current = null;
      }}
    >
      <figure className="product-showcase-frame">
        <button
          className="product-showcase-frame-button"
          type="button"
          onClick={() => {
            if (suppressClickRef.current) {
              suppressClickRef.current = false;
              return;
            }
            setLightboxOpen(true);
          }}
          aria-label={`Open ${product.name} fullscreen`}
        >
          {gallery.length ? (
            gallery.map((item, index) =>
              item.type === "video" ? (
                index === activeIndex ? (
                  <video
                    key={item.src}
                    className="product-showcase-video store-gallery-layer is-active"
                    poster={item.poster ?? product.leadImage}
                    aria-label={item.alt}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={{
                      objectFit: "cover",
                      objectPosition: item.position ?? "center",
                    }}
                  >
                    <source src={item.src} type="video/mp4" />
                  </video>
                ) : null
              ) : (
                <Image
                  key={`${item.src}-${index}`}
                  className={`store-gallery-layer ${index === activeIndex ? "is-active" : ""}`}
                  aria-hidden={index !== activeIndex}
                  src={item.src}
                  alt={index === activeIndex ? item.alt : ""}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? undefined : "eager"}
                  sizes="(max-width: 820px) 100vw, 50vw"
                  style={{
                    objectFit: "cover",
                    objectPosition:
                      item.position ?? product.leadImagePosition ?? "center",
                  }}
                />
              ),
            )
          ) : (
            <Image
              src={product.leadImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 820px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          )}
        </button>
        {gallery.length > 1 ? (
          <>
            <button
              className="product-gallery-arrow product-gallery-arrow-prev"
              type="button"
              aria-label="Previous product image"
              onClick={() =>
                setActiveIndex(
                  (index) => (index - 1 + gallery.length) % gallery.length,
                )
              }
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              className="product-gallery-arrow product-gallery-arrow-next"
              type="button"
              aria-label="Next product image"
              onClick={() =>
                setActiveIndex((index) => (index + 1) % gallery.length)
              }
            >
              <span aria-hidden="true">›</span>
            </button>
            <span className="sr-only" aria-live="polite">
              Image {activeIndex + 1} of {gallery.length}
            </span>
          </>
        ) : null}
      </figure>

      {lightboxOpen
        ? createPortal(
            <div
              ref={dialogRef}
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
                        objectFit:
                          media.fit ?? product.leadImageFit ?? "contain",
                        objectPosition:
                          media.position ??
                          product.leadImagePosition ??
                          "center center",
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
                          objectFit:
                            media.fit ?? product.leadImageFit ?? "contain",
                          objectPosition:
                            media.position ??
                            product.leadImagePosition ??
                            "center center",
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="product-lightbox-foot">
                  {gallery.length > 1 ? (
                    <div className="product-lightbox-nav">
                      <button
                        type="button"
                        aria-label="Previous product image"
                        onClick={() => nextMedia(-1)}
                      >
                        <span aria-hidden="true">‹</span>
                      </button>
                      <button
                        type="button"
                        aria-label="Next product image"
                        onClick={() => nextMedia(1)}
                      >
                        <span aria-hidden="true">›</span>
                      </button>
                    </div>
                  ) : null}
                  <p className="product-lightbox-meta" aria-live="polite">
                    {activeIndex + 1} / {gallery.length}
                  </p>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
};
