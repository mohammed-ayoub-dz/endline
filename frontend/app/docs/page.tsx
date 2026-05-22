"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Check, Copy, Menu } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const translations = {
  en: {
    dir: "ltr",
    values: {
      title: "Endline Documentation",
      overview: "Overview",
      overviewText:
        "Endline is a full‑stack web application designed to help students focus, study efficiently, and track their learning progress. It integrates video lessons (YouTube), a Pomodoro timer, note‑taking, subject organisation, and a gamified point/level system.",
      frontend: "Frontend: Next.js (React), Tailwind CSS, shadcn/ui, Framer Motion, react‑youtube.",
      backend: "Backend: Go (Fiber), GORM (PostgreSQL), JWT authentication, Argon2id password hashing.",
      storage: "Storage: PostgreSQL database, local storage fallback for video progress.",
      features: "Key Features",
      featuresList: [
        "User Authentication – register, login, logout, refresh token rotation.",
        "Video Lessons – YouTube embeds with custom player (no branding, full controls).",
        "Search – full‑text search over video titles/descriptions (TF‑IDF).",
        "Pomodoro Timer – work/break cycles with auto‑pause on breaks.",
        "Notes – save page‑specific notes while watching videos.",
        "Dashboard – modern header, tools menu (books, timer, lessons), progress overview.",
        "Responsive & RTL – fully supports Arabic language and right‑to‑left layout.",
        "Security – Argon2id for passwords, HTTP‑only cookies, rate limiting, secure headers.",
      ],
      setup: "Setup Instructions",
      backendTitle: "Backend (Go)",
      backendSteps: [
        "Clone the repository:",
        "git clone https://github.com/mohammed-ayoub-javascript/endline.git",
        "cd endline-backend",
        "Install dependencies:",
        "go mod tidy",
        "Create a PostgreSQL database named `endline`.",
        "Create a `.env` file (see Environment Variables section).",
        "Run the server:",
        "go run cmd/server/main.go",
      ],
      frontendTitle: "Frontend (Next.js)",
      frontendSteps: [
        "Clone the frontend repository:",
        "git clone https://github.com/your-repo/endline-frontend.git",
        "cd endline-frontend",
        "Install dependencies:",
        "npm install",
        "Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8080/api`.",
        "Run the development server:",
        "npm run dev",
      ],
      apiEndpoints: "API Endpoints",
      apiTable: {
        headers: ["Method", "Endpoint", "Description", "Auth"],
        rows: [
          ["POST", "/api/auth/register", "Register new user", "Public"],
          ["POST", "/api/auth/login", "Login, returns token + cookie", "Public"],
          ["POST", "/api/auth/refresh", "Refresh access token", "Public"],
          ["POST", "/api/auth/logout", "Logout, revoke refresh token", "Private*"],
          ["GET", "/api/protected/profile", "Get user profile", "JWT"],
          ["GET", "/api/protected/videos/search", "Search videos (JSON)", "JWT"],
          ["GET", "/api/sessions/:id", "Get session progress", "JWT"],
          ["PUT", "/api/sessions/:id", "Update watched time", "JWT"],
        ],
        note: "*Logout requires valid refresh cookie (no JWT needed).",
      },
      envVars: "Environment Variables",
      backendEnv: "Backend (.env)",
      backendEnvCode: `DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=123
DB_NAME=endline
DB_PORT=5432
DB_SSLMODE=disable

ACCESS_SECRET=your_super_secret_key_32chars
REFRESH_SECRET=another_secret_key_32chars
ACCESS_TTL=15m
REFRESH_TTL=720h`,
      frontendEnv: "Frontend (.env.local)",
      frontendEnvCode: `NEXT_PUBLIC_API_URL=http://localhost:8080/api`,
      troubleshooting: "Troubleshooting",
      troubleshootingTable: {
        headers: ["Issue", "Solution"],
        rows: [
          ["CORS error", "Add CORS middleware in Go with `AllowOrigins` and `AllowCredentials: true`."],
          ["Refresh token lost on reload", "Use Next.js rewrites to proxy `/api` to backend (same‑origin)."],
          ["YouTube logo still visible", "Apply CSS scaling (`transform: scale(1.8)`) on iframe container."],
          ["Table doesn't exist (migration)", "Ensure `AutoMigrate` is called and DB user has CREATE privileges."],
          ["Argon2id fails", "Check Go version (1.20+ recommended)."],
        ],
      },
    },
  },
  ar: {
    dir: "rtl",
    values: {
      title: "توثيق Endline",
      overview: "نظرة عامة",
      overviewText:
        "Endline هو تطبيق ويب متكامل يساعد الطلاب على التركيز والدراسة بكفاءة وتتبع تقدمهم التعليمي. يدمج التطبيق دروس الفيديو (YouTube)، مؤقت بومودورو، تدوين الملاحظات، تنظيم المواد، ونظام نقاط ومستويات محفز.",
      frontend: "الواجهة الأمامية: Next.js (React)، Tailwind CSS، shadcn/ui، Framer Motion، react‑youtube.",
      backend: "الخلفية: Go (Fiber)، GORM (PostgreSQL)، توثيق JWT، تشفير Argon2id.",
      storage: "التخزين: PostgreSQL، تخزين محلي احتياطي.",
      features: "الميزات الرئيسية",
      featuresList: [
        "توثيق المستخدمين – تسجيل، دخول، خروج، تدوير رمز التحديث.",
        "دروس الفيديو – مشغل يوتيوب مخصص بدون علامات تجارية.",
        "البحث – بحث نصي في عناوين ووصف الفيديوهات.",
        "مؤقت بومودورو – دورات عمل/راحة مع إيقاف تلقائي.",
        "الملاحظات – حفظ ملاحظات خاصة بالصفحة.",
        "لوحة التحكم – هيدر حديث، قائمة الأدوات، نظرة عامة على التقدم.",
        "متجاوب ويدعم RTL – يدعم اللغة العربية بالكامل.",
        "الأمان – تشفير Argon2id، cookies آمنة، تحديد معدل الطلبات.",
      ],
      setup: "تعليمات الإعداد",
      backendTitle: "الخلفية (Go)",
      backendSteps: [
        "استنساخ المستودع:",
        "git clone https://github.com/your-repo/endline-backend.git",
        "cd endline-backend",
        "تثبيت الاعتماديات:",
        "go mod tidy",
        "إنشاء قاعدة بيانات PostgreSQL باسم `endline`.",
        "إنشاء ملف `.env` (انظر متغيرات البيئة).",
        "تشغيل الخادم:",
        "go run cmd/server/main.go",
      ],
      frontendTitle: "الواجهة الأمامية (Next.js)",
      frontendSteps: [
        "استنساخ المستودع:",
        "git clone https://github.com/your-repo/endline-frontend.git",
        "cd endline-frontend",
        "تثبيت الاعتماديات:",
        "npm install",
        "إنشاء `.env.local` مع `NEXT_PUBLIC_API_URL=http://localhost:8080/api`.",
        "تشغيل خادم التطوير:",
        "npm run dev",
      ],
      apiEndpoints: "نقاط نهاية API",
      apiTable: {
        headers: ["الطريقة", "النهاية", "الوصف", "التوثيق"],
        rows: [
          ["POST", "/api/auth/register", "تسجيل مستخدم جديد", "عام"],
          ["POST", "/api/auth/login", "دخول، يعيد رمز وصول + cookie", "عام"],
          ["POST", "/api/auth/refresh", "تحديث رمز الوصول", "عام"],
          ["POST", "/api/auth/logout", "خروج، إبطال رمز التحديث", "خاص*"],
          ["GET", "/api/protected/profile", "جلب ملف المستخدم", "JWT"],
          ["GET", "/api/protected/videos/search", "بحث في الفيديوهات", "JWT"],
          ["GET", "/api/sessions/:id", "جلب جلسة (تقدم الفيديو)", "JWT"],
          ["PUT", "/api/sessions/:id", "تحديث وقت المشاهدة", "JWT"],
        ],
        note: "*الخروج يتطلب cookie صالح للتحديث.",
      },
      envVars: "متغيرات البيئة",
      backendEnv: "الخلفية (.env)",
      backendEnvCode: `DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=123
DB_NAME=endline
DB_PORT=5432
DB_SSLMODE=disable

ACCESS_SECRET=your_super_secret_key_32chars
REFRESH_SECRET=another_secret_key_32chars
ACCESS_TTL=15m
REFRESH_TTL=720h`,
      frontendEnv: "الواجهة الأمامية (.env.local)",
      frontendEnvCode: `NEXT_PUBLIC_API_URL=http://localhost:8080/api`,
      troubleshooting: "استكشاف الأخطاء",
      troubleshootingTable: {
        headers: ["المشكلة", "الحل"],
        rows: [
          ["خطأ CORS", "أضف وسيط CORS في Go مع `AllowOrigins` و `AllowCredentials: true`."],
          ["فقدان رمز التحديث عند إعادة تحميل الصفحة", "استخدم rewrites في Next.js لتوجيه `/api` إلى الخلفية (نفس المصدر)."],
          ["شعار يوتيوب لا يختفي", "طبق `transform: scale(1.8)` على حاوية iframe."],
          ["الجدول غير موجود (ترحيل)", "تأكد من استدعاء `AutoMigrate` وصلاحية CREATE."],
          ["فشل تشفير Argon2id", "تحقق من إصدار Go (1.20 فأعلى)."],
        ],
      },
    },
  },
};

