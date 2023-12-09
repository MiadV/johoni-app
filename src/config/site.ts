import { DashboardConfig } from '~/types';

export const siteConfig = {
  name: 'Johoni',
  description: 'Stock management system for Johoni.',
  author: {
    name: 'Miad Vosoughi',
    website: 'https://miadv.dev',
    github: 'https://github.com/miadv',
  },
};

export type SiteConfig = typeof siteConfig;

export const dashboardConfig: DashboardConfig = {
  mainNav: [],
  sidebarNav: [
    {
      title: 'Order History',
      href: '/',
      icon: 'fileStack',
    },
    {
      title: 'Manage Stock',
      href: '/hq/stocks',
      icon: 'packageCheck',
    },
  ],
};
