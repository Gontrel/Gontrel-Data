"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
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
}

const Sheet = ({
  side = "right",
  className,
  children,
  open,
  onOpenChange,
}: SheetProps) => {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => onOpenChange(false)}
        />
      )}
      <div
        data-state={open ? "open" : "closed"}
        className={cn(sheetVariants({ side }), className)}
      >
        {children}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
};

export { Sheet };
