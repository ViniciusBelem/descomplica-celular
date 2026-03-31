import { cn } from "../../lib/utils";
import { StepBadge } from "../ui/StepBadge";

/**
 * Universal Wrapper for individual Advisor Steps to ensure layout consistency.
 */
export function AdvisorStep({ 
  number, 
  title, 
  description, 
  active, 
  completed, 
  onBadgeClick, 
  children 
}) {
  return (
    <div className={cn(
      "flex items-start gap-6 transition-all duration-500",
      !active && !completed ? "opacity-30 pointer-events-none" : "opacity-100"
    )}>
      <StepBadge 
        number={number} 
        active={active} 
        completed={completed} 
        onClick={onBadgeClick} 
      />
      
      <div className="pt-2 w-full">
        <h3 className={cn(
          "text-xl font-medium mb-1 transition-colors",
          active ? "text-white" : "text-gray-400"
        )}>
          {title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 leading-relaxed">
          {description}
        </p>

        {active && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
