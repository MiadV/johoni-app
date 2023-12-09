import React from 'react';
import { siteConfig } from '~/config/site';

import { cn } from '~/lib/utils';

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          Built by{' '}
          <a
            href={siteConfig.author.website}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            {siteConfig.author.name}
          </a>
          .
        </p>

        <p className="text-center text-sm text-muted-foreground md:text-right">
          Available on{' '}
          <a
            href={siteConfig.author.github}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
