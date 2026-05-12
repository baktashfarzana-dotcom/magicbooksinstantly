import { cloneElement, isValidElement } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  size?: "default" | "lg" | "icon";
  variant?: "default" | "secondary" | "ghost";
};

const sizes = {
  default: "h-11 px-5",
  lg: "h-13 px-7 text-base",
  icon: "size-11 p-0",
};

const variants = {
  default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90",
  ghost: "bg-transparent text-foreground hover:bg-muted",
};

export function Button({ asChild, className, size = "default", variant = "default", children, ...rest }: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg border border-transparent font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    sizes[size],
    variants[variant],
    className,
  );

  if (asChild && isValidElement<{ className?: string }>(children)) {
    return cloneElement(children, {
      className: cn(classes, children.props.className),
      ...rest,
    });
  }

  return <button className={classes} {...rest}>{children}</button>;
}
