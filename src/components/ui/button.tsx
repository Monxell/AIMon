import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "border-[3px] border-neo-black shadow-neo active:shadow-neo-active active:translate-x-[4px] active:translate-y-[4px] hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px]",
          "dark:border-white/30 dark:shadow-neo-purple",
          variant === "default" && "bg-neo-yellow text-neo-black dark:bg-neo-purple dark:text-white",
          variant === "outline" && "bg-transparent text-neo-black dark:text-white dark:bg-transparent",
          variant === "ghost" && "border-0 shadow-none hover:shadow-none active:shadow-none translate-none hover:translate-none active:translate-none bg-transparent",
          size === "default" && "h-12 px-6 py-3",
          size === "sm" && "h-9 px-4 py-2",
          size === "lg" && "h-14 px-8 py-4 text-base",
          size === "icon" && "h-12 w-12",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
