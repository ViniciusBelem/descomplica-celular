import { cn } from "../../lib/utils"; // If not moved to utils, create it or use absolute path

/**
 * Step Badge for the Advisor Stepper
 */
export function StepBadge({ number, active, completed, onClick }) {
  return (
    <button 
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "w-12 h-12 shrink-0 flex items-center justify-center rounded-full font-black transition-all duration-500 border-2",
        active 
          ? "bg-primary text-black border-primary shadow-xl shadow-primary/30" 
          : completed
            ? "bg-primary/20 text-primary border-primary/40 cursor-pointer"
            : "border-white/10 text-gray-600 cursor-default"
      )}
    >
      {completed ? "✓" : (number < 10 ? `0${number}` : number)}
    </button>
  );
}
