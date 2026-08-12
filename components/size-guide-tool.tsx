"use client";

import { useState, type FormEvent } from "react";

type CategoryKey = "tops" | "bottoms" | "headwear" | "shoes";
type FitKey = "close" | "regular" | "relaxed";

type Field = {
  key: string;
  label: string;
  unit: string;
  placeholder: string;
  hint: string;
};

type ReferenceRow = {
  size: string;
  values: Record<string, string>;
};

type CategoryDefinition = {
  label: string;
  eyebrow: string;
  description: string;
  fields: Field[];
  rows: ReferenceRow[];
  bases: Record<string, number>;
  unit: string;
};

const fitOptions: { key: FitKey; label: string; description: string }[] = [
  { key: "close", label: "Close", description: "A neater silhouette, closer to the body." },
  { key: "regular", label: "Regular", description: "The intended ARYO everyday fit." },
  { key: "relaxed", label: "Relaxed", description: "More ease through the garment." },
];

const categoryDefinitions: Record<CategoryKey, CategoryDefinition> = {
  tops: {
    label: "Tops",
    eyebrow: "Ready-to-wear",
    description: "Use your body measurements for shirts, jackets, knitwear and outerwear.",
    fields: [
      {
        key: "chest",
        label: "Chest",
        unit: "cm",
        placeholder: "96",
        hint: "Measure around the fullest part of your chest.",
      },
      {
        key: "waist",
        label: "Waist",
        unit: "cm",
        placeholder: "82",
        hint: "Measure around your natural waist.",
      },
    ],
    rows: [
      { size: "XS", values: { chest: "86-90", waist: "70-74" } },
      { size: "S", values: { chest: "90-94", waist: "74-78" } },
      { size: "M", values: { chest: "94-100", waist: "78-84" } },
      { size: "L", values: { chest: "100-106", waist: "84-90" } },
      { size: "XL", values: { chest: "106-112", waist: "90-96" } },
    ],
    bases: { chest: 88, waist: 72 },
    unit: "cm",
  },
  bottoms: {
    label: "Bottoms",
    eyebrow: "Trousers and shorts",
    description: "Use your waist and seat measurements for trousers, shorts and future bottoms.",
    fields: [
      {
        key: "waist",
        label: "Waist",
        unit: "cm",
        placeholder: "82",
        hint: "Measure where you normally wear the waistband.",
      },
      {
        key: "seat",
        label: "Seat",
        unit: "cm",
        placeholder: "98",
        hint: "Measure around the fullest part of your seat.",
      },
      {
        key: "insideLeg",
        label: "Inside leg",
        unit: "cm",
        placeholder: "81",
        hint: "Measure from the crotch to the ankle.",
      },
    ],
    rows: [
      { size: "XS", values: { waist: "68-72", seat: "86-90", insideLeg: "79" } },
      { size: "S", values: { waist: "72-76", seat: "90-94", insideLeg: "80" } },
      { size: "M", values: { waist: "76-82", seat: "94-100", insideLeg: "81" } },
      { size: "L", values: { waist: "82-88", seat: "100-106", insideLeg: "82" } },
      { size: "XL", values: { waist: "88-94", seat: "106-112", insideLeg: "83" } },
    ],
    bases: { waist: 70, seat: 88, insideLeg: 79 },
    unit: "cm",
  },
  headwear: {
    label: "Headwear",
    eyebrow: "Beanies and caps",
    description: "Measure around your head for beanies, caps and future ARYO headwear.",
    fields: [
      {
        key: "head",
        label: "Head circumference",
        unit: "cm",
        placeholder: "57",
        hint: "Measure around your head just above the ears and eyebrows.",
      },
    ],
    rows: [
      { size: "S", values: { head: "54-55" } },
      { size: "M", values: { head: "56-57" } },
      { size: "L", values: { head: "58-59" } },
      { size: "XL", values: { head: "60-61" } },
    ],
    bases: { head: 54.5 },
    unit: "cm",
  },
  shoes: {
    label: "Shoes",
    eyebrow: "Footwear",
    description: "Use your foot length to find an initial UK size. Always allow for the intended fit.",
    fields: [
      {
        key: "foot",
        label: "Foot length",
        unit: "cm",
        placeholder: "27",
        hint: "Measure from heel to the longest toe while standing.",
      },
    ],
    rows: [
      { size: "UK 6", values: { foot: "25.0" } },
      { size: "UK 7", values: { foot: "25.7" } },
      { size: "UK 8", values: { foot: "26.4" } },
      { size: "UK 9", values: { foot: "27.1" } },
      { size: "UK 10", values: { foot: "27.8" } },
      { size: "UK 11", values: { foot: "28.5" } },
      { size: "UK 12", values: { foot: "29.2" } },
    ],
    bases: { foot: 25 },
    unit: "cm",
  },
};

const categories = Object.keys(categoryDefinitions) as CategoryKey[];

const rangeMidpoint = (value: string) => {
  const numbers = value.split("-").map(Number);
  return numbers.length === 2 ? (numbers[0] + numbers[1]) / 2 : numbers[0];
};

