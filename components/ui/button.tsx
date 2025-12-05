import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/data-broker-remover/utils";

const buttonVariants = cva(
  " my-4 flex w-full cursor-pointer justify-center rounded-xl px-2 py-3 text-sm font-normal leading-6  shadow-sm",
  {
    variants: {
      variant: {
        default:
          "StabilGrotesk py-3 px-2 h-8 w-[100%] rounded-2xl bg-plum-900 relative flex items-center justify-center gap-2 text-sm peer-disabled:cursor-not-allowed text-warmgray",
        secondary:
          "bg-teal-700 text-black font-semibold hover:bg-teal-500 text-warmgray",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground text-warmgray",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-4 py-1",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
