import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-aqua text-abyss font-medium shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_14px_40px_-16px_rgba(60,227,214,0.75)] hover:bg-aqua-bright hover:shadow-[0_1px_0_rgba(255,255,255,0.45)_inset,0_18px_48px_-14px_rgba(60,227,214,0.9)]",
  secondary:
    "glass text-ink hover:border-line-strong hover:bg-white/[0.07]",
  ghost: "text-ink-2 hover:text-ink hover:bg-white/[0.05]",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[0.8125rem] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-[3.25rem] px-7 text-[0.9375rem] gap-2.5",
};

const BASE =
  "group relative inline-flex select-none items-center justify-center rounded-full whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-45";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  /** Appended to the label, revealed on hover. */
  trailingIcon?: boolean;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
  buttonProps?: never;
};

type ButtonAsButton = CommonProps & {
  href?: never;
  external?: never;
  buttonProps?: ComponentPropsWithoutRef<"button">;
};

export type ButtonProps = ButtonAsLink | ButtonAsButton;

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    trailingIcon = false,
  } = props;

  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);
  const content = (
    <>
      {children}
      {trailingIcon ? (
        <ArrowRight
          className="size-4 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1"
          aria-hidden="true"
        />
      ) : null}
    </>
  );

  if (props.href !== undefined) {
    const { href, external } = props;

    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noreferrer noopener">
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  const { buttonProps } = props;
  return (
    <button className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
