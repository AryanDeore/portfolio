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
}

export function HeroPill({ 
  icon, 
  text, 
  className,
  animate = true,
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
        className="inline-flex items-center justify-center bg-background px-3 py-1.5 text-foreground/90 dark:text-foreground/80 shadow-sm shadow-black/[.12] dark:bg-accent hover:bg-accent/80 transition-colors border-0 whitespace-normal break-words"
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