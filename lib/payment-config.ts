// This lightweight module is safe to import while rendering the card checkout.
export const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";
export const isWalletConnectConfigured = walletConnectProjectId !== "";
