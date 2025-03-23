
import * as React from "react";
import { cn } from "@/lib/utils";

interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-4", className)}
        {...props}
      />
    );
  }
);
Steps.displayName = "Steps";

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  completed?: boolean;
}

const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ className, active, completed, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative pl-8 pb-8 last:pb-0 after:absolute after:left-[0.65rem] after:top-7 after:h-[calc(100%-1.75rem)] after:w-px after:bg-border last:after:hidden",
          className,
          {
            "after:bg-primary": active || completed,
          }
        )}
        {...props}
      />
    );
  }
);
Step.displayName = "Step";

interface StepHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const StepHeader = React.forwardRef<HTMLHeadingElement, StepHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("text-base font-medium", className)}
        {...props}
      />
    );
  }
);
StepHeader.displayName = "StepHeader";

interface StepDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const StepDescription = React.forwardRef<
  HTMLParagraphElement,
  StepDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
StepDescription.displayName = "StepDescription";

interface StepCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  active?: boolean;
  completed?: boolean;
}

const StepCircle = React.forwardRef<HTMLDivElement, StepCircleProps>(
  ({ className, icon, active, completed, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background",
          {
            "border-primary": active,
            "border-primary bg-primary": completed,
          },
          className
        )}
        {...props}
      >
        {icon && (
          <div className="h-2.5 w-2.5 text-primary dark:text-primary-foreground">
            {icon}
          </div>
        )}
      </div>
    );
  }
);
StepCircle.displayName = "StepCircle";

// Attach subcomponents to Step
Step.Header = StepHeader;
Step.Description = StepDescription;
Step.Circle = StepCircle;

// Only export once - fixing the duplicate export error
export { Step };
