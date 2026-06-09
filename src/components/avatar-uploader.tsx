import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function createAvatarSignedUrl(path: string) {
  const { data } = await supabase.storage.from("avatars").createSignedUrl(path, ONE_YEAR);
  return data?.signedUrl ?? null;
}

export function AvatarUploader({
  userId,
  url,
  name,
  size = 96,
  onChange,
}: {
  userId: string;
  url?: string | null;
  name?: string | null;
  size?: number;
  onChange?: (newUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const initials = (name || "U")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Faqat rasm yuklash mumkin");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Rasm hajmi 5MB dan oshmasin");
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;

      const signedUrl = await createAvatarSignedUrl(path);
      if (!signedUrl) throw new Error("URL yaratib bo'lmadi");

      const { error: updErr } = await supabase
        .from("profiles")
        .update({ avatar_url: signedUrl })
        .eq("id", userId);
      if (updErr) throw updErr;

      onChange?.(signedUrl);
      toast.success("Profil rasmi yangilandi");
    } catch (e: any) {
      toast.error(e.message || "Yuklashda xatolik");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", userId);
      if (error) throw error;
      onChange?.(null);
      toast.success("Rasm olib tashlandi");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <Avatar style={{ width: size, height: size }}>
          {url ? <AvatarImage src={url} alt={name ?? ""} /> : null}
          <AvatarFallback className="bg-primary text-2xl font-display font-semibold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md hover:opacity-90 disabled:opacity-50"
          aria-label="Rasm yuklash"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        </button>
      </div>
      {url && (
        <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={remove} disabled={busy}>
          <Trash2 className="mr-1 h-3 w-3" /> Olib tashlash
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}