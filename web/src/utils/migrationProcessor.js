// Client-side migration processing - NO DATA SENT TO SERVER
// All processing happens in the browser for security

export function convertVercelToNetlify(vercelConfig) {
  let netlifyToml = `# Netlify configuration\n# Migrated from vercel.json\n\n`;

  if (vercelConfig.buildCommand || vercelConfig.devCommand) {
    netlifyToml += `[build]\n`;
    if (vercelConfig.buildCommand) {
      netlifyToml += `  command = "${vercelConfig.buildCommand}"\n`;
    }
    if (vercelConfig.outputDirectory) {
      netlifyToml += `  publish = "${vercelConfig.outputDirectory}"\n`;
    } else if (vercelConfig.framework === 'nextjs') {
      netlifyToml += `  publish = ".next"\n`;
    }
    netlifyToml += `\n`;
  }

  if (vercelConfig.redirects && vercelConfig.redirects.length > 0) {
    netlifyToml += `# Redirects\n`;
    vercelConfig.redirects.forEach((redirect) => {
      netlifyToml += `[[redirects]]\n`;
      netlifyToml += `  from = "${redirect.source}"\n`;
      netlifyToml += `  to = "${redirect.destination}"\n`;
      netlifyToml += `  status = ${redirect.permanent ? 301 : 302}\n`;
      if (redirect.has) {
        netlifyToml += `  # Note: Conditional redirects may need manual adjustment\n`;
      }
      netlifyToml += `\n`;
    });
  }

  if (vercelConfig.rewrites && vercelConfig.rewrites.length > 0) {
    netlifyToml += `# Rewrites\n`;
    vercelConfig.rewrites.forEach((rewrite) => {
      netlifyToml += `[[redirects]]\n`;
      netlifyToml += `  from = "${rewrite.source}"\n`;
      netlifyToml += `  to = "${rewrite.destination}"\n`;
      netlifyToml += `  status = 200\n`;
      netlifyToml += `\n`;
    });
  }

  if (vercelConfig.headers && vercelConfig.headers.length > 0) {
    netlifyToml += `# Headers\n`;
    vercelConfig.headers.forEach((headerConfig) => {
      netlifyToml += `[[headers]]\n`;
      netlifyToml += `  for = "${headerConfig.source}"\n`;
      if (headerConfig.headers) {
        netlifyToml += `  [headers.values]\n`;
        headerConfig.headers.forEach((header) => {
          netlifyToml += `    ${header.key} = "${header.value}"\n`;
        });
      }
      netlifyToml += `\n`;
    });
  }

  if (vercelConfig.functions) {
    netlifyToml += `[functions]\n`;
    netlifyToml += `  directory = "netlify/functions"\n`;
    netlifyToml += `  # Note: Vercel API routes should be migrated to Netlify Functions\n\n`;
  }

  return netlifyToml;
}

export function generateBasicNetlifyConfig() {
  return `# Netlify configuration

[build]
  # Your build command
  command = "npm run build"
  # Directory to publish (change based on your framework)
  publish = "dist"

# Example redirect
# [[redirects]]
#   from = "/old-path"
#   to = "/new-path"
#   status = 301

# Example headers
# [[headers]]
#   for = "/*"
#   [headers.values]
#     X-Frame-Options = "DENY"
#     X-XSS-Protection = "1; mode=block"
`;
}

export function parseEnvFile(content) {
  const vars = {};
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();

      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      vars[key] = value;
    }
  }

  return vars;
}

