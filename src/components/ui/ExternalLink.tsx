'use client';
import Icon from '../svgs/Icons';

interface ExternalLinkProps {
  href: string | null
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
    href && href.length > 0 ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-black font-medium cursor-pointer flex items-center justify-start gap-3.5 ${className}`}
      title={title}
    >
      {children}
      <Icon name="externalLinkIcon" />
    </a>
    ) : (
      <span className="text-black">N/A</span>
    )
  );
}