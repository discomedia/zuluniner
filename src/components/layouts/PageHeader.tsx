import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  breadcrumbs?: Array<{ name: string; href?: string }>;
}

export default function PageHeader({ 
  title, 
  description, 
  children, 
  breadcrumbs 
}: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:py-8">
          {breadcrumbs && (
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.name} className="flex items-center">
                    {index > 0 && (
                      <svg
                        className="w-4 h-4 text-neutral-400 mx-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {crumb.href ? (
                      <a
                        href={crumb.href}
                        className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                      >
                        {crumb.name}
                      </a>
                    ) : (
                      <span className="text-sm text-neutral-900 font-medium">
                        {crumb.name}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl md:text-4xl">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-lg text-neutral-600 max-w-3xl">
                  {description}
                </p>
              )}
            </div>
            {children && (
              <div className="mt-4 flex-shrink-0 md:mt-0 md:ml-4">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}