
// This is a wrapper around the original tooltip component to add a content prop for compatibility
import React from "react";
import {
  Tooltip as OriginalTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipProps as OriginalTooltipProps
} from "@/components/ui/tooltip";

export interface ExtendedTooltipProps extends OriginalTooltipProps {
  content?: React.ReactNode;
  children?: React.ReactNode;
}

// Create a compatibility wrapper
export function Tooltip({ content, children, ...props }: ExtendedTooltipProps) {
  return (
    <TooltipProvider>
      <OriginalTooltip {...props}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </OriginalTooltip>
    </TooltipProvider>
  );
}

// Re-export the original components
export {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
};
