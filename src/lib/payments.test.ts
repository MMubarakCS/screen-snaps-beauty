import { describe, it, expect } from "vitest";
import { escrowBreakdown, isValidPayoutAmount } from "./payments";

describe("payments", () => {
  it("150 BHD fee totals 163.200 BHD escrow (8% fee + 10% VAT on fee)", () => {
    const b = escrowBreakdown(150);
    expect(b.charges).toBeCloseTo(13.2, 3);
    expect(b.total).toBeCloseTo(163.2, 3);
  });
  it("payout cannot exceed available balance", () => {
    expect(isValidPayoutAmount(450, 450)).toBe(true);
    expect(isValidPayoutAmount(450.001, 450)).toBe(false);
    expect(isValidPayoutAmount(0, 450)).toBe(false);
  });
});
