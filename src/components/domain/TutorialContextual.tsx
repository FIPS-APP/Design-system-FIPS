import { useState, useEffect, useCallback, useRef, useId, useLayoutEffect } from "react";
import { ChevronRight, ChevronLeft, GraduationCap } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { TutorialHero } from "./TutorialHero";
import { PAGE_TUTORIALS } from "../../data/pageTutorials";


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
              className="size-0 border-x-[10px] border-x-transparent border-b-[10px] border-b-[var(--color-gov-gradient-from)] drop-shadow-[0_-2px_3px_rgba(0,0,0,0.12)]"
              aria-hidden
            />
          </div>
        )}

        {/* Card — modal canônico do DS (header hero + corpo + rodapé). Não usa `Modal`
            porque é ancorado ao alvo e não bloqueia a página; a casca é a mesma. */}
        <div className="relative overflow-hidden rounded-[12px_12px_12px_24px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-elevated)]">
          <TutorialHero
            eyebrow={`Passo ${step + 1} de ${steps.length}`}
            title={currentStep?.title ?? "Tutorial"}
            icon={<GraduationCap className="h-5 w-5" aria-hidden strokeWidth={1.8} />}
            onClose={onClose}
            closeLabel="Fechar tutorial"
          />

          {/* Content */}
          <div className="max-h-[220px] overflow-y-auto px-6 py-5">
            <p className="whitespace-pre-line text-[13px] leading-[1.6] text-[var(--color-fg-muted)]">
              {currentStep?.description}
            </p>
          </div>

          {/* Rodapé — dots à esquerda, navegação à direita */}
          <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]/70 px-6 py-4">
            <div className="flex shrink-0 items-center gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn("rounded-full transition-all duration-300", i > step && "bg-[var(--color-border)]")}
                  style={{
                    width: i === step ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    background:
                      i === step
                        ? `linear-gradient(90deg, ${FIPS_ORANGE}, #cf730d)`
                        : i < step
                          ? "var(--color-primary)"
                          : undefined,
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={prev} disabled={isFirst}>
                <ChevronLeft aria-hidden /> Anterior
              </Button>
              <Button type="button" variant={isLast ? "success" : "accent"} size="sm" onClick={next}>
                {isLast ? "Entendi!" : "Próximo"}
                {!isLast && <ChevronRight aria-hidden />}
              </Button>
            </div>
          </div>
        </div>

        {/* Seta bottom */}
        {pos.arrowSide === "bottom" && showSpot && (
          <div className="-mb-2 mt-0 flex justify-center">
            <div
              className="size-0 border-x-[10px] border-x-transparent border-t-[10px] border-t-[var(--color-surface-muted)] drop-shadow-[0_2px_3px_rgba(0,0,0,0.12)]"
              aria-hidden
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TutorialOverlay;
