import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Size guide for the Pennicella | AF by ARYO collection.",
};

const rows = [
  { size: "XS", chestCm: 86, chestIn: 34, waistCm: 76, waistIn: 30, lengthCm: 68, lengthIn: 27 },
  { size: "S",  chestCm: 90, chestIn: 35, waistCm: 80, waistIn: 31, lengthCm: 69, lengthIn: 27 },
  { size: "M",  chestCm: 96, chestIn: 38, waistCm: 86, waistIn: 34, lengthCm: 70, lengthIn: 28 },
  { size: "L",  chestCm: 102, chestIn: 40, waistCm: 92, waistIn: 36, lengthCm: 71, lengthIn: 28 },
  { size: "XL", chestCm: 108, chestIn: 43, waistCm: 98, waistIn: 39, lengthCm: 72, lengthIn: 28 },
];

export default function SizeGuidePage() {
  return (
    <main className="section info-page">
      <div className="page-intro">
        <p className="eyebrow">Pennicella | AF by ARYO</p>
        <h1 className="page-title">Size Guide</h1>
        <p>
          Measurements refer to the garment, not body measurements. If you are between sizes, size up.
        </p>
        <p style={{ fontStyle: "italic", opacity: 0.7 }}>
          Measurements will be updated with precise specifications from our tech pack. For immediate sizing
          assistance, please contact{" "}
          <a href="mailto:support@aryo.london">support@aryo.london</a>
        </p>
      </div>

      <div className="size-guide-wrap">
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
              {rows.map((row) => (
                <tr key={row.size}>
                  <td><strong>{row.size}</strong></td>
                  <td>{row.chestCm}</td>
                  <td>{row.chestIn}</td>
                  <td>{row.waistCm}</td>
                  <td>{row.waistIn}</td>
                  <td>{row.lengthCm}</td>
                  <td>{row.lengthIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="size-guide-note">
          Measurements are approximate and may vary by up to 1–2 cm. If you are between sizes, we recommend sizing
          up. For further guidance email{" "}
          <a href="mailto:support@aryo.london">support@aryo.london</a>.
        </p>
      </div>
    </main>
  );
}
