import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as notFound } from "../_libs/tanstack__router-core.mjs";
import { T as Topbar } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent } from "./card-CPilEoFz.mjs";
import { B as Button, c as cn } from "./button-BXrfXN_b.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-c5KQ8wMi.mjs";
import { A as Accordion, a as AccordionItem, b as AccordionTrigger, c as AccordionContent } from "./accordion-jnLYA7X7.mjs";
import { R as RadioGroup$1, a as RadioGroupItem$1, b as RadioGroupIndicator } from "../_libs/radix-ui__react-radio-group.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./createSsrRpc-Cbl1egtb.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { u as useAuth } from "./auth-yqoVlx_c.mjs";
import { g as getLessonPlayback } from "./bunny.functions-B7NW5dwe.mjs";
import { P as PresentationSlidesViewer } from "./presentation-viewer-CxrJzvGJ.mjs";
import { c as Route } from "./router-DajYyTeL.mjs";
import "../_libs/seroval.mjs";
import { W as ChevronLeft, an as ShieldCheck, l as CircleCheck, aj as Presentation, ad as ListChecks, R as ChevronRight, al as Paperclip, _ as Eye, ae as Circle, i as CirclePlay } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "./sidebar-yL0Cwk17.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-scroll-area.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-accordion.mjs";
import "../_libs/radix-ui__react-collapsible.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./server-B51iIGrX.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./auth-middleware-BCSfl_Vl.mjs";
const RadioGroup = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup$1, { className: cn("grid gap-2", className), ...props, ref });
});
RadioGroup.displayName = RadioGroup$1.displayName;
const RadioGroupItem = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RadioGroupItem$1,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupIndicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-3.5 w-3.5 fill-primary" }) })
    }
  );
});
RadioGroupItem.displayName = RadioGroupItem$1.displayName;
function LessonPlayer() {
  const {
    courseId,
    lessonId
  } = Route.useParams();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const fetchPlayback = useServerFn(getLessonPlayback);
  const {
    data,
    isLoading
  } = useQuery({
    enabled: !!user,
    queryKey: ["app", "lesson", lessonId, user?.id],
    queryFn: async () => {
      const {
        data: course2,
        error
      } = await supabase.from("courses").select("id, title, modules(id, title, position, lessons(id, title, type, position, has_quiz, pass_threshold, description, content, presentation_slides))").eq("id", courseId).maybeSingle();
      if (error) throw error;
      if (!course2) throw notFound();
      course2.modules = (course2.modules ?? []).sort((a, b) => a.position - b.position);
      for (const m of course2.modules) m.lessons = (m.lessons ?? []).sort((a, b) => a.position - b.position);
      const allLessons2 = course2.modules.flatMap((m) => m.lessons.map((l) => ({
        ...l,
        moduleTitle: m.title
      })));
      const lesson2 = allLessons2.find((l) => l.id === lessonId);
      if (!lesson2) throw notFound();
      const [{
        data: progress
      }, {
        data: questions2
      }, {
        data: attempts
      }, {
        data: materials2
      }] = await Promise.all([supabase.from("lesson_progress").select("lesson_id, completed").eq("user_id", user.id).eq("course_id", courseId), lesson2.has_quiz ? supabase.from("quiz_questions").select("*").eq("lesson_id", lessonId).order("position") : Promise.resolve({
        data: []
      }), lesson2.has_quiz ? supabase.from("quiz_attempts").select("score, passed").eq("user_id", user.id).eq("lesson_id", lessonId).order("created_at", {
        ascending: false
      }).limit(1) : Promise.resolve({
        data: []
      }), supabase.from("lesson_materials").select("*").eq("lesson_id", lessonId).order("created_at")]);
      const completedSet2 = new Set((progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id));
      return {
        course: course2,
        allLessons: allLessons2,
        lesson: lesson2,
        completedSet: completedSet2,
        questions: questions2 ?? [],
        lastAttempt: attempts?.[0] ?? null,
        materials: materials2 ?? []
      };
    }
  });
  const {
    data: playback,
    error: playbackError,
    isLoading: playbackLoading
  } = useQuery({
    enabled: !!data && data.lesson.type === "video",
    queryKey: ["playback", lessonId, user?.id],
    queryFn: async () => fetchPlayback({
      data: {
        lessonId
      }
    }),
    retry: false
  });
  const [tab, setTab] = reactExports.useState("content");
  const [answers, setAnswers] = reactExports.useState({});
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  reactExports.useEffect(() => {
    setTab("content");
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  }, [lessonId]);
  if (isLoading || !data) return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-6 text-muted-foreground", children: "Yuklanmoqda..." });
  const {
    course,
    allLessons,
    lesson,
    completedSet,
    questions,
    lastAttempt,
    materials
  } = data;
  const idx = allLessons.findIndex((l) => l.id === lessonId);
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
  const threshold = lesson.pass_threshold ?? 80;
  const markCompleted = async () => {
    if (completedSet.has(lesson.id)) return;
    const {
      error
    } = await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      lesson_id: lesson.id,
      course_id: courseId,
      completed: true
    }, {
      onConflict: "user_id,lesson_id"
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Dars yakunlandi");
      qc.invalidateQueries({
        queryKey: ["app", "lesson", lessonId]
      });
      qc.invalidateQueries({
        queryKey: ["app", "course", courseId]
      });
    }
  };
  const submitQuiz = async () => {
    if (Object.keys(answers).length < questions.length) return toast.error("Barcha savollarga javob bering");
    const correct = questions.filter((q) => answers[q.id] === q.correct_index).length;
    const pct = Math.round(correct / questions.length * 100);
    const passed = pct >= threshold;
    setScore(pct);
    setSubmitted(true);
    await supabase.from("quiz_attempts").insert({
      user_id: user.id,
      lesson_id: lesson.id,
      score: pct,
      passed,
      answers
    });
    if (passed) {
      await supabase.from("lesson_progress").upsert({
        user_id: user.id,
        lesson_id: lesson.id,
        course_id: courseId,
        completed: true
      }, {
        onConflict: "user_id,lesson_id"
      });
      qc.invalidateQueries({
        queryKey: ["app", "course", courseId]
      });
      toast.success(`Ajoyib! ${pct}% — keyingi darsga o'tishingiz mumkin`);
    } else toast.error(`Siz ${pct}% to'pladingiz. Kamida ${threshold}% kerak.`);
  };
  const goNext = () => {
    if (next) navigate({
      to: "/app/courses/$courseId/lessons/$lessonId",
      params: {
        courseId,
        lessonId: next.id
      }
    });
    else navigate({
      to: "/app/courses/$courseId",
      params: {
        courseId
      }
    });
  };
  const watermark = playback?.watermark ? maskPhone(playback.watermark) : "";
  const lessonDone = completedSet.has(lesson.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: course.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/courses/$courseId", params: {
        courseId
      }, className: "mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
        " Kursga qaytish"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[1fr_320px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          lesson.type === "video" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video overflow-hidden rounded-xl bg-black", children: [
            playback?.embedUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: playback.embedUrl, title: lesson.title, className: "absolute inset-0 h-full w-full", loading: "lazy", allow: "accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;", allowFullScreen: true }) : playbackError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 grid place-items-center p-4 text-center text-sm text-red-300", children: [
              "Video yuklab bo'lmadi: ",
              playbackError.message
            ] }) : playbackLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center text-white/60", children: "Video yuklanmoqda..." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center text-white/60", children: "Video mavjud emas" }),
            watermark && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute right-4 top-4 rounded-md bg-black/50 px-2 py-1 text-xs text-white/80 backdrop-blur-sm", children: watermark })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: lesson.moduleTitle }),
              lesson.type === "video" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3 w-3" }),
                " Himoyalangan"
              ] }),
              lessonDone && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-success text-success-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-1 h-3 w-3" }),
                " Yakunlangan"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-display text-2xl font-bold lg:text-3xl", children: lesson.title }),
            lesson.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: lesson.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: setTab, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "content", children: "Tavsif" }),
              (lesson.content || lesson.type === "presentation" || lesson.type === "text") && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "presentation", children: "Materiallar" }),
              materials.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "files", children: [
                "Fayllar (",
                materials.length,
                ")"
              ] }),
              lesson.has_quiz && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "quiz", children: "Test" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "content", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "prose prose-sm max-w-none p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: lesson.description || `Bu darsda "${lesson.title}" mavzusi ko'rib chiqiladi.` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: lesson.has_quiz ? `Darsdan keyin test bor — kamida ${threshold}% kerak.` : "Darsni yakunlagach keyingi darsga o'ting." }),
              !lesson.has_quiz && !lessonDone && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: markCompleted, className: "mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-2 h-4 w-4" }),
                " Yakunlandi deb belgilash"
              ] }),
              Array.isArray(lesson.presentation_slides) && lesson.presentation_slides.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "not-prose mt-6 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Presentation, { className: "h-5 w-5 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: "Dars prezentatsiyasi" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Slaydlarni keyingi/oldingi tugmalari bilan ko'rib chiqing. Yuklab olish imkoni yo'q." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(PresentationSlidesViewer, { slides: lesson.presentation_slides, title: lesson.title })
              ] })
            ] }) }) }),
            (lesson.content || lesson.type === "presentation" || lesson.type === "text") && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "presentation", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: lesson.content ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose prose-sm max-w-none dark:prose-invert", dangerouslySetInnerHTML: {
              __html: lesson.content
            } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Bu dars uchun qo'shimcha mazmun qo'shilmagan." }) }) }) }),
            materials.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "files", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2 p-4", children: materials.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MaterialItem, { material: m }, m.id)) }) }) }),
            lesson.has_quiz && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "quiz", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6 p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "h-6 w-6" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: "Dars yakunidagi test" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                    "Keyingi darsga o'tish uchun ",
                    threshold,
                    "%+ ball to'plang"
                  ] })
                ] })
              ] }),
              questions.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground", children: "Test savollari hali qo'shilmagan." }),
              submitted && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-lg p-4 ${score >= threshold ? "bg-success/10 border border-success/30" : "bg-destructive/10 text-destructive border border-destructive/30"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-2xl font-bold", children: [
                  score,
                  "%"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: score >= threshold ? "Ajoyib! Keyingi darsga o'ting." : `Kamida ${threshold}% kerak.` })
              ] }),
              !submitted && lastAttempt && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-muted/30 p-3 text-sm", children: [
                "Oxirgi urinish: ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  lastAttempt.score,
                  "%"
                ] }),
                " ",
                lastAttempt.passed ? "✅" : "❌"
              ] }),
              questions.map((q, qi) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
                  qi + 1,
                  ". ",
                  q.question
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup, { value: answers[q.id]?.toString(), onValueChange: (v) => setAnswers({
                  ...answers,
                  [q.id]: Number(v)
                }), disabled: submitted, children: q.options.map((opt, oi) => {
                  const selected = answers[q.id] === oi;
                  const correct = submitted && oi === q.correct_index;
                  const wrong = submitted && selected && oi !== q.correct_index;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 rounded-lg border p-3 ${correct ? "border-success bg-success/10" : wrong ? "border-destructive bg-destructive/10" : ""}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { value: oi.toString(), id: `${q.id}-${oi}` }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `${q.id}-${oi}`, className: "flex-1 cursor-pointer", children: opt })
                  ] }, oi);
                }) })
              ] }, q.id)),
              questions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: !submitted ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submitQuiz, size: "lg", children: "Testni topshirish" }) : score >= threshold ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: goNext, size: "lg", children: [
                "Keyingi darsga o'tish ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-1 h-4 w-4" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
                setSubmitted(false);
                setAnswers({});
              }, size: "lg", variant: "outline", children: "Qaytadan urinish" }) })
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", disabled: !prev, onClick: () => prev && navigate({
              to: "/app/courses/$courseId/lessons/$lessonId",
              params: {
                courseId,
                lessonId: prev.id
              }
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "mr-1 h-4 w-4" }),
              " Oldingi"
            ] }),
            lesson.has_quiz && !lessonDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setTab("quiz"), children: "Test ishlash" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: goNext, disabled: !next, children: [
              "Keyingi ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-1 h-4 w-4" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-3 font-display font-semibold", children: "Kurs darslari" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(LessonSidebarAccordion, { modules: course.modules, courseId, currentLessonId: lessonId, currentModuleId: lesson.module_id ?? course.modules.find((m) => m.lessons.some((l) => l.id === lessonId))?.id, completedSet })
        ] }) }) })
      ] })
    ] })
  ] });
}
function maskPhone(s) {
  const digits = s.replace(/\D+/g, "");
  if (digits.length < 7) return s;
  return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} *** ** ${digits.slice(-2)}`;
}
function MaterialItem({
  material
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [url, setUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!open || url) return;
    let cancelled = false;
    (async () => {
      const {
        data
      } = await supabase.storage.from("materials").createSignedUrl(material.storage_path, 60 * 60);
      if (!cancelled) setUrl(data?.signedUrl ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, url, material.storage_path]);
  const mime = (material.mime_type ?? "").toLowerCase();
  const isImage = mime.startsWith("image/");
  const isPdf = mime.includes("pdf");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setOpen((v) => !v), className: "flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: material.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          material.mime_type ?? "",
          " ",
          material.size_bytes ? `• ${Math.round(material.size_bytes / 1024)} KB` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: open ? "Yopish" : "Ko'rish" })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t p-3", onContextMenu: (e) => e.preventDefault(), children: !url ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid aspect-video place-items-center text-sm text-muted-foreground", children: "Yuklanmoqda..." }) : isImage ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: material.name, draggable: false, className: "mx-auto max-h-[70vh] w-full select-none object-contain" }) : isPdf ? /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: `${url}#toolbar=0&navpanes=0`, title: material.name, className: "block h-[70vh] w-full bg-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-dashed bg-muted/30 p-4 text-center text-sm text-muted-foreground", children: "Bu fayl turi sahifada ko'rsatilmaydi. Yuklab olish ham yopilgan." }) })
  ] });
}
function LessonSidebarAccordion({
  modules,
  courseId,
  currentLessonId,
  currentModuleId,
  completedSet
}) {
  const [openIds, setOpenIds] = reactExports.useState(currentModuleId ? [currentModuleId] : []);
  reactExports.useEffect(() => {
    if (currentModuleId && !openIds.includes(currentModuleId)) setOpenIds((v) => [...v, currentModuleId]);
  }, [currentModuleId]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Accordion, { type: "multiple", value: openIds, onValueChange: setOpenIds, className: "space-y-2", children: modules.map((m) => {
    const isCurrent = m.id === currentModuleId;
    const total = m.lessons.length;
    const done = m.lessons.filter((l) => completedSet.has(l.id)).length;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: m.id, className: `overflow-hidden rounded-lg border ${isCurrent ? "border-primary/60 bg-primary/5 ring-1 ring-primary/30" : "bg-card"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "px-3 py-2 hover:no-underline", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full min-w-0 items-center gap-2 text-left", children: [
        isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 shrink-0 rounded-full bg-primary", "aria-hidden": true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `truncate text-sm font-medium ${isCurrent ? "text-primary" : ""}`, children: m.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto shrink-0 text-xs text-muted-foreground", children: [
          done,
          "/",
          total
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "px-2 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: m.lessons.map((l) => {
        const active = l.id === currentLessonId;
        const lDone = completedSet.has(l.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/courses/$courseId/lessons/$lessonId", params: {
          courseId,
          lessonId: l.id
        }, className: `flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`, children: [
          lDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 flex-shrink-0 text-success" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "h-4 w-4 flex-shrink-0 opacity-60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: l.title })
        ] }) }, l.id);
      }) }) })
    ] }, m.id);
  }) });
}
export {
  LessonPlayer as component
};
