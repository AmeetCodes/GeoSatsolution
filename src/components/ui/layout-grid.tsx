"use client";
import { type KeyboardEvent, type ReactNode, useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Card = {
  id: number;
  content: ReactNode;
  className: string;
  thumbnail: string;
  title?: string;
};

export const LayoutGrid = ({ cards, id = "layout-grid" }: { cards: Card[]; id?: string }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);

  const handleClick = (card: Card) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = useCallback(() => {
    setLastSelected(selected);
    setSelected(null);
  }, [selected]);

  useEffect(() => {
    if (!selected) return;

    const handleKeyDown = (event: KeyboardEvent | globalThis.KeyboardEvent) => {
      if (event.key === "Escape") handleOutsideClick();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, handleOutsideClick]);

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>, card: Card) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick(card);
    }
  };

  return (
    <div className="relative mx-auto grid min-h-[16rem] auto-rows-[16rem] w-full max-w-7xl grid-cols-1 gap-4 p-1 sm:p-2 md:auto-rows-[18rem] md:grid-cols-3">
      {cards.map((card, i) => (
        <div key={i} className={cn(card.className, "min-h-0")}>
          <motion.div
            onClick={() => handleClick(card)}
            onKeyDown={(event) => handleCardKeyDown(event, card)}
            role="button"
            tabIndex={0}
            aria-label={`View ${card.title ?? "card details"}`}
            className={cn(
              "group relative h-full w-full cursor-pointer overflow-hidden rounded-xl bg-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-[#11b7a8] focus-visible:ring-offset-2",
              selected?.id === card.id
                ? "fixed inset-4 z-50 flex items-end md:inset-x-[15vw] md:inset-y-[12vh]"
                : lastSelected?.id === card.id
                  ? "z-20"
                  : "z-0"
            )}
            layoutId={`${id}-card-${card.id}`}
          >
            <ImageComponent card={card} layoutId={id} />
            {selected?.id === card.id ? (
              <SelectedCard selected={selected} layoutId={id} />
            ) : (
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-5 pb-5 pt-16 transition-[padding] duration-300 group-hover:pb-7 sm:px-6">
                <p className="text-xl font-semibold text-white sm:text-2xl">
                  {card.title}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-white/75">
                  Open details
                </p>
              </div>
            )}
          </motion.div>
        </div>
      ))}
      <motion.div
        onClick={handleOutsideClick}
        className={cn(
          "fixed inset-0 z-40 bg-black/70",
          selected ? "pointer-events-auto" : "pointer-events-none"
        )}
        animate={{ opacity: selected ? 1 : 0 }}
        aria-hidden="true"
      />
    </div>
  );
};

const ImageComponent = ({ card, layoutId }: { card: Card; layoutId: string }) => {
  return (
    <motion.img
      layoutId={`${layoutId}-image-${card.id}`}
      src={card.thumbnail}
      height="720"
      width="1200"
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      alt={card.title ?? ""}
    />
  );
};

const SelectedCard = ({ selected, layoutId }: { selected: Card | null; layoutId: string }) => {
  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]">
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 0.6,
        }}
        className="absolute inset-0 h-full w-full bg-black opacity-60 z-10"
      />
      <motion.div
        layoutId={`${layoutId}-content-${selected?.id}`}
        initial={{
          opacity: 0,
          y: 100,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: 100,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="relative px-8 pb-4 z-[70]"
      >
        {selected?.content}
      </motion.div>
    </div>
  );
};
