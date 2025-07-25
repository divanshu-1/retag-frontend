/**
 * Button Component for ReTag Marketplace
 *
 * A flexible, accessible button component built with Radix UI and styled
 * with Tailwind CSS. Supports multiple variants, sizes, and can render
 * as different elements using the asChild prop.
 *
 * Features:
 * - Multiple visual variants (default, destructive, outline, etc.)
 * - Different sizes (sm, default, lg, icon)
 * - Accessibility features (focus rings, disabled states)
 * - Icon support with proper sizing
 * - Can render as child element using Radix Slot
 *
 * @author ReTag Team
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button Variant Styles
 * Uses class-variance-authority (cva) to create type-safe variant styles
 */
const buttonVariants = cva(
  // Base styles applied to all buttons
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      // Visual variants
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Size variants
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    // Default variant and size
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button Props Interface
 * Extends standard button HTML attributes with variant props
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean  // When true, renders as child element instead of button
}

/**
 * Button Component
 *
 * Forwardable button component that can render as different elements
 * using the asChild prop. Combines variant styles with custom className.
 *
 * @param className - Additional CSS classes
 * @param variant - Visual variant (default, destructive, outline, etc.)
 * @param size - Size variant (sm, default, lg, icon)
 * @param asChild - Render as child element using Radix Slot
 * @param props - Standard button HTML attributes
 * @param ref - Forwarded ref to button element
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Use Slot for asChild or regular button element
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
