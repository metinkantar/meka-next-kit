import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'fr', 'de', 'krd', 'tr', 'nl'],
 
  // Used when no locale matches
  defaultLocale: 'en',
  /* pathnames: {
    '/': '/',
    '/pathnames': {
      de: '/pfadnamen'
    }
  }, */
});