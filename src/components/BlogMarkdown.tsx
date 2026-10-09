import { Children, createElement, isValidElement, type ReactNode } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

function headingText(children: ReactNode): string {
  return Children.toArray(children).map(child => {
    if (typeof child === 'string' || typeof child === 'number') return String(child);
    if (isValidElement<{ children?: ReactNode }>(child)) return headingText(child.props.children);
    return '';
  }).join('');
}

// A new set for each render keeps duplicate anchors local to one article.
export default function BlogMarkdown({ content }: { content: string }) {
  const anchors = new Set<string>();
  function heading(level: number): NonNullable<Components['h2']> {
    return ({ children }) => {
      const base = headingText(children).toLowerCase()
        .replace(/[^\p{L}\p{N}_\-\s]/gu, '').trim().replace(/\s+/g, '-') || 'section';
      let id = base;
      for (let suffix = 1; anchors.has(id); suffix++) id = `${base}-${suffix}`;
      anchors.add(id);
      return createElement(`h${level}`, { id }, children);
    };
  }
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
    h1: heading(1), h2: heading(2), h3: heading(3),
    h4: heading(4), h5: heading(5), h6: heading(6),
    table: ({ children }) => <div className="max-w-full overflow-x-auto"><table>{children}</table></div>,
  }}>{content}</ReactMarkdown>;
}
