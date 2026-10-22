export function cryptoAuthorisationMessage(input: {
  payer: string;
  attemptId: string;
  email: string;
  items: Array<{ slug: string; size: string; quantity: number }>;
  timestamp: number;
}) {
  const bag = input.items
    .map((i) => ({ slug: i.slug, size: i.size, quantity: i.quantity }))
    .sort((a, b) => `${a.slug}:${a.size}`.localeCompare(`${b.slug}:${b.size}`));
  return `ARYO crypto checkout\nWebsite: https://aryo.london\nNetwork: Ethereum mainnet (1)\nWallet: ${input.payer.toLowerCase()}\nEmail: ${input.email.trim().toLowerCase()}\nBag: ${JSON.stringify(bag)}\nRequest: ${input.attemptId}\nIssued: ${input.timestamp}\nThis signature requests a payment quote. It does not transfer funds.`;
}
