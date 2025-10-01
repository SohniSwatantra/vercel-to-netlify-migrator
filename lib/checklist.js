import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

export async function generateChecklist(projectPath, framework = 'Next.js') {
  const checklistPath = path.join(projectPath, 'MIGRATION_CHECKLIST.md');
  const checklist = createMigrationChecklist(framework);

  await fs.writeFile(checklistPath, checklist);
  console.log(chalk.green(`✓ Created migration checklist`));

  return checklist;
}

function createMigrationChecklist(framework) {
  return `# Vercel to Netlify Migration Checklist

**Framework:** ${framework}
**Generated:** ${new Date().toISOString().split('T')[0]}

## Pre-Migration Preparation

### Documentation & Audit
- [ ] Document current Vercel configuration
- [ ] List all custom domains and DNS configurations
- [ ] Review current deployment workflow
- [ ] Identify Vercel-specific features in use
- [ ] Audit current build times and performance metrics
- [ ] Export analytics and monitoring data

### Code Preparation
${framework === 'Next.js' ? `- [ ] Upgrade Next.js to version 13.5 or higher
- [ ] Verify \`next/image\` usage (compatible with Netlify Image CDN)
- [ ] Check for ISR (Incremental Static Regeneration) usage
- [ ] Review API routes (may need migration to Netlify Functions)
- [ ] Verify middleware compatibility` : '- [ ] Review framework-specific requirements for Netlify'}
- [ ] Run local build to ensure everything works
- [ ] Update dependencies to latest stable versions

## Configuration Migration

### Files & Settings
- [ ] Convert \`vercel.json\` to \`netlify.toml\` (automated ✓)
- [ ] Migrate redirects and rewrites
- [ ] Migrate headers configuration
- [ ] Review and update build commands
- [ ] Set correct publish directory
- [ ] Configure function directory (if using serverless functions)

### Environment Variables
- [ ] Export all environment variables from Vercel
- [ ] Review \`.env.netlify\` file (automated ✓)
- [ ] Set variables in Netlify UI or via CLI
- [ ] Configure context-specific variables (production, preview, branch)
- [ ] Use Netlify Secrets Controller for sensitive data
- [ ] Verify \`NEXT_PUBLIC_\` or framework-specific public variable prefixes
- [ ] Test that all environment variables are accessible

## Netlify Setup

### Account & Site Configuration
- [ ] Create Netlify account (if needed)
- [ ] Connect Git repository to Netlify
- [ ] Configure build settings in Netlify UI
- [ ] Set up team access and permissions
- [ ] Configure notification preferences

### Domain & DNS
- [ ] Add custom domain(s) in Netlify
- [ ] Configure DNS settings
  - [ ] Update nameservers to Netlify (recommended)
  - [ ] Or add DNS records manually (A/CNAME)
- [ ] Enable HTTPS/SSL (automatic with Netlify)
- [ ] Set up domain aliases if needed
- [ ] Configure www to apex redirect (or vice versa)

### Advanced Features
- [ ] Set up Deploy Previews for pull requests
- [ ] Configure branch deploys if needed
- [ ] Set up build hooks for automated deployments
- [ ] Configure split testing (A/B testing) if needed
- [ ] Set up forms (if migrating from Vercel Edge Config or forms)
- [ ] Configure analytics

## Code Changes

### Framework-Specific Adjustments
${framework === 'Next.js' ? `- [ ] Update \`next.config.js\` if needed
- [ ] Configure headers in \`next.config.js\`
- [ ] Verify image optimization settings
- [ ] Test API routes or migrate to Netlify Functions
- [ ] Check middleware compatibility
- [ ] Verify Edge Runtime usage (may need adjustment)` : '- [ ] Make framework-specific configuration changes'}

### Serverless Functions
- [ ] Migrate Vercel Edge Functions to Netlify Functions
- [ ] Update function paths and imports
- [ ] Test function endpoints locally
- [ ] Verify function timeouts and limits
- [ ] Update client-side API calls if function URLs changed

### Dependencies
- [ ] Add \`@netlify/plugin-nextjs\` if using Next.js
- [ ] Install Netlify CLI: \`npm install -g netlify-cli\`
- [ ] Update package.json scripts if needed

## Testing

### Local Testing
- [ ] Install Netlify CLI: \`netlify login\`
- [ ] Link project: \`netlify link\`
- [ ] Test build locally: \`netlify build\`
- [ ] Test functions locally: \`netlify dev\`
- [ ] Test environment variables are loaded correctly

### Deploy Preview Testing
- [ ] Create deploy preview
- [ ] Test all pages and routes
- [ ] Verify redirects work correctly
- [ ] Test forms functionality
- [ ] Verify API/function endpoints
- [ ] Check console for errors
- [ ] Test authentication flows (if applicable)
- [ ] Verify third-party integrations
- [ ] Test on multiple browsers and devices
- [ ] Run performance audits (Lighthouse, WebPageTest)

### ${framework} Specific Testing
${framework === 'Next.js' ? `- [ ] Test SSR (Server-Side Rendering) pages
- [ ] Test SSG (Static Site Generation) pages
- [ ] Test ISR (Incremental Static Regeneration) if used
- [ ] Verify Image Optimization
- [ ] Test dynamic routes
- [ ] Verify internationalization (i18n) if used` : '- [ ] Test framework-specific features'}

## Performance & Optimization

- [ ] Compare build times (Vercel vs Netlify)
- [ ] Run Lighthouse performance audit
- [ ] Verify asset optimization (images, fonts, etc.)
- [ ] Check bundle size
- [ ] Test cache headers
- [ ] Verify CDN distribution
- [ ] Test loading speeds from different geographic locations

## Go-Live Preparation

### Pre-Launch
- [ ] Complete all testing checklist items
- [ ] Prepare rollback plan
- [ ] Schedule maintenance window if needed
- [ ] Notify team of go-live timeline
- [ ] Set up monitoring and alerts

### DNS Cutover
- [ ] Lower DNS TTL 24-48 hours before migration
- [ ] Update DNS records to point to Netlify
- [ ] Monitor DNS propagation
- [ ] Verify site loads on new infrastructure
- [ ] Restore normal DNS TTL

### Post-Launch
- [ ] Monitor error rates and performance
- [ ] Check analytics for traffic patterns
- [ ] Verify all functions working correctly
- [ ] Test forms and integrations
- [ ] Monitor build success rate
- [ ] Update documentation with new deployment URLs

## Post-Migration

### Cleanup
- [ ] Update CI/CD pipeline if needed
- [ ] Update documentation and README
- [ ] Remove Vercel-specific code/config
- [ ] Archive Vercel project (after confirmation)
- [ ] Update team knowledge base
- [ ] Delete old preview deployments in Vercel

### Optimization
- [ ] Review Netlify build plugins
- [ ] Optimize build settings for faster deploys
- [ ] Set up edge handlers if needed
- [ ] Configure caching strategies
- [ ] Review and optimize function cold starts

### Monitoring & Maintenance
- [ ] Set up uptime monitoring
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up performance monitoring
- [ ] Schedule regular dependency updates
- [ ] Document new deployment process

## Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify CLI Documentation](https://cli.netlify.com/)
- [Netlify Next.js Plugin](https://github.com/netlify/netlify-plugin-nextjs)
- [Netlify Community Forums](https://answers.netlify.com/)
- [Netlify Status Page](https://www.netlifystatus.com/)

## Notes

Add any migration-specific notes, issues, or decisions here:

---

**Migration Status:** In Progress
**Started:** ${new Date().toISOString().split('T')[0]}
**Target Go-Live:** [Set your target date]
`;
}
