import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type BreadcrumbItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.label}>
            <div className="flex items-center">
              {index < items.length - 1 ? (
                item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className="font-medium text-muted-foreground hover:text-foreground bg-transparent border-none p-0 cursor-pointer"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className="font-medium text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                )
              ) : (
                <span className="font-medium text-foreground">{item.label}</span>
              )}
              {index < items.length - 1 && (
                <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