export function generateEnvFiles(envVars) {
  const publicVars = [];
  const privateVars = [];

  Object.entries(envVars).forEach(([key, value]) => {
    if (key.startsWith('NEXT_PUBLIC_') || key.startsWith('VITE_') || key.startsWith('REACT_APP_')) {
      publicVars.push({ key, value });
    } else {
      privateVars.push({ key, value });
    }
  });

  let envFile = `# Environment Variables for Netlify\n#\n# IMPORTANT: Set these in Netlify UI or via Netlify CLI\n# Never commit sensitive data to git\n\n`;

  if (privateVars.length > 0) {
    envFile += `# Server-side variables (not exposed to browser)\n`;
    privateVars.forEach(({ key, value }) => {
      envFile += `${key}=${value}\n`;
    });
    envFile += `\n`;
  }

  if (publicVars.length > 0) {
    envFile += `# Client-side variables (exposed to browser)\n`;
    publicVars.forEach(({ key, value }) => {
      envFile += `${key}=${value}\n`;
    });
  }

  const instructions = `# Environment Variables Migration Instructions

## Summary
- **Total variables:** ${Object.keys(envVars).length}
- **Public variables:** ${publicVars.length}
- **Private variables:** ${privateVars.length}

## Migration Options

### Option 1: Netlify UI (Recommended for Secrets)
1. Go to Site settings > Environment variables
2. Add each variable with appropriate scope
3. **MOST SECURE** - Secrets never leave Netlify

### Option 2: Netlify CLI
Use the generated \`netlify-env-commands.sh\` script:
\`\`\`bash
./netlify-env-commands.sh
\`\`\`

Or set individually:
\`\`\`bash
netlify env:set VARIABLE_NAME "value"
\`\`\`

### Option 3: netlify.toml (NOT for secrets)
Only for non-sensitive public variables:
\`\`\`toml
[build.environment]
  PUBLIC_VAR = "value"
\`\`\`

## Security Best Practices

⚠️ **CRITICAL SECURITY NOTES:**
- ✅ This tool processes everything **client-side only** (in your browser)
- ✅ Your environment variables are **NEVER sent to any server**
- ✅ All processing happens locally on your machine
- ⚠️ Never commit .env files to git
- ⚠️ Use Netlify Secrets Controller for API keys and passwords
- ⚠️ Rotate any secrets that may have been exposed

## Framework-Specific Prefixes

- **Next.js**: \`NEXT_PUBLIC_\` for client-side vars
- **Vite**: \`VITE_\` for client-side vars
- **Create React App**: \`REACT_APP_\` for client-side vars
- **Others**: Check your framework documentation

## Context-Specific Variables

You can set different values for:
- Production deployments
- Deploy Previews
- Branch deploys
`;

  let cliCommands = `#!/bin/bash
# Netlify Environment Variables Setup
# Generated client-side - your secrets were never uploaded

echo "Setting environment variables in Netlify..."
echo ""

`;
  Object.entries(envVars).forEach(([key, value]) => {
    const escapedValue = value.replace(/"/g, '\\"').replace(/\$/g, '\\$');
    cliCommands += `netlify env:set ${key} "${escapedValue}"\n`;
  });
  cliCommands += `
echo ""
echo "✓ Complete"
echo "Run 'netlify env:list' to verify"
`;

  return { envFile, instructions, cliCommands };
}

export function generateChecklist(framework) {
  return `# Vercel to Netlify Migration Checklist

**Framework:** ${framework}
**Generated:** ${new Date().toISOString().split('T')[0]}

## Pre-Migration
- [ ] Document current Vercel setup
- [ ] Backup all configurations
- [ ] Review environment variables
${framework === 'Next.js' ? '- [ ] Upgrade Next.js to 13.5+\n- [ ] Check ISR and API routes' : ''}

## Configuration
- [ ] Review generated netlify.toml
- [ ] Set environment variables in Netlify (UI or CLI)
- [ ] Configure domains

## Security Checklist
- [ ] Verify no secrets are committed to git
- [ ] Use Netlify UI for sensitive environment variables
- [ ] Review .gitignore includes .env files
- [ ] Rotate any potentially exposed secrets

## Testing
- [ ] Test build locally: \`netlify build\`
- [ ] Test dev server: \`netlify dev\`
- [ ] Create deploy preview
- [ ] Test all functionality
- [ ] Verify environment variables work

## Go-Live
- [ ] Update DNS settings
- [ ] Monitor deployment
- [ ] Verify all features
- [ ] Check error logs

## Resources
- [Netlify Docs](https://docs.netlify.com/)
- [Migration Guide](https://docs.netlify.com/resources/checklists/vercel-to-netlify-migration/)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/)
`;
}

export function processMigration({ vercelJson, envVars, framework, generateChecklistFlag }) {
  const result = {};

  // Process vercel.json
  if (vercelJson) {
    try {
      const vercelConfig = JSON.parse(vercelJson);
      result.netlifyToml = convertVercelToNetlify(vercelConfig);
    } catch (error) {
      result.netlifyToml = generateBasicNetlifyConfig();
    }
  } else {
    result.netlifyToml = generateBasicNetlifyConfig();
  }

  // Process environment variables (CLIENT-SIDE ONLY)
  if (envVars) {
    const parsedEnvVars = parseEnvFile(envVars);
    const envFiles = generateEnvFiles(parsedEnvVars);
    result.envFile = envFiles.envFile;
    result.envInstructions = envFiles.instructions;
    result.cliCommands = envFiles.cliCommands;
  }

  // Generate checklist
  if (generateChecklistFlag) {
    result.checklist = generateChecklist(framework);
  }

  return result;
}
