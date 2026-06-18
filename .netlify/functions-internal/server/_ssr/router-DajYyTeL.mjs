import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
const appCss = "/assets/styles-DSfa7v3C.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$t = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Uz Teach Hub" },
      { name: "description", content: "Online dasturlash kurslarini o'rganing" },
      { name: "author", content: "Uz Teach Hub" },
      { property: "og:title", content: "Uz Teach Hub" },
      { property: "og:description", content: "Online dasturlash kurslarini o'rganing" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@UzTeachHub" },
      { name: "twitter:title", content: "Uz Teach Hub" },
      { name: "twitter:description", content: "Online dasturlash kurslarini o'rganing" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/J9yTuJnYCEcqL1ad9m4MoUaW1fS2/social-images/social-1781008314434-hd-nature-trees-and-road-3dxyx41d7e52a4k0.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/J9yTuJnYCEcqL1ad9m4MoUaW1fS2/social-images/social-1781008314434-hd-nature-trees-and-road-3dxyx41d7e52a4k0.webp" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Figtree:wght@400;500;600;700&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$t.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" })
  ] });
}
const $$splitComponentImporter$s = () => import("./auth-TRcf1990.mjs");
const Route$s = createFileRoute("/auth")({
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./app-B1S0a8Nq.mjs");
const Route$r = createFileRoute("/app")({
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./admin-DRHf3dRW.mjs");
const Route$q = createFileRoute("/admin")({
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./index-DTcySm7G.mjs");
const Route$p = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "LearnHub — Online Kurslar Platformasi"
    }, {
      name: "description",
      content: "Professional online kurslar. Video darslar, testlar, sertifikatlar. Oylik obuna asosida."
    }, {
      property: "og:title",
      content: "LearnHub — Online Kurslar Platformasi"
    }, {
      property: "og:description",
      content: "Professional online kurslar. Video darslar, testlar, sertifikatlar."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./app.index-DWsmY_4l.mjs");
const Route$o = createFileRoute("/app/")({
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./admin.index-DPNcY0fE.mjs");
const Route$n = createFileRoute("/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./auth.register-fRwy-6w1.mjs");
const Route$m = createFileRoute("/auth/register")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./auth.login-DeHpT3Qh.mjs");
const Route$l = createFileRoute("/auth/login")({
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./app.subscription-CV6crvE0.mjs");
const Route$k = createFileRoute("/app/subscription")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./app.profile-B3QuK0k0.mjs");
const Route$j = createFileRoute("/app/profile")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./app.notifications-BWO2GwLh.mjs");
const Route$i = createFileRoute("/app/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./app.feedback-CdWyt_du.mjs");
const Route$h = createFileRoute("/app/feedback")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./admin.students-CvOnGzmq.mjs");
const Route$g = createFileRoute("/admin/students")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./admin.student-stats-BjPj4Z0h.mjs");
const Route$f = createFileRoute("/admin/student-stats")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./admin.settings-D6ANrWDO.mjs");
const Route$e = createFileRoute("/admin/settings")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./admin.profile-DGjH1bRj.mjs");
const Route$d = createFileRoute("/admin/profile")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./admin.plans-mQe5jgDd.mjs");
const Route$c = createFileRoute("/admin/plans")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./admin.payments-BTw892qM.mjs");
const Route$b = createFileRoute("/admin/payments")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./admin.notifications-KQCUm-b8.mjs");
const Route$a = createFileRoute("/admin/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./admin.news-CMqDBDjD.mjs");
const Route$9 = createFileRoute("/admin/news")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./admin.feedback-CQYmHPDp.mjs");
const Route$8 = createFileRoute("/admin/feedback")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./app.courses.index-CPh5Q39x.mjs");
const Route$7 = createFileRoute("/app/courses/")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./admin.courses.index-C9nZigXO.mjs");
const Route$6 = createFileRoute("/admin/courses/")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./app.courses._courseId-BFsOu0JM.mjs");
const Route$5 = createFileRoute("/app/courses/$courseId")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./admin.student-stats._studentId-C9VPu_ib.mjs");
const Route$4 = createFileRoute("/admin/student-stats/$studentId")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin.courses.new-C-J62DE8.mjs");
const Route$3 = createFileRoute("/admin/courses/new")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitErrorComponentImporter$2 = () => import("./admin.courses._courseId-BVdIPtT0.mjs");
const $$splitNotFoundComponentImporter$2 = () => import("./admin.courses._courseId-DOlkRsI1.mjs");
const $$splitComponentImporter$2 = () => import("./admin.courses._courseId-CR7HGUpn.mjs");
const Route$2 = createFileRoute("/admin/courses/$courseId")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$2, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent")
});
const $$splitErrorComponentImporter$1 = () => import("./app.courses._courseId.index-BVdIPtT0.mjs");
const $$splitNotFoundComponentImporter$1 = () => import("./app.courses._courseId.index-DOlkRsI1.mjs");
const $$splitComponentImporter$1 = () => import("./app.courses._courseId.index-DIWZJMxc.mjs");
const Route$1 = createFileRoute("/app/courses/$courseId/")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent")
});
const $$splitErrorComponentImporter = () => import("./app.courses._courseId.lessons._lessonId-BVdIPtT0.mjs");
const $$splitNotFoundComponentImporter = () => import("./app.courses._courseId.lessons._lessonId-D6tI6E6m.mjs");
const $$splitComponentImporter = () => import("./app.courses._courseId.lessons._lessonId-DV51k0E1.mjs");
const Route = createFileRoute("/app/courses/$courseId/lessons/$lessonId")({
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
const AuthRoute = Route$s.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$t
});
const AppRoute = Route$r.update({
  id: "/app",
  path: "/app",
  getParentRoute: () => Route$t
});
const AdminRoute = Route$q.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$t
});
const IndexRoute = Route$p.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$t
});
const AppIndexRoute = Route$o.update({
  id: "/",
  path: "/",
  getParentRoute: () => AppRoute
});
const AdminIndexRoute = Route$n.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminRoute
});
const AuthRegisterRoute = Route$m.update({
  id: "/register",
  path: "/register",
  getParentRoute: () => AuthRoute
});
const AuthLoginRoute = Route$l.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => AuthRoute
});
const AppSubscriptionRoute = Route$k.update({
  id: "/subscription",
  path: "/subscription",
  getParentRoute: () => AppRoute
});
const AppProfileRoute = Route$j.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => AppRoute
});
const AppNotificationsRoute = Route$i.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => AppRoute
});
const AppFeedbackRoute = Route$h.update({
  id: "/feedback",
  path: "/feedback",
  getParentRoute: () => AppRoute
});
const AdminStudentsRoute = Route$g.update({
  id: "/students",
  path: "/students",
  getParentRoute: () => AdminRoute
});
const AdminStudentStatsRoute = Route$f.update({
  id: "/student-stats",
  path: "/student-stats",
  getParentRoute: () => AdminRoute
});
const AdminSettingsRoute = Route$e.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AdminRoute
});
const AdminProfileRoute = Route$d.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => AdminRoute
});
const AdminPlansRoute = Route$c.update({
  id: "/plans",
  path: "/plans",
  getParentRoute: () => AdminRoute
});
const AdminPaymentsRoute = Route$b.update({
  id: "/payments",
  path: "/payments",
  getParentRoute: () => AdminRoute
});
const AdminNotificationsRoute = Route$a.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => AdminRoute
});
const AdminNewsRoute = Route$9.update({
  id: "/news",
  path: "/news",
  getParentRoute: () => AdminRoute
});
const AdminFeedbackRoute = Route$8.update({
  id: "/feedback",
  path: "/feedback",
  getParentRoute: () => AdminRoute
});
const AppCoursesIndexRoute = Route$7.update({
  id: "/courses/",
  path: "/courses/",
  getParentRoute: () => AppRoute
});
const AdminCoursesIndexRoute = Route$6.update({
  id: "/courses/",
  path: "/courses/",
  getParentRoute: () => AdminRoute
});
const AppCoursesCourseIdRoute = Route$5.update({
  id: "/courses/$courseId",
  path: "/courses/$courseId",
  getParentRoute: () => AppRoute
});
const AdminStudentStatsStudentIdRoute = Route$4.update({
  id: "/$studentId",
  path: "/$studentId",
  getParentRoute: () => AdminStudentStatsRoute
});
const AdminCoursesNewRoute = Route$3.update({
  id: "/courses/new",
  path: "/courses/new",
  getParentRoute: () => AdminRoute
});
const AdminCoursesCourseIdRoute = Route$2.update({
  id: "/courses/$courseId",
  path: "/courses/$courseId",
  getParentRoute: () => AdminRoute
});
const AppCoursesCourseIdIndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => AppCoursesCourseIdRoute
});
const AppCoursesCourseIdLessonsLessonIdRoute = Route.update({
  id: "/lessons/$lessonId",
  path: "/lessons/$lessonId",
  getParentRoute: () => AppCoursesCourseIdRoute
});
const AdminStudentStatsRouteChildren = {
  AdminStudentStatsStudentIdRoute
};
const AdminStudentStatsRouteWithChildren = AdminStudentStatsRoute._addFileChildren(AdminStudentStatsRouteChildren);
const AdminRouteChildren = {
  AdminFeedbackRoute,
  AdminNewsRoute,
  AdminNotificationsRoute,
  AdminPaymentsRoute,
  AdminPlansRoute,
  AdminProfileRoute,
  AdminSettingsRoute,
  AdminStudentStatsRoute: AdminStudentStatsRouteWithChildren,
  AdminStudentsRoute,
  AdminIndexRoute,
  AdminCoursesCourseIdRoute,
  AdminCoursesNewRoute,
  AdminCoursesIndexRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const AppCoursesCourseIdRouteChildren = {
  AppCoursesCourseIdIndexRoute,
  AppCoursesCourseIdLessonsLessonIdRoute
};
const AppCoursesCourseIdRouteWithChildren = AppCoursesCourseIdRoute._addFileChildren(AppCoursesCourseIdRouteChildren);
const AppRouteChildren = {
  AppFeedbackRoute,
  AppNotificationsRoute,
  AppProfileRoute,
  AppSubscriptionRoute,
  AppIndexRoute,
  AppCoursesCourseIdRoute: AppCoursesCourseIdRouteWithChildren,
  AppCoursesIndexRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const AuthRouteChildren = {
  AuthLoginRoute,
  AuthRegisterRoute
};
const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute: AdminRouteWithChildren,
  AppRoute: AppRouteWithChildren,
  AuthRoute: AuthRouteWithChildren
};
const routeTree = Route$t._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$4 as R,
  Route$2 as a,
  Route$1 as b,
  Route as c,
  router as r
};
