import { createHash } from "node:crypto";
export type CryptoQuote = {
  id: string;
  payer: string;
  wallet: string;
  wei: string;
  totalPence: number;
  issuedAt: number;
  expiresAt: number;
  customer: import("./security").CustomerDetails;
  items: import("./orders").OrderLine[];
};
export function cryptoOrderId(hash: string) {
  const hex = createHash("sha256")
    .update(`aryo:ethereum:${hash.toLowerCase()}`)
    .digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}
