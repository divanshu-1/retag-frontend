import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const content = <span className="font-headline">ReTag</span>;
  const classes = cn("flex items-center gap-2 text-2xl font-bold", className);

  if (onNavigate) {
    return (
      <button onClick={onNavigate} className={cn(classes, "p-0 border-none bg-transparent")}>
        {content}
      </button>
    );
  }

  return (
    <Link href="/" className={classes}>
      {content}
    </Link>
  );
}
