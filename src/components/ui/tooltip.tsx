
import React from "react";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent as ShadcnTooltipContent,
  TooltipProvider as ShadcnTooltipProvider,
  TooltipTrigger as ShadcnTooltipTrigger
} from "@/components/ui/tooltip";

interface TooltipProps {
  content?: React.ReactNode;
  children?: React.ReactNode;
  delayDuration?: number;
}

// Create a compatibility wrapper
export function Tooltip({ content, children, ...props }: TooltipProps) {
  return (
    <ShadcnTooltipProvider>
      <ShadcnTooltip {...props}>
        <ShadcnTooltipTrigger asChild>{children}</ShadcnTooltipTrigger>
        <ShadcnTooltipContent>{content}</ShadcnTooltipContent>
      </ShadcnTooltip>
    </ShadcnTooltipProvider>
  );
}

// Re-export the original components
export {
  ShadcnTooltipContent as TooltipContent,
  ShadcnTooltipProvider as TooltipProvider,
  ShadcnTooltipTrigger as TooltipTrigger
};
