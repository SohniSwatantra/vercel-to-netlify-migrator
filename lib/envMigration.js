import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

export async function migrateEnvVars(projectPath) {
  const envFiles = ['.env', '.env.local', '.env.production', '.env.development'];
  const netlifyEnvPath = path.join(projectPath, '.env.netlify');

  let allEnvVars = {};
  let foundFiles = [];

  // Read all .env files
  for (const envFile of envFiles) {
    const envPath = path.join(projectPath, envFile);
    try {
      const content = await fs.readFile(envPath, 'utf-8');
      foundFiles.push(envFile);

      // Parse env vars
      const vars = parseEnvFile(content);
      allEnvVars = { ...allEnvVars, ...vars };
    } catch (error) {
      // File doesn't exist, continue
      if (error.code !== 'ENOENT') {
        console.error(chalk.yellow(`⚠ Error reading ${envFile}:`, error.message));
      }
    }
  }

  if (foundFiles.length === 0) {
    console.log(chalk.yellow('⚠ No .env files found'));
    return;
  }

  // Generate .env.netlify with instructions
  let netlifyEnvContent = `# Environment Variables for Netlify
# Migrated from: ${foundFiles.join(', ')}
#
# IMPORTANT: Set these in Netlify UI or via Netlify CLI:
# 1. Go to Site settings > Environment variables in Netlify dashboard
# 2. Or use: netlify env:set KEY value
#
# For sensitive values, use Netlify's Secrets Controller
# Never commit sensitive data to git
#
# Variables with NEXT_PUBLIC_ prefix are available in the browser
# Other variables are only available server-side
\n`;

  const publicVars = [];
  const privateVars = [];

  Object.entries(allEnvVars).forEach(([key, value]) => {
    if (key.startsWith('NEXT_PUBLIC_') || key.startsWith('VITE_') || key.startsWith('REACT_APP_')) {
      publicVars.push({ key, value });
    } else {
      privateVars.push({ key, value });
    }
  });

  if (privateVars.length > 0) {
    netlifyEnvContent += `# Server-side variables (not exposed to browser)\n`;
    privateVars.forEach(({ key, value }) => {
      netlifyEnvContent += `${key}=${value}\n`;
    });
    netlifyEnvContent += `\n`;
  }

  if (publicVars.length > 0) {
    netlifyEnvContent += `# Client-side variables (exposed to browser)\n`;
    publicVars.forEach(({ key, value }) => {
      netlifyEnvContent += `${key}=${value}\n`;
    });
  }

  // Write .env.netlify
  await fs.writeFile(netlifyEnvPath, netlifyEnvContent);
  console.log(chalk.green(`✓ Created .env.netlify with ${Object.keys(allEnvVars).length} variables`));

  // Create instructions file
  const instructionsPath = path.join(projectPath, 'ENV_MIGRATION_INSTRUCTIONS.md');
  const instructions = generateEnvInstructions(allEnvVars, publicVars.length, privateVars.length);
  await fs.writeFile(instructionsPath, instructions);
  console.log(chalk.green(`✓ Created ENV_MIGRATION_INSTRUCTIONS.md`));

  // Generate CLI commands file
  const cliCommandsPath = path.join(projectPath, 'netlify-env-commands.sh');
  const cliCommands = generateNetlifyCLICommands(allEnvVars);
  await fs.writeFile(cliCommandsPath, cliCommands);
  await fs.chmod(cliCommandsPath, 0o755);
  console.log(chalk.green(`✓ Created netlify-env-commands.sh (executable script)`));
}

function parseEnvFile(content) {
  const vars = {};
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Parse KEY=VALUE
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      vars[key] = value;
    }
  }

  return vars;
}

function generateEnvInstructions(allVars, publicCount, privateCount) {
  return `# Environment Variables Migration Instructions

## Summary
- **Total variables found:** ${Object.keys(allVars).length}
- **Public variables:** ${publicCount} (browser-accessible)
- **Private variables:** ${privateCount} (server-only)

## Migration Steps

### Option 1: Using Netlify UI (Recommended for sensitive data)

1. Go to your site in Netlify Dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Click **Add a variable** for each environment variable
4. Set the appropriate scope:
   - **Builds:** Available during build time
   - **Functions:** Available to serverless functions
   - **Post processing:** Available to plugins

### Option 2: Using Netlify CLI

Run the generated script:
\`\`\`bash
./netlify-env-commands.sh
\`\`\`

Or set variables individually:
\`\`\`bash
netlify env:set VARIABLE_NAME "value"
\`\`\`

### Option 3: Using netlify.toml (Not recommended for secrets)

Add to \`netlify.toml\`:
\`\`\`toml
[build.environment]
  PUBLIC_VAR = "value"
  # Do NOT put sensitive values here
\`\`\`

## Important Notes

⚠️ **Security:**
- Never commit \`.env.netlify\` to git if it contains sensitive data
- Add \`.env.netlify\` to \`.gitignore\`
- Use Netlify Secrets Controller for sensitive values

📝 **Framework-specific prefixes:**
- Next.js: \`NEXT_PUBLIC_\` for client-side vars
- Vite: \`VITE_\` for client-side vars
- Create React App: \`REACT_APP_\` for client-side vars

🔄 **Context-specific variables:**
You can set different values for different deploy contexts:
- Production
- Deploy Previews
- Branch deploys

## Testing

After setting variables:
1. Trigger a new deploy
2. Check build logs for any missing variables
3. Test functionality that depends on these variables
`;
}

function generateNetlifyCLICommands(allVars) {
  let script = `#!/bin/bash
# Netlify Environment Variables Setup Script
# Generated by vercel-to-netlify-migrator
#
# Usage: ./netlify-env-commands.sh
#
# Make sure you have Netlify CLI installed and authenticated:
# npm install -g netlify-cli
# netlify login

echo "Setting environment variables in Netlify..."
echo ""

`;

  Object.entries(allVars).forEach(([key, value]) => {
    // Escape special characters in value
    const escapedValue = value.replace(/"/g, '\\"').replace(/\$/g, '\\$');
    script += `netlify env:set ${key} "${escapedValue}"\n`;
  });

  script += `
echo ""
echo "✓ All environment variables have been set"
echo "Run 'netlify env:list' to verify"
`;

  return script;
}
