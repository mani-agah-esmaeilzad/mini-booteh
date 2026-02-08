"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const AccordionContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
}>({})

const Accordion = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        type?: "single" | "multiple"
        collapsible?: boolean
        defaultValue?: string
        onValueChange?: (value: string) => void
    }
>(({ className, type, collapsible, defaultValue, onValueChange, ...props }, ref) => {
    const [value, setValue] = React.useState<string | undefined>(defaultValue)

    const handleValueChange = React.useCallback(
        (newValue: string) => {
            if (collapsible && value === newValue) {
                setValue(undefined)
                onValueChange?.("")
            } else {
                setValue(newValue)
                onValueChange?.(newValue)
            }
        },
        [collapsible, onValueChange, value]
    )

    return (
        <AccordionContext.Provider value={{ value, onValueChange: handleValueChange }}>
            <div ref={ref} className={className} {...props} />
        </AccordionContext.Provider>
    )
})
Accordion.displayName = "Accordion"

const AccordionItemContext = React.createContext<{ value?: string }>({})

const AccordionItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => (
    <AccordionItemContext.Provider value={{ value }}>
        <div ref={ref} className={cn("border-b", className)} {...props} />
    </AccordionItemContext.Provider>
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const { value: itemValue } = React.useContext(AccordionItemContext)
    const { value: selectedValue, onValueChange } = React.useContext(AccordionContext)
    const isOpen = itemValue === selectedValue

    return (
        <div className="flex">
            <button
                ref={ref}
                onClick={() => itemValue && onValueChange?.(itemValue)}
                className={cn(
                    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&>svg]:transition-transform duration-200",
                    isOpen && "[&>svg]:rotate-180",
                    className
                )}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </button>
        </div>
    )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { value: itemValue } = React.useContext(AccordionItemContext)
    const { value: selectedValue } = React.useContext(AccordionContext)
    const isOpen = itemValue === selectedValue

    if (!isOpen) return null

    return (
        <div
            ref={ref}
            className={cn("overflow-hidden text-sm transition-all animate-accordion-down", className)}
            {...props}
        >
            <div className="pb-4 pt-0">{children}</div>
        </div>
    )
})
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