export function SizeGuideTool() {
  const [category, setCategory] = useState<CategoryKey>("tops");
  const [fit, setFit] = useState<FitKey>("regular");
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<{
    size: string;
    detail: string;
  } | null>(null);

  const active = categoryDefinitions[category];
  const primaryField = active.fields[0];

  const selectCategory = (nextCategory: CategoryKey) => {
    setCategory(nextCategory);
    setRecommendation(null);
    setMeasurements({});
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = Number(measurements[primaryField.key]);
    if (!Number.isFinite(value)) return;

    const fitAdjustment = category === "tops" || category === "bottoms"
      ? fit === "close" ? -2 : fit === "relaxed" ? 2 : 0
      : 0;
    const target = value + fitAdjustment;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    active.rows.forEach((row, index) => {
      const distance = Math.abs(rangeMidpoint(row.values[primaryField.key]) - target);
      if (distance < nearestDistance) {
        nearestIndex = index;
        nearestDistance = distance;
      }
    });

    const row = active.rows[nearestIndex];
    const fitText = category === "tops" || category === "bottoms" ? ` and a ${fit} fit` : "";
    setRecommendation({
      size: row.size,
      detail: `Based on a ${value} ${primaryField.unit} ${primaryField.label.toLowerCase()}${fitText}. Use the product-specific measurements below as the final reference.`,
    });
  };

  return (
    <div className="size-guide-tool">
      <div className="size-guide-tabs" role="tablist" aria-label="Choose a product category">
        {categories.map((key) => (
          <button
            className="size-guide-tab"
            type="button"
            role="tab"
            aria-selected={category === key}
            key={key}
            onClick={() => selectCategory(key)}
          >
            {categoryDefinitions[key].label}
          </button>
        ))}
      </div>

      <div className="size-guide-form-panel">
        <div>
          <p className="eyebrow">{active.eyebrow}</p>
          <h2>Find your ARYO size.</h2>
          <p>{active.description}</p>

          <form className="size-guide-form" onSubmit={handleSubmit}>
            <div className="size-guide-fields">
              {active.fields.map((field) => (
                <label className="size-guide-field" key={field.key}>
                  <span>{field.label}</span>
                  <div className="size-guide-input-wrap">
                    <input
                      type="number"
                      inputMode="decimal"
                      min="1"
                      step="0.1"
                      required={field.key === primaryField.key}
                      placeholder={field.placeholder}
                      value={measurements[field.key] ?? ""}
                      onChange={(event) =>
                        setMeasurements((current) => ({ ...current, [field.key]: event.target.value }))
                      }
                      aria-describedby={`${field.key}-hint`}
                    />
                    <span>{field.unit}</span>
                  </div>
                  <small id={`${field.key}-hint`}>{field.hint}</small>
                </label>
              ))}
            </div>

            {(category === "tops" || category === "bottoms") && (
              <fieldset className="size-guide-fit">
                <legend>How do you like it to fit?</legend>
                <div>
                  {fitOptions.map((option) => (
                    <label key={option.key}>
                      <input
                        type="radio"
                        name="fit"
                        value={option.key}
                        checked={fit === option.key}
                        onChange={() => setFit(option.key)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <p>{fitOptions.find((option) => option.key === fit)?.description}</p>
              </fieldset>
            )}

            <button className="button button-dark size-guide-submit" type="submit">
              Find my size
            </button>
          </form>
        </div>

        <div className={`size-guide-result ${recommendation ? "is-ready" : ""}`} aria-live="polite">
          {recommendation ? (
            <>
              <p className="eyebrow">Your recommendation</p>
              <strong>{recommendation.size}</strong>
              <p>{recommendation.detail}</p>
            </>
          ) : (
            <>
              <p className="eyebrow">Fit guidance</p>
              <strong>Enter your measurements.</strong>
              <p>Your result is a starting point. Each product page will carry its own exact garment measurements.</p>
            </>
          )}
        </div>
      </div>

      <section className="size-guide-reference" aria-labelledby="reference-heading">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Reference tables</p>
            <h2 id="reference-heading">Body measurements by category.</h2>
          </div>
          <p>All measurements are approximate. For a product-specific fit, use the table on that item page.</p>
        </div>

        <div className="size-guide-reference-grid">
          {categories.map((key) => {
            const definition = categoryDefinitions[key];
            return (
              <article className="size-guide-reference-card" key={key}>
                <p className="eyebrow">{definition.eyebrow}</p>
                <h3>{definition.label}</h3>
                <div className="size-guide-table-wrap">
                  <table className="size-guide-table">
                    <thead>
                      <tr>
                        <th>Size</th>
                        {definition.fields.map((field) => <th key={field.key}>{field.label} ({field.unit})</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {definition.rows.map((row) => (
                        <tr key={row.size}>
                          <td><strong>{row.size}</strong></td>
                          {definition.fields.map((field) => <td key={field.key}>{row.values[field.key]}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="size-guide-reference size-guide-garment-reference" aria-labelledby="garment-heading">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Pennicella | AF by ARYO</p>
            <h2 id="garment-heading">Pennicella Jacket garment measurements.</h2>
          </div>
          <p>Measurements are taken from the garment and may vary slightly by production run.</p>
        </div>
        <div className="size-guide-table-wrap">
          <table className="size-guide-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest (cm)</th>
                <th>Chest (in)</th>
                <th>Waist (cm)</th>
                <th>Waist (in)</th>
                <th>Length (cm)</th>
                <th>Length (in)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["XS", 86, 34, 76, 30, 68, 27],
                ["S", 90, 35, 80, 31, 69, 27],
                ["M", 96, 38, 86, 34, 70, 28],
                ["L", 102, 40, 92, 36, 71, 28],
                ["XL", 108, 43, 98, 39, 72, 28],
              ].map(([size, chestCm, chestIn, waistCm, waistIn, lengthCm, lengthIn]) => (
                <tr key={size}>
                  <td><strong>{size}</strong></td>
                  <td>{chestCm}</td>
                  <td>{chestIn}</td>
                  <td>{waistCm}</td>
                  <td>{waistIn}</td>
                  <td>{lengthCm}</td>
                  <td>{lengthIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
