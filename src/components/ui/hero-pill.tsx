import { cn } from "@/lib/utils"
import { Pill, PillStatus } from "@/components/ui/pill"

interface HeroPillProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  text: string
  className?: string
  /**
   * @default true
   */
  animate?: boolean
  isPressed?: boolean
}

export function HeroPill({ 
  icon, 
  text, 
  className,
  animate = true,
  isPressed = false,
  ...props 
}: HeroPillProps) {
  return (
    <div 
      className={cn(
        "mb-4",
        animate && "animate-slide-up-fade",
        className
      )} 
      {...props}
    >
      <Pill
        variant="outline"
        className={cn(
          "inline-flex items-center justify-center px-3 py-1.5 whitespace-normal break-words transition-all duration-200",
          "text-foreground/90 dark:text-foreground/90",
          // Glassmorphism - use important to override Badge defaults
          "!bg-gray-200/60 dark:!bg-[rgba(255,255,255,0.12)]",
          "!border !border-gray-200/60 dark:!border-transparent",
          "backdrop-blur-[10px]",
          isPressed 
            ? "scale-[0.96] !bg-gray-200/70 dark:!bg-[rgba(255,255,255,0.12)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            : "hover:!border-gray-300/80 dark:hover:!border-white/40"
        )}
      >
        {icon && (
          <PillStatus className="shrink-0 border-border">
            {icon}
          </PillStatus>
        )}
        {text}
      </Pill>
    </div>
  )
}

export function StarIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={12} 
      height={12} 
      fill="none"
      className="transition-transform group-hover:scale-110 duration-300"
    >
      <path
        className="fill-zinc-500"
        d="M6.958.713a1 1 0 0 0-1.916 0l-.999 3.33-3.33 1a1 1 0 0 0 0 1.915l3.33.999 1 3.33a1 1 0 0 0 1.915 0l.999-3.33 3.33-1a1 1 0 0 0 0-1.915l-3.33-.999-1-3.33Z"
      />
    </svg>
  )
}