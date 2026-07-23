import { convertExpiry } from "./expiry";
import { parseGs1 } from "./parse";

export type ScanResult = {
  gtin: string;
  expiryDate: string; // "YYYY-MM-DD"（convertExpiry 変換後）
  lotNumber: string;
};

// GS1文字列を「そのまま使える形」に整える入口。
// parseGs1 で分解し、期限を convertExpiry で4桁年に変換して返す。
export function readBarcode(raw: string): ScanResult {
  const { gtin, lotNumber, rawExpiry } = parseGs1(raw);
  return {
    gtin,
    expiryDate: convertExpiry(rawExpiry),
    lotNumber,
  };
}
