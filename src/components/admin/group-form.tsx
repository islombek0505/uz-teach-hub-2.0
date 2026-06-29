import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { WEEKDAYS, GROUP_STATUS, GROUP_STATUS_ORDER, type GroupStatus } from "@/lib/groups";

export type GroupCourseOption = { id: string; title: string };

export type GroupFormPayload = {
  course_id: string;
  name: string;
  description: string | null;
  status: GroupStatus;
  capacity: number;
  min_capacity: number | null;
  price: number;
  price_period: string;
  schedule_days: number[];
  start_time: string | null;
  end_time: string | null;
  starts_on: string | null;
  duration_weeks: number | null;
  telegram_link: string | null;
};

type Props = {
  courses: GroupCourseOption[];
  initial?: Partial<GroupFormPayload>;
  submitting?: boolean;
  submitLabel: string;
  onSubmit: (payload: GroupFormPayload) => void;
};

export function GroupForm({ courses, initial, submitting, submitLabel, onSubmit }: Props) {
  const [courseId, setCourseId] = useState(initial?.course_id ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<GroupStatus>(initial?.status ?? "draft");
  const [capacity, setCapacity] = useState(String(initial?.capacity ?? 25));
  const [minCapacity, setMinCapacity] = useState(
    initial?.min_capacity != null ? String(initial.min_capacity) : "",
  );
  const [price, setPrice] = useState(initial?.price != null ? String(initial.price) : "");
  const [pricePeriod, setPricePeriod] = useState(initial?.price_period ?? "monthly");
  const [days, setDays] = useState<number[]>(initial?.schedule_days ?? []);
  const [startTime, setStartTime] = useState(initial?.start_time ?? "");
  const [endTime, setEndTime] = useState(initial?.end_time ?? "");
  const [startsOn, setStartsOn] = useState(initial?.starts_on ?? "");
  const [durationWeeks, setDurationWeeks] = useState(
    initial?.duration_weeks != null ? String(initial.duration_weeks) : "",
  );
  const [telegram, setTelegram] = useState(initial?.telegram_link ?? "");

  const toggleDay = (d: number) =>
    setDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort((a, b) => a - b),
    );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return toast.error("Yo'nalish (kurs) ni tanlang");
    if (!name.trim()) return toast.error("Guruh nomini kiriting");
    const cap = Number(capacity);
    if (!cap || cap < 1) return toast.error("Sig'im 1 dan katta bo'lishi kerak");

    onSubmit({
      course_id: courseId,
      name: name.trim(),
      description: description.trim() || null,
      status,
      capacity: cap,
      min_capacity: minCapacity ? Number(minCapacity) : null,
      price: price ? Number(price) : 0,
      price_period: pricePeriod,
      schedule_days: days,
      start_time: startTime || null,
      end_time: endTime || null,
      starts_on: startsOn || null,
      duration_weeks: durationWeeks ? Number(durationWeeks) : null,
      telegram_link: telegram.trim() || null,
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Asosiy ma'lumotlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Yo'nalish (kurs) *</Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Guruh nomi *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan: 2-Frontend"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tavsif</Label>
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Guruh haqida qisqacha..."
              />
            </div>
            <div className="space-y-2">
              <Label>Telegram guruh havolasi</Label>
              <Input
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="https://t.me/+..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Narx va sig'im</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Narx (so'm)</Label>
                <Input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="290000"
                />
              </div>
              <div className="space-y-2">
                <Label>To'lov davri</Label>
                <Select value={pricePeriod} onValueChange={setPricePeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Oylik</SelectItem>
                    <SelectItem value="course">Kurs uchun (bir martalik)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Maksimal o'quvchi *</Label>
                <Input
                  type="number"
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Minimal o'quvchi (ixtiyoriy)</Label>
                <Input
                  type="number"
                  min={0}
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(e.target.value)}
                  placeholder="—"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Jadval</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Dars kunlari</Label>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((w) => {
                  const on = days.includes(w.value);
                  return (
                    <button
                      key={w.value}
                      type="button"
                      onClick={() => toggleDay(w.value)}
                      className={cn(
                        "h-9 min-w-11 rounded-lg border px-3 text-sm font-medium transition-colors",
                        on
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background hover:bg-accent",
                      )}
                    >
                      {w.short}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Boshlanish vaqti</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Tugash vaqti</Label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Darslar boshlanish sanasi</Label>
                <Input type="date" value={startsOn} onChange={(e) => setStartsOn(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Davomiyligi (hafta)</Label>
                <Input
                  type="number"
                  min={1}
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(e.target.value)}
                  placeholder="—"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Holat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Guruh holati</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as GroupStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GROUP_STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>
                      {GROUP_STATUS[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                "Qabul ochiq" — o'quvchilar so'rov yubora oladi. "Darslar ketmoqda" — qabul
                yopiladi, guruh ko'rinishda qoladi.
              </p>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? "Saqlanmoqda..." : submitLabel}
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
