import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind classes safely.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Atomic Button Component
 */
export function Button({ 
  className, 
  variant = "primary", 
  size = "md",
  disabled, 
  loading,
  children, 
  ...props 
}) {
  const variants = {
    primary: "bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20",
    secondary: "bg-secondary text-black hover:bg-secondary/90 shadow-lg shadow-secondary/20",
    outline: "bg-transparent border border-white/20 hover:border-white text-gray-300 hover:text-white",
    ghost: "bg-transparent hover:bg-white/5 text-gray-400 hover:text-white",
    danger: "bg-error text-white hover:bg-error/90"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-bold",
    md: "px-6 py-2.5 text-sm font-bold",
    lg: "px-8 py-4 text-base font-black tracking-widest uppercase"
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "relative rounded-md transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : children}
    </button>
  );
}
