import {convertExpiry} from "./expiry";
import {parseGs1} from "./parse";

export type ScanResult = {
    gtin: string;
    rawExpiry: string;
};

export function readBarcode(raw: string): ScanResult {
    const parsed = parseGs1(raw);
    return {
        gtin: parsed.gtin,
        rawExpiry: parsed.rawExpiry
    };
}