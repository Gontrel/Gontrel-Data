"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sheetVariants = cva(
  "fixed bg-white p-[33px] transition-transform duration-500 ease-in-out z-50",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b rounded-b-3xl",
        bottom: "inset-x-0 bottom-0 border-t rounded-t-3xl",
        left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm rounded-r-3xl",
        right: "inset-y-0 right-0 h-full rounded-l-3xl z-50",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

interface SheetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetVariants> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  width?: string;
}

const Sheet = ({
  side = "right",
  className,
  children,
  open,
  onOpenChange,
  width = "w-screen sm:max-w-lg",
  ...props
}: SheetProps) => {
  const safeSide = side ?? "right";
  const sideClasses = {
    right: `translate-x-full`,
    left: `-translate-x-full`,
    top: `-translate-y-full`,
    bottom: `translate-y-full`,
  };

  const openClasses = {
    right: `translate-x-0`,
    left: `translate-x-0`,
    top: `translate-y-0`,
    bottom: `translate-y-0`,
  };

  const widthClass = side === "left" || side === "right" ? width : "";

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet */}
      <div
        className={cn(
          sheetVariants({ side: safeSide }),
          widthClass,
          open ? openClasses[safeSide] : sideClasses[safeSide],
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
};

export { Sheet };
