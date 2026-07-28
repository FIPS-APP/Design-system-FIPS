import { useState, useEffect, useCallback, useRef, useId, useLayoutEffect } from "react";
import { X, ChevronRight, ChevronLeft, GraduationCap } from "lucide-react";
import { cn } from "../../lib/cn";
import { PAGE_TUTORIALS } from "../../data/pageTutorials";

const TUTORIAL_GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`;

const FIPS_BLUE = "#004B9B";
const FIPS_ORANGE = "#F6921E";

interface TutorialOverlayProps {
  open: boolean;
  onClose: () => void;
  pageName: string;
}

export { PAGE_TUTORIALS };

/* ─── Route → pageName mapping (DS-FIPS) ─── */
export function routeToPageName(path: string): string {
  const p = path.replace(/^\/docs\/?/, "").replace(/\/$/, "") || "home";
  const map: Record<string, string> = {
    home: "home",
    "": "overview",
    governance: "governance",
    changelog: "changelog",
    login: "login",
    "foundations/colors": "colors",
    "foundations/typography": "typography",
    "foundations/spacing": "spacing",
    "foundations/radius": "radius",
    "foundations/shadows": "shadows",
    "foundations/icons": "icons",
    "components/button": "button",
    "components/field": "field",
    "components/input": "input",
    "components/progress": "progress",
    "components/select": "select",
    "components/textarea": "textarea",
    "components/badge": "badge",
    "components/card": "card",
    "components/tabs": "tabs",
    "components/table": "table",
    "components/dialog": "dialog",
    "components/drawer": "drawer",
    "components/header": "header",
    "components/sidebar": "sidebar",
    "components/toast": "toast",
    "components/tooltip": "tooltip",
    "patterns/application-shell": "application-shell",
    "patterns/dashboard": "dashboard",
    "patterns/data-listing": "data-listing",
    "patterns/form-workspace": "form-workspace",
    "patterns/modal-workflow": "modal-workflow",
    "patterns/hero": "hero",
    "patterns/hero-banner": "hero-banner",
    "patterns/configuracoes": "configuracoes",
  };
  return map[p] || "";
}

/* ─── Helpers ─── */
function getElementRect(selector: string): DOMRect | null {
  const el = document.querySelector(selector);
  return el ? el.getBoundingClientRect() : null;
}

/** Scroll suave até o elemento-alvo e aguarda antes de medir */
function scrollToTarget(selector: string): Promise<void> {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (!el) { resolve(); return; }
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    // aguarda a animação de scroll terminar
    setTimeout(resolve, 450);
  });
}

function calcModalPosition(targetRect: DOMRect | null, modalW: number, modalH: number) {
  if (!targetRect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)", arrowSide: "none" as const };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pad = 16;
  const arrowH = 12;

  // Tenta posicionar abaixo do target
  const belowTop = targetRect.bottom + arrowH + pad;
  if (belowTop + modalH < vh - pad) {
    const left = Math.max(pad, Math.min(targetRect.left + targetRect.width / 2 - modalW / 2, vw - modalW - pad));
    return { top: `${belowTop}px`, left: `${left}px`, transform: "none", arrowSide: "top" as const };
  }
  // Tenta acima
  const aboveTop = targetRect.top - modalH - arrowH - pad;
  if (aboveTop > pad) {
    const left = Math.max(pad, Math.min(targetRect.left + targetRect.width / 2 - modalW / 2, vw - modalW - pad));
    return { top: `${aboveTop}px`, left: `${left}px`, transform: "none", arrowSide: "bottom" as const };
  }
  // Tenta à direita do target
  const rightLeft = targetRect.right + pad;
  if (rightLeft + modalW < vw - pad) {
    const top = Math.max(pad, Math.min(targetRect.top + targetRect.height / 2 - modalH / 2, vh - modalH - pad));
    return { top: `${top}px`, left: `${rightLeft}px`, transform: "none", arrowSide: "none" as const };
  }
  // Tenta à esquerda do target
  const leftPos = targetRect.left - modalW - pad;
  if (leftPos > pad) {
    const top = Math.max(pad, Math.min(targetRect.top + targetRect.height / 2 - modalH / 2, vh - modalH - pad));
    return { top: `${top}px`, left: `${leftPos}px`, transform: "none", arrowSide: "none" as const };
  }
  // Fallback centro
  return { top: "50%", left: "50%", transform: "translate(-50%, -50%)", arrowSide: "none" as const };
}

/* ─── TutorialOverlay ─── */
export function TutorialOverlay({ open, onClose, pageName }: TutorialOverlayProps) {
  const maskId = useId().replace(/:/g, "");
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [scrolling, setScrolling] = useState(false);
  const [modalH, setModalH] = useState(280);
  const modalRef = useRef<HTMLDivElement>(null);

  const steps = PAGE_TUTORIALS[pageName] || [];
  const currentStep = steps[step];
  const isLast = step === steps.length - 1;
  const isFirst = step === 0;

  // Reset step on open
  useEffect(() => { if (open) setStep(0); }, [open, pageName]);

  // Scroll to target + measure
  useEffect(() => {
    if (!open) return;
    if (!currentStep?.target) { setTargetRect(null); return; }

    setScrolling(true);
    scrollToTarget(currentStep.target).then(() => {
      setScrolling(false);
      setTargetRect(getElementRect(currentStep.target!));
    });

    // Re-measure on scroll/resize after initial scroll
    const update = () => {
      if (currentStep?.target) setTargetRect(getElementRect(currentStep.target));
    };
    const timer = setTimeout(() => {
      window.addEventListener("scroll", update, true);
      window.addEventListener("resize", update);
    }, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, step, currentStep]);

  const next = useCallback(() => { if (!isLast) setStep((s) => s + 1); else onClose(); }, [isLast, onClose]);
  const prev = useCallback(() => { if (!isFirst) setStep((s) => s - 1); }, [isFirst]);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "Enter") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, next, prev, onClose]);

  useLayoutEffect(() => {
    if (!open || !modalRef.current) return;
    const h = modalRef.current.offsetHeight;
    if (h > 0) setModalH(h);
  }, [open, step, currentStep?.title, currentStep?.description]);

  if (!open || steps.length === 0) return null;

  const modalW = 420;
  const pos = calcModalPosition(scrolling ? null : targetRect, modalW, modalH);
  const spotPad = 8;
  const showSpot = targetRect && !scrolling;

  return (
    <div className="fixed inset-0 z-[9999]" style={{ pointerEvents: "auto" }}>
      {/* Overlay com spotlight */}
      <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" aria-hidden>
        <defs>
          <mask id={`tutorial-mask-${maskId}`}>
            <rect width="100%" height="100%" fill="white" />
            {showSpot && (
              <rect
                x={targetRect.left - spotPad}
                y={targetRect.top - spotPad}
                width={targetRect.width + spotPad * 2}
                height={targetRect.height + spotPad * 2}
                rx={10}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,42,104,0.55)" mask={`url(#tutorial-mask-${maskId})`} />
      </svg>

      {/* Glow no spotlight */}
      {showSpot && (
        <div
          className="pointer-events-none absolute z-0 rounded-[10px]"
          style={{
            top: targetRect.top - spotPad,
            left: targetRect.left - spotPad,
            width: targetRect.width + spotPad * 2,
            height: targetRect.height + spotPad * 2,
            border: `2px solid ${FIPS_BLUE}`,
            boxShadow: "0 0 20px rgba(0,75,155,0.4), 0 0 60px rgba(0,75,155,0.15)",
            transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      )}

      {/* Click para fechar */}
      <div className="absolute inset-0 z-[1] cursor-pointer" onClick={onClose} aria-hidden />

      {/* Modal card */}
      <div
        ref={modalRef}
        className="absolute z-[2]"
        style={{
          top: pos.top,
          left: pos.left,
          transform: pos.transform,
          width: modalW,
          maxWidth: "calc(100vw - 32px)",
          pointerEvents: "auto",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Seta top */}
        {pos.arrowSide === "top" && showSpot && (
          <div className="flex justify-center -mt-2 mb-0">
            <div
              className="size-0 border-x-[10px] border-x-transparent border-b-[10px] border-b-[#fafafa] drop-shadow-[0_-2px_3px_rgba(0,0,0,0.12)] dark:border-b-[#232328]"
              aria-hidden
            />
          </div>
        )}

        <div
          className={cn(
            "relative overflow-hidden rounded-[20px] border border-black/10",
            "bg-gradient-to-br from-[#fafafa] via-[#f0f0f2] to-[#e8e8ec]",
            "shadow-[0_24px_48px_-12px_rgba(0,0,0,0.22),0_0_0_1px_rgba(255,255,255,0.8)_inset]",
            "dark:border-white/[0.08] dark:from-[#232328] dark:via-[#1a1a1e] dark:to-[#151518]",
            "dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)_inset]",
          )}
        >
          {/* Grain */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[20px] opacity-[0.025] mix-blend-multiply dark:opacity-[0.03] dark:mix-blend-overlay"
            style={{ backgroundImage: TUTORIAL_GRAIN_BG }}
          />
          {/* Faixa azul institucional */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-0 h-[3px] rounded-t-[20px] bg-gradient-to-r from-[#004B9B] via-[#93BDE4] to-transparent"
          />

          {/* Header */}
          <div className="relative z-[1] flex items-center justify-between px-5 pb-2 pt-3">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-black/10",
                  "bg-gradient-to-br from-white via-[#ebebeb] to-[#e0e0e0] text-[rgba(55,55,55,0.82)]",
                  "shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.85)]",
                  "dark:border-[#3f3f46] dark:from-[#303036] dark:via-[#222226] dark:to-[#1c1c20] dark:text-[#a1a1aa]",
                  "dark:shadow-[0_3px_10px_rgba(0,0,0,0.55),0_1px_0_rgba(255,255,255,0.08)_inset,0_-1px_0_rgba(0,0,0,0.45)_inset]",
                )}
              >
                <GraduationCap className="h-4 w-4" aria-hidden strokeWidth={2} />
              </div>
              <span className="font-heading text-[10px] font-bold uppercase tracking-[1.5px] text-[#004B9B] dark:text-[#93BDE4]">
                Passo {step + 1} de {steps.length}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all",
                "border border-black/[0.08] bg-black/[0.04] text-zinc-500",
                "hover:border-[rgba(0,75,155,0.25)] hover:bg-[rgba(0,75,155,0.08)] hover:text-[#004B9B]",
                "dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:text-[#93BDE4]",
              )}
              aria-label="Fechar tutorial"
            >
              <X className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
            </button>
          </div>

          {/* Content */}
          <div className="relative z-[1] max-h-[200px] overflow-y-auto px-5 pb-3">
            <h3 className="mb-1.5 font-heading text-[15px] font-bold text-[#18181b] dark:text-[#fafafa]">{currentStep?.title}</h3>
            <p className="whitespace-pre-line text-[13px] leading-[1.6] text-zinc-600 dark:text-zinc-400">
              {currentStep?.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="relative z-[1] flex justify-center gap-1.5 pb-3">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i > step && "bg-black/10 dark:bg-white/15",
                )}
                style={{
                  width: i === step ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background:
                    i === step
                      ? `linear-gradient(90deg, ${FIPS_ORANGE}, #cf730d)`
                      : i < step
                        ? "rgba(0,75,155,0.45)"
                        : undefined,
                  boxShadow: i === step ? "0 0 10px rgba(246,146,30,0.35)" : undefined,
                }}
              />
            ))}
          </div>

          {/* Botões */}
          <div className="relative z-[1] flex items-center justify-between gap-3 px-5 pb-4">
            <button
              type="button"
              onClick={prev}
              disabled={isFirst}
              className={cn(
                "flex min-h-[36px] items-center gap-1 rounded-[10px] border px-3 py-2 text-[12px] font-semibold transition-all",
                "border-black/10 bg-white/90 text-zinc-700 hover:bg-zinc-100",
                "dark:border-white/10 dark:bg-white/[0.08] dark:text-zinc-200 dark:hover:bg-white/[0.12]",
                isFirst && "pointer-events-none opacity-40",
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Anterior
            </button>
            <button
              type="button"
              onClick={next}
              className={cn(
                "flex min-h-[36px] items-center gap-1 rounded-[10px] px-4 py-2 text-[12px] font-bold text-white transition-all",
                "shadow-[0_2px_12px_rgba(0,75,155,0.35)] hover:brightness-110",
                isLast
                  ? "bg-gradient-to-br from-[#00C64C] to-[#00904c] shadow-[0_2px_14px_rgba(0,198,76,0.35)]"
                  : "bg-[#004B9B] hover:bg-[#003d82]",
              )}
            >
              {isLast ? "Entendi!" : "Próximo"}
              {!isLast && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />}
            </button>
          </div>
        </div>

        {/* Seta bottom */}
        {pos.arrowSide === "bottom" && showSpot && (
          <div className="-mb-2 mt-0 flex justify-center">
            <div
              className="size-0 border-x-[10px] border-x-transparent border-t-[10px] border-t-[#fafafa] drop-shadow-[0_2px_3px_rgba(0,0,0,0.12)] dark:border-t-[#232328]"
              aria-hidden
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TutorialOverlay;
