'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { siteConfig } from '~/config/site';
import { MainNavItem, SidebarNavItem } from '~/types';

import { cn } from '~/lib/utils';
import { Icons } from '~/components/icons';
import { DashboardNav } from '~/components/nav';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';

interface MainNavProps {
  items?: MainNavItem[];
  mobileNavItems?: SidebarNavItem[];
}

export function MainNav({ items, mobileNavItems }: MainNavProps) {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo className="h-8 w-8" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? '#' : (item.href as any)}
              className={cn(
                'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
                item.href.startsWith(`/${segment}`)
                  ? 'text-foreground'
                  : 'text-foreground/60',
                item.disabled && 'cursor-not-allowed opacity-80',
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}

      <Sheet>
        <SheetTrigger asChild>
          <button className="flex items-center space-x-2 md:hidden">
            <Icons.logo />
            <span className="font-bold">Menu</span>
          </button>
        </SheetTrigger>
        <SheetContent>
          <Link href="/" className="mb-8 flex items-center space-x-2">
            <Icons.logo />
            <span className="font-bold">{siteConfig.name}</span>
          </Link>

          <DashboardNav items={mobileNavItems ?? []} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
