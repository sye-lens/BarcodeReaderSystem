"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BrowserMultiFormatReader,
  type IScannerControls,
} from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

type Options = {
  // 読取成功時に呼ばれる。テキストはそのまま（加工なし）渡す。
  onDecoded: (text: string) => void;
};

// DataMatrix と 1D(GS1-128) に絞ってデコード精度/速度を上げる。
function buildReader(): BrowserMultiFormatReader {
  const hints = new Map();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.CODE_128,
  ]);
  return new BrowserMultiFormatReader(hints);
}

export function useBarcodeScanner({ onDecoded }: Options) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // onDecoded の最新参照を保持（start を張り替えずに済むように）
  const onDecodedRef = useRef(onDecoded);
  useEffect(() => {
    onDecodedRef.current = onDecoded;
  }, [onDecoded]);

  const stop = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setActive(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    if (!videoRef.current) return;
    try {
      const reader = buildReader();
      controlsRef.current = await reader.decodeFromConstraints(
        { video: { facingMode: "environment" } }, // 背面カメラ
        videoRef.current,
        (result) => {
          if (result) {
            // 多重発火を防ぐため、成功したら一旦停止してから通知
            stop();
            onDecodedRef.current(result.getText());
          }
        },
      );
      setActive(true);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "カメラを起動できませんでした";
      setError(message);
      setActive(false);
    }
  }, [stop]);

  // アンマウント時に必ずカメラ解放
  useEffect(() => {
    return () => {
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, []);

  return { videoRef, active, error, start, stop };
}
