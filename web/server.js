import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Import migration logic
function convertVercelToNetlify(vercelConfig) {
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

function generateBasicNetlifyConfig() {
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

function parseEnvFile(content) {
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

function generateEnvFiles(envVars) {
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

### Option 1: Netlify UI (Recommended)
1. Go to Site settings > Environment variables
2. Add each variable with appropriate scope

### Option 2: Netlify CLI
Use the generated \`netlify-env-commands.sh\` script:
\`\`\`bash
./netlify-env-commands.sh
\`\`\`

### Option 3: Individual Commands
\`\`\`bash
netlify env:set VARIABLE_NAME "value"
\`\`\`

## Security Notes
⚠️ Never commit sensitive values to git
⚠️ Use Netlify Secrets Controller for API keys
`;

  let cliCommands = `#!/bin/bash\n# Netlify Environment Variables Setup\n\necho "Setting environment variables..."\n\n`;
  Object.entries(envVars).forEach(([key, value]) => {
    const escapedValue = value.replace(/"/g, '\\"').replace(/\$/g, '\\$');
    cliCommands += `netlify env:set ${key} "${escapedValue}"\n`;
  });
  cliCommands += `\necho "✓ Complete"\n`;

  return { envFile, instructions, cliCommands };
}

function generateChecklist(framework) {
  return `# Vercel to Netlify Migration Checklist

**Framework:** ${framework}
**Generated:** ${new Date().toISOString().split('T')[0]}

## Pre-Migration
- [ ] Document current Vercel setup
- [ ] Backup all configurations
- [ ] Review environment variables
${framework === 'Next.js' ? '- [ ] Upgrade Next.js to 13.5+\n- [ ] Check ISR and API routes' : ''}

## Configuration
- [ ] Review netlify.toml
- [ ] Set environment variables
- [ ] Configure domains

## Testing
- [ ] Test build locally: \`netlify build\`
- [ ] Test dev server: \`netlify dev\`
- [ ] Deploy preview
- [ ] Test all functionality

## Go-Live
- [ ] Update DNS settings
- [ ] Monitor deployment
- [ ] Verify all features

## Resources
- [Netlify Docs](https://docs.netlify.com/)
- [Migration Guide](https://docs.netlify.com/resources/checklists/vercel-to-netlify-migration/)
`;
}

// API endpoint
app.post('/api/migrate', (req, res) => {
  try {
    const { vercelJson, envVars, framework, generateChecklist: shouldGenerateChecklist } = req.body;

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

    // Process environment variables
    if (envVars) {
      const parsedEnvVars = parseEnvFile(envVars);
      const envFiles = generateEnvFiles(parsedEnvVars);
      result.envFile = envFiles.envFile;
      result.envInstructions = envFiles.instructions;
      result.cliCommands = envFiles.cliCommands;
    }

    // Generate checklist
    if (shouldGenerateChecklist) {
      result.checklist = generateChecklist(framework);
    }

    res.json(result);
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ error: 'Migration failed', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Migration API server running on http://localhost:${PORT}`);
});
