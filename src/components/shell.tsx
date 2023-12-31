import * as React from 'react';

import { cn } from '~/lib/utils';

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className={cn('grid items-start gap-8', className)} {...props}>
      {children}
    </div>
  );
}

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="grid gap-1">
        <h1 className="text-xl font-bold md:text-4xl">{heading}</h1>
        {text && (
          <p className="text-sm text-muted-foreground md:text-lg">{text}</p>
        )}
      </div>
      {children}
    </div>
  );
}
