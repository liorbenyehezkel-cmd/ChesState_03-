"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n/provider";

export function FaqAccordion() {
  // A set, so multiple items can stay open at once.
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const baseId = useId();
  const { t } = useI18n();

  const toggle = (index: number) =>
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });

  return (
    <section id="faq" className="section-shell pb-20 sm:pb-24 lg:pb-28">
      <Reveal className="mx-auto max-w-[46rem]">
        <h2 className="text-center font-serif text-[30px] leading-tight tracking-[-0.01em] sm:text-[40px]">
          {t.faq.title}
        </h2>

        <div className="mt-10 divide-y divide-border border-y border-border sm:mt-12">
          {t.faq.items.map((faq, index) => {
            const isOpen = openItems.has(index);
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <div key={faq.question}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-start transition hover:text-navy/70 sm:py-6"
                  >
                    <span className="font-serif text-[18px] leading-snug text-navy sm:text-[21px]">
                      {faq.question}
                    </span>
                    <PlusMinusIcon isOpen={isOpen} />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 pb-6 pe-10 text-[15px] leading-relaxed text-muted sm:pb-8 sm:text-[16px]">
                        {faq.answer.split("\n\n").map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

function PlusMinusIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-white text-navy"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M1.5 7h11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <motion.path
          d="M7 1.5v11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={false}
          animate={{ opacity: isOpen ? 0 : 1, rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ originX: "50%", originY: "50%" }}
        />
      </svg>
    </span>
  );
}