// ----------------------------------------------------------------------
// Helper components for typography and code blocks
// ----------------------------------------------------------------------
function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative my-6 rounded-lg bg-muted overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/10 text-gray-300 text-xs">
        <span>{language}</span>
        <button onClick={copy} className="hover:text-white transition">
          {copied ?  <HugeiconsIcon icon={Check} className="h-3 w-3" /> :  <HugeiconsIcon icon={Copy} className="h-3 w-3" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-gray-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full">
        <thead>
          <tr className="m-0 border-t p-0 even:bg-muted">
            {headers.map((h) => (
              <th key={h} className="border px-4 py-2 text-left font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="m-0 border-t p-0 even:bg-muted">
              {row.map((cell, j) => (
                <td key={j} className="border px-4 py-2 text-left">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ----------------------------------------------------------------------
// Sidebar component (table of contents)
// ----------------------------------------------------------------------
const sections = ["overview", "features", "setup", "api", "env", "troubleshooting"];

function Sidebar({ activeSection, onSectionClick, dir }: { activeSection: string; onSectionClick: (id: string) => void; dir: string }) {
  const sectionLabels = {
    en: {
      overview: "Overview",
      features: "Key Features",
      setup: "Setup Instructions",
      api: "API Endpoints",
      env: "Environment Variables",
      troubleshooting: "Troubleshooting",
    },
    ar: {
      overview: "نظرة عامة",
      features: "الميزات الرئيسية",
      setup: "تعليمات الإعداد",
      api: "نقاط نهاية API",
      env: "متغيرات البيئة",
      troubleshooting: "استكشاف الأخطاء",
    },
  };
  const labels = sectionLabels[dir === "rtl" ? "ar" : "en"];

  return (
    <nav className="space-y-1">
      {sections.map((id) => (
        <button
          key={id}
          onClick={() => onSectionClick(id)}
          className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
            activeSection === id
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {labels[id as keyof typeof labels]}
        </button>
      ))}
    </nav>
  );
}

// ----------------------------------------------------------------------
// Main Documentation Component with Sidebar
// ----------------------------------------------------------------------
export default function DocsPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const { theme, setTheme } = useTheme();
  const t = translations[lang].values;
  const dir = translations[lang].dir;

  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs for scroll spy
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Scroll spy using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (sections.includes(id)) {
              setActiveSection(id);
              break;
            }
          }
        }
      },
      { rootMargin: "-20% 0% -70% 0%", threshold: 0.3 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        sectionRefs.current[id] = el;
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
      setMobileMenuOpen(false); // close mobile sidebar after click
    }
  };

  return (
    <div dir={dir} className="min-h-screen bg-background text-foreground">
      {/* Header with language toggle, theme toggle, and mobile sidebar button */}
      <div className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile sidebar toggle button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <HugeiconsIcon icon={Menu} className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight">Endline</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === "en" ? "ar" : "en")}>
              {lang === "en" ? "العربية" : "English"}
            </Button>
            
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className={`absolute top-16 bottom-0 w-64 bg-background border-r shadow-lg p-4 ${
              dir === "rtl" ? "right-0" : "left-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar activeSection={activeSection} onSectionClick={scrollToSection} dir={dir} />
          </div>
        </div>
      )}


      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">

          <aside className="hidden md:block w-64 shrink-0 sticky top-20 self-start">
            <Sidebar activeSection={activeSection} onSectionClick={scrollToSection} dir={dir} />
          </aside>


          <main className="flex-1 min-w-0 max-w-3xl mx-auto md:mx-0">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
              {t.title}
            </h1>


            <section id="overview" className="scroll-mt-20">
              <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                {t.overview}
              </h2>
              <p className="leading-7 [&:not(:first-child)]:mt-6">{t.overviewText}</p>
              <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>{t.frontend}</li>
                <li>{t.backend}</li>
                <li>{t.storage}</li>
              </ul>
            </section>


            <section id="features" className="scroll-mt-20">
              <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                {t.features}
              </h2>
              <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                {t.featuresList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>


            <section id="setup" className="scroll-mt-20">
              <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                {t.setup}
              </h2>
              <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">{t.backendTitle}</h3>
              {t.backendSteps.map((step, idx) => {
                if (step.startsWith("git clone") || step.startsWith("cd ") || step.startsWith("go mod") || step.startsWith("go run")) {
                  return <CodeBlock key={idx} code={step} />;
                }
                return (
                  <p key={idx} className="leading-7 [&:not(:first-child)]:mt-6">
                    {step}
                  </p>
                );
              })}
              <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">{t.frontendTitle}</h3>
              {t.frontendSteps.map((step, idx) => {
                if (step.startsWith("git clone") || step.startsWith("cd ") || step.startsWith("npm") || step.startsWith("NEXT_PUBLIC")) {
                  return <CodeBlock key={idx} code={step} />;
                }
                return (
                  <p key={idx} className="leading-7 [&:not(:first-child)]:mt-6">
                    {step}
                  </p>
                );
              })}
            </section>


            <section id="api" className="scroll-mt-20">
              <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                {t.apiEndpoints}
              </h2>
              <Table headers={t.apiTable.headers} rows={t.apiTable.rows} />
              <p className="text-sm text-muted-foreground">{t.apiTable.note}</p>
            </section>


            <section id="env" className="scroll-mt-20">
              <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                {t.envVars}
              </h2>
              <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">{t.backendEnv}</h3>
              <CodeBlock code={t.backendEnvCode} language="env" />
              <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">{t.frontendEnv}</h3>
              <CodeBlock code={t.frontendEnvCode} language="env" />
            </section>


            <section id="troubleshooting" className="scroll-mt-20">
              <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                {t.troubleshooting}
              </h2>
              <Table headers={t.troubleshootingTable.headers} rows={t.troubleshootingTable.rows} />
            </section>

            <blockquote className="mt-6 border-l-2 pl-6 italic">
              For more details, check the source repository or contact the development team.
            </blockquote>
          </main>
        </div>
      </div>
    </div>
  );
}