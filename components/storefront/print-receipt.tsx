"use client";
export function PrintReceipt() {
  return (
    <button
      className="success-btn success-btn-muted"
      type="button"
      onClick={() => window.print()}
    >
      Print order summary
    </button>
  );
}
