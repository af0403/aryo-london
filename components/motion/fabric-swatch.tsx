"use client";

import { useRef, useState, type PointerEvent } from "react";

export type FabricSwatchProps = {
  /** The cloth at arm's length. */
  swatch: string;
  /** The weave at macro. */
  macro: string;
  name: string;
};

/**
 * Fabric swatch in the product information column. Hover or keyboard focus
 * zooms the swatch into the macro over 1.2 s; on touch, press and hold.
 */
export const FabricSwatch = ({ swatch, macro, name }: FabricSwatchProps) => {
  const [held, setHeld] = useState(false);
  const pointerId = useRef<number | null>(null);

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse") return;
    pointerId.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    setHeld(true);
  };

  const release = (event: PointerEvent<HTMLButtonElement>) => {
    if (pointerId.current !== event.pointerId) return;
    pointerId.current = null;
    setHeld(false);
  };

  return (
    <button
      type="button"
      className={`fabric-swatch ${held ? "is-held" : ""}`}
      onPointerDown={onPointerDown}
      onPointerUp={release}
      onPointerCancel={release}
      onContextMenu={(event) => event.preventDefault()}
      aria-label={`${name} fabric. Hold to see the weave.`}
    >
      <span className="fabric-swatch-frame" aria-hidden="true">
        <img className="is-base" src={swatch} alt="" loading="lazy" decoding="async" />
        <img className="is-macro" src={macro} alt="" loading="lazy" decoding="async" />
      </span>
      <span className="fabric-swatch-copy">
        <span>Fabric</span>
        <span className="fabric-swatch-name">{name}</span>
      </span>
    </button>
  );
};
