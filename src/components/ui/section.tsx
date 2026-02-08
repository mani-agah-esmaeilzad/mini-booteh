import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  container?: boolean;
}

export function Section({
  children,
  className,
  container = true,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("py-20 md:py-32 overflow-hidden", className)}
      {...props}
    >
      {container ? (
        <div className="container px-4 md:px-6 mx-auto relative">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
