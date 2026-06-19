import { useCallback, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia } from "@/lib/cms";
import { inputCls } from "@/components/admin/AdminHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type AspectPreset = { label: string; value: number | undefined };

const ASPECTS: AspectPreset[] = [
  { label: "Free", value: undefined },
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "1:1", value: 1 },
  { label: "3:4", value: 3 / 4 },
  { label: "9:16", value: 9 / 16 },
];

/**
 * Image control with: paste a URL, upload from disk, or crop the current
 * image (uploaded or remote). Cropped output is re-uploaded to cms-media.
 */
export function CroppingImagePicker({
  value,
  onChange,
  defaultAspect = 16 / 9,
  folder = "homepage",
}: {
  value: string;
  onChange: (url: string) => void;
  /** Initial aspect when opening the cropper. */
  defaultAspect?: number;
  folder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(defaultAspect);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [pixelCrop, setPixelCrop] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const persistFile = async (file: File) => {
    setUploading(true);
    try {
      const { path, url } = await uploadMedia(file, folder);
      await supabase.from("media_assets").insert({
        path,
        url,
        mime_type: file.type,
        size_bytes: file.size,
        alt: file.name,
      });
      onChange(url);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const onFileChosen = (file: File, openCropper: boolean) => {
    if (openCropper) {
      const dataUrl = URL.createObjectURL(file);
      setCropSrc(dataUrl);
      setAspect(defaultAspect);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setCropOpen(true);
    } else {
      void persistFile(file);
    }
  };

  const openCropOnCurrent = () => {
    if (!value) return;
    setCropSrc(value);
    setAspect(defaultAspect);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCropOpen(true);
  };

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setPixelCrop(areaPixels);
  }, []);

  const applyCrop = async () => {
    if (!cropSrc || !pixelCrop) return;
    setSaving(true);
    try {
      const blob = await cropImageToBlob(cropSrc, pixelCrop);
      const file = new File([blob], `crop-${Date.now()}.jpg`, { type: "image/jpeg" });
      await persistFile(file);
      setCropOpen(false);
      setCropSrc(null);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-3 items-start">
        {value ? (
          <img src={value} alt="" className="w-32 h-20 object-cover rounded border border-[var(--gold)]/20" />
        ) : (
          <div className="w-32 h-20 flex items-center justify-center bg-[var(--cream)] text-[var(--gold-muted)] text-[10px] tracking-[0.18em] uppercase rounded border border-dashed border-[var(--gold)]/30">
            Default
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            className={inputCls}
            value={value ?? ""}
            placeholder="Paste an image URL or upload below"
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex flex-wrap gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFileChosen(f, true);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="text-[11px] tracking-[0.16em] uppercase text-[var(--gold-muted)] hover:text-[var(--navy-deep)]"
            >
              {uploading ? "Uploading…" : "Upload & crop"}
            </button>
            {value && (
              <button
                type="button"
                onClick={openCropOnCurrent}
                className="text-[11px] tracking-[0.16em] uppercase text-[var(--gold-muted)] hover:text-[var(--navy-deep)]"
              >
                Crop current
              </button>
            )}
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-[11px] tracking-[0.16em] uppercase text-red-600"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={cropOpen} onOpenChange={(o) => !o && setCropOpen(false)}>
        <DialogContent className="max-w-3xl bg-[var(--cream)]">
          <DialogHeader>
            <DialogTitle className="font-serif text-[22px] text-[var(--navy-deep)]">
              Crop image
            </DialogTitle>
            <DialogDescription className="text-[13px] text-[var(--warm-gray)]">
              Pick an aspect ratio, drag to reframe, scroll to zoom.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            {ASPECTS.map((a) => {
              const active = a.value === aspect;
              return (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => setAspect(a.value)}
                  className={`text-[11px] tracking-[0.16em] uppercase px-3 py-1.5 rounded border transition-colors ${
                    active
                      ? "bg-[var(--navy-deep)] text-[var(--ivory)] border-[var(--navy-deep)]"
                      : "bg-white text-[var(--navy-deep)] border-[var(--gold)]/30 hover:border-[var(--gold)]"
                  }`}
                >
                  {a.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full h-[420px] bg-black/80 rounded">
            {cropSrc && (
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                restrictPosition={false}
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.22em] uppercase text-[var(--gold-muted)] w-12">
              Zoom
            </span>
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-[var(--gold)]"
            />
          </div>

          <DialogFooter className="flex flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => setCropOpen(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={applyCrop}
              disabled={saving || !pixelCrop}
              className="btn-primary"
            >
              {saving ? "Saving…" : "Apply crop"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------ canvas helpers ------------ */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Anonymous so remote (CORS-enabled) Supabase URLs don't taint the canvas.
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) =>
      reject(new Error("Could not load the image for cropping. The host may block cross-origin reads."));
    img.src = src;
  });
}

async function cropImageToBlob(src: string, area: Area): Promise<Blob> {
  const img = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(area.width));
  canvas.height = Math.max(1, Math.round(area.height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not available");
  ctx.drawImage(
    img,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to encode cropped image"))),
      "image/jpeg",
      0.92,
    );
  });
}