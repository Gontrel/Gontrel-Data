'use client';

import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

/**
 * Reusable external link component with icon
 */
export function ExternalLink({
  href,
  children,
  className = '',
  title
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-black font-medium cursor-pointer flex items-center justify-start gap-3.5 ${className}`}
      title={title}
    >
      {children}
      <ExternalLinkIcon className="w-4.5 h-4.5 text-[#AF08FD]" />
    </a>
  );
}