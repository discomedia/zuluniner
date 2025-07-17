import Link from 'next/link';
import { cn } from '../../lib/utils';

interface BreadcrumbItem {
  name: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.name} className="flex items-center">
            {index > 0 && (
              <svg
                className="w-4 h-4 text-neutral-400 mx-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {item.href && !item.current ? (
              <Link
                href={item.href}
                className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span
                className={cn(
                  'text-sm',
                  item.current ? 'text-neutral-900 font-medium' : 'text-neutral-500'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}