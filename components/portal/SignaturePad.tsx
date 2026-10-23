"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Upload, Check } from "lucide-react";

interface SignaturePadProps {
  value: string | null;
  onChange: (dataUrl: string) => void;
}

export function SignaturePad({ value, onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStroke, setHasStroke] = useState(Boolean(value));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasStroke(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL("image/png"));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasStroke(false);
    onChange("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setHasStroke(true);
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-4 items-center">
        <div>
          <p className="text-xs font-medium text-slate-600 mb-1.5">
            Ký trực tiếp bằng chuột hoặc màn hình cảm ứng (Digitale Unterschrift zeichnen):
          </p>
          <div className="relative rounded-xl border-2 border-dashed border-slate-300 bg-white overflow-hidden">
            <canvas
              ref={canvasRef}
              width={440}
              height={150}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-36 cursor-crosshair touch-none"
            />
            {!hasStroke && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                Ký tên vào khung này (Unterschrift hier)
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-600">
            Xem trước chữ ký trên hồ sơ Đức (Vorschau auf Lebenslauf & Anschreiben):
          </p>
          <div className="h-36 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-4">
            {value ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={value} alt="Signature Preview" className="max-h-20 object-contain mb-2" />
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                  <Check className="w-3.5 h-3.5" /> Đã lưu chữ ký điện tử
                </span>
              </>
            ) : (
              <span className="text-xs text-slate-400">Chưa có chữ ký</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={clearCanvas}>
          <Eraser className="w-4 h-4 mr-1.5" />
          Xoá ký lại (Löschen)
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-1.5" />
          Tải ảnh chữ ký tách nền (PNG/JPG)
        </Button>
      </div>
    </div>
  );
}
