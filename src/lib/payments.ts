// Sandbox payment layer. Swap these functions for real calls to the
// banking backend (e.g. a Spring Boot API) without touching the UI.

export type BookingState = "DRAFT" | "FUNDED_ESCROW";

export const escrowBreakdown = (fee: number) => {
  const platform = fee * 0.08;
  const vat = platform * 0.1;
  return { fee, platform, vat, charges: platform + vat, total: fee + platform + vat };
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function chargeEscrow(input: { amount: number; method: "benefitpay" | "card"; paymentRef: string }) {
  await wait(1500);
  return { ok: true as const, txnRef: "#TXN-BEN-88491", bookingState: "FUNDED_ESCROW" as BookingState, ...input };
}

export async function requestPayout(input: { amount: number; iban: string }) {
  await wait(1500);
  return { ok: true as const, ref: "#PWR-FAWRI-2026-092", ...input };
}

export const isValidPayoutAmount = (amount: number, available: number) =>
  Number.isFinite(amount) && amount > 0 && amount <= available;
