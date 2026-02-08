"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
    { href: "/resources", label: "ویژگی‌ها" },
    { href: "/resources", label: "منابع" },
    { href: "/pricing", label: "قیمت‌گذاری" },
    { href: "/about", label: "درباره ما" },
];

export function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
                    ? "bg-background/80 backdrop-blur-md border-border"
                    : "bg-transparent border-transparent"
                }`}
        >
            <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo className="text-primary" />
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={`${item.href}-${item.label}`}
                                href={item.href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        <Button variant="ghost" asChild>
                            <Link href="/admin/login">ورود</Link>
                        </Button>
                        <Button variant="shine" size="sm" asChild>
                            <Link href="/start">شروع رایگان</Link>
                        </Button>
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="size-5" />
                                <span className="sr-only">منو</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <div className="flex flex-col gap-8 mt-8">
                                <SheetTitle className="hidden">Nav Menu</SheetTitle>
                                <div className="flex flex-col gap-4">
                                    {navItems.map((item) => (
                                        <Link
                                            key={`${item.href}-${item.label}`}
                                            href={item.href}
                                            className="text-lg font-medium hover:text-primary transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-4 mt-auto">
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/admin/login">ورود</Link>
                                    </Button>
                                    <Button variant="shine" className="w-full" asChild>
                                        <Link href="/start">شروع رایگان</Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
