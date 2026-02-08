
export function Logo({ className }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 font-bold text-xl tracking-tight ${className}`}>
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                {/* Abstract shape */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            </div>
            <span>MiniBooteh</span>
        </div>
    );
}
