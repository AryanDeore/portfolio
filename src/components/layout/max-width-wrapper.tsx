import { cn } from "@/lib/utils";

interface MaxWidthWrapperProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "7xl";
}

export function MaxWidthWrapper({ 
  children, 
  className,
  maxWidth = "6xl" 
}: MaxWidthWrapperProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",      // 384px
    md: "max-w-md",      // 448px  
    lg: "max-w-lg",      // 512px
    xl: "max-w-xl",      // 576px
    "2xl": "max-w-2xl",  // 672px
    "4xl": "max-w-4xl",  // 896px
    "6xl": "max-w-6xl",  // 1152px
    "7xl": "max-w-7xl",  // 1280px
  };

  return (
    <div className={cn(
      "mx-auto w-full px-4 sm:px-6 lg:px-8",
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}
