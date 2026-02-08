"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Using native anchor links for simplicity, but could be enhanced with smooth scroll
const sections = [
    { id: "companion", label: "همراه هوشمند" },
    { id: "roadmap", label: "مسیر رشد" },
    { id: "episodes", label: "تمرین تعاملی" },
    { id: "analytics", label: "پیشرفت" },
    { id: "workspace", label: "فضای تیم" },
    { id: "hiring", label: "استخدام و توسعه" },
];

export function SectionNavigator() {
    const [active, setActive] = useState("companion");

    return (
        <div className="sticky top-20 z-40 w-full backdrop-blur-md bg-background/80 border-b border-white/5 overflow-x-auto no-scrollbar hidden md:block">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-8 h-14">
                    {sections.map((section) => (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            onClick={() => setActive(section.id)}
                            className={cn(
                                "text-sm font-medium transition-colors whitespace-nowrap border-b-2 py-4",
                                active === section.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {section.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
