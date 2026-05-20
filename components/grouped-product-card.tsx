"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { formatPrice } from "../lib/format";
import { getProduct, type Size } from "../lib/products";
import { useCart } from "./cart-provider";

export type Colorway = {
  color: string;
  slug: string;
  image: string;
  hoverImage?: string;
  hoverVideo?: string;
  hoverVideoPoster?: string;
  status: string;
};

export type ProductGroup = {
  name: string;
  category: string;
  price: number;
  editionNote?: string;
  colorways: Colorway[];
};

export const GroupedProductCard = ({ group }: { group: ProductGroup }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [picking, setPicking] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [hovering, setHovering] = useState(false);
  const hoverVideoRef = useRef<HTMLVideoElement | null>(null);
  const { addItem } = useCart();

  const active = group.colorways[activeIndex];
  const product = getProduct(active.slug);
  const imageGallery = product?.gallery.filter((item) => item.type !== "video") ?? [];
  const gallery = imageGallery.length
    ? imageGallery
    : [{ src: active.image, alt: `${group.name} in ${active.color}` }];
  const previewVideo =
    (active.hoverVideo
      ? {
          src: active.hoverVideo,
          poster: active.hoverVideoPoster ?? active.image,
          alt: `${group.name} in ${active.color} in motion`,
        }
      : undefined) ?? product?.gallery.find((item) => item.type === "video");
  const isSoldOut = active.status === "Sold out";
  const isMadeToOrder = product?.fulfillment === "made-to-order";

  const handleColorwayChange = (i: number) => {
    setActiveIndex(i);
    setPicking(false);
    setSelectedSize(null);
    setConfirmation(null);
    setImgIdx(0);
    setHovering(false);
    if (hoverVideoRef.current) {
      hoverVideoRef.current.pause();
      hoverVideoRef.current.currentTime = 0;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (previewVideo) return;
    if (gallery.length <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const zone = Math.floor((x / rect.width) * gallery.length);
    setImgIdx(Math.min(zone, gallery.length - 1));
  };

  const handleMouseEnter = () => {
    setHovering(true);
    if (previewVideo && hoverVideoRef.current) {
      hoverVideoRef.current.currentTime = 0;
      hoverVideoRef.current.play().catch(() => {});
      return;
    }
    if (gallery.length > 1) setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    setImgIdx(0);
    if (hoverVideoRef.current) {
      hoverVideoRef.current.pause();
      hoverVideoRef.current.currentTime = 0;
    }
  };

  const handleAddClick = () => {
    if (isSoldOut || !product) return;
    if (picking && selectedSize) {
      addItem({ slug: active.slug, size: selectedSize });
      setConfirmation(
        isMadeToOrder
          ? `Size ${selectedSize} — order placed. Allow ~3 weeks.`
          : `Size ${selectedSize} added to bag.`
      );
      setPicking(false);
      setSelectedSize(null);
      setTimeout(() => setConfirmation(null), 4000);
    } else {
      setPicking(true);
    }
  };

  const variantIsUnavailable = (size: Size) => {
    if (!product) return true;
    const v = product.variants.find((vv) => vv.size === size);
    if (!v) return true;
    return typeof v.stock === "number" && v.stock <= 0;
  };

  return (
    <article className="collection-card">
      <div className="collection-card-head">
        <span>Pennicella</span>
      </div>

      <Link
        className="collection-card-media"
        href={`/products/${active.slug}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {gallery.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={i === 0 ? `${group.name} in ${active.color}` : ""}
            aria-hidden={i !== 0 || undefined}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{
              opacity: previewVideo ? (i === 0 ? 1 : 0) : i === imgIdx ? 1 : 0,
              objectFit: img.fit ?? "cover",
              objectPosition: img.position ?? "top center",
            }}
          />
        ))}
        {previewVideo ? (
          <video
            ref={hoverVideoRef}
            className={`collection-card-hover-video ${hovering ? "is-visible" : ""}`}
            poster={previewVideo.poster ?? active.image}
            aria-label={previewVideo.alt}
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={previewVideo.src} type="video/mp4" />
          </video>
        ) : null}
      </Link>

      <div className="collection-card-copy">
        <strong>
          <Link href={`/products/${active.slug}`}>{group.name}</Link>
        </strong>
        <span className="collection-card-price">{formatPrice(group.price)} GBP</span>
        {group.editionNote ? (
          <em className="collection-card-edition">{group.editionNote}</em>
        ) : null}

        {active.status !== "Available" && !picking ? (
          <em className="collection-card-status">{active.status}</em>
        ) : null}

        <div className="collection-card-colorways">
          {group.colorways.map((colorway, i) => (
            <button
              key={colorway.slug}
              className={`collection-card-colorway ${i === activeIndex ? "is-active" : ""}`}
              type="button"
              onClick={() => handleColorwayChange(i)}
            >
              {colorway.color}
            </button>
          ))}
        </div>

        {picking && product ? (
          <div className="card-size-picker">
            {product.variants.map((variant) => {
              const unavailable = variantIsUnavailable(variant.size);
              return (
                <button
                  key={variant.id}
                  className={`card-size-pill ${variant.size === selectedSize ? "is-active" : ""} ${unavailable ? "is-unavailable" : ""}`}
                  type="button"
                  disabled={unavailable}
                  onClick={() => !unavailable && setSelectedSize(variant.size)}
                >
                  {variant.size}
                </button>
              );
            })}
          </div>
        ) : null}

        {confirmation ? (
          <p className="card-confirm">{confirmation}</p>
        ) : !isSoldOut ? (
          <button
            className="card-add-button"
            type="button"
            onClick={handleAddClick}
            disabled={picking && !selectedSize}
          >
            {picking
              ? selectedSize
                ? isMadeToOrder
                  ? "Confirm order"
                  : "Add to bag"
                : "Select a size"
              : isMadeToOrder
                ? "Order now"
                : "Add to bag"}
          </button>
        ) : null}
      </div>
    </article>
  );
};
