import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border-[3px] border-neo-black bg-white px-4 py-3 text-sm font-medium text-neo-black shadow-neo transition-all duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-neo-black disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-white/30 dark:bg-neo-dark-card dark:text-white dark:shadow-neo-purple dark:focus-visible:border-white/50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
