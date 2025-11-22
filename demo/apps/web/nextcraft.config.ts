/**
 * NextCraft Configuration
 * 
 * This file defines your project's mode and features.
 * This is a static configuration file for reference only.
 * 
 * @see https://nextcraft.dev/docs/configuration
 */
const nextcraftConfig = {
  // Project mode: 'frontend' for UI-only, 'fullstack' for complete app
  mode: 'frontend',

  // UI framework: 'shadcn', 'chakra', or 'material'
  ui: 'shadcn',

  // Database provider (fullstack only)
  db: 'sqlite',

  // Enable authentication with Auth.js
  auth: false,

  // Enable Right-to-Left (RTL) support for Arabic/Hebrew
  rtl: false,

  // Enable SEO optimization (meta tags, sitemap, etc.)
  seo: true,
} as const;

export default nextcraftConfig;
