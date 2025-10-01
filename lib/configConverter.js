import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

export async function convertConfig(projectPath) {
  const vercelJsonPath = path.join(projectPath, 'vercel.json');
  const netlifyTomlPath = path.join(projectPath, 'netlify.toml');

  try {
    // Check if vercel.json exists
    const vercelJsonContent = await fs.readFile(vercelJsonPath, 'utf-8');
    const vercelConfig = JSON.parse(vercelJsonContent);

    // Convert to Netlify configuration
    const netlifyConfig = convertVercelToNetlify(vercelConfig);

    // Write netlify.toml
    await fs.writeFile(netlifyTomlPath, netlifyConfig);
    console.log(chalk.green(`✓ Created netlify.toml from vercel.json`));

    return netlifyConfig;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(chalk.yellow('⚠ vercel.json not found, creating basic netlify.toml'));
      const basicConfig = generateBasicNetlifyConfig();
      await fs.writeFile(netlifyTomlPath, basicConfig);
      return basicConfig;
    }
    throw error;
  }
}

function convertVercelToNetlify(vercelConfig) {
  let netlifyToml = `# Netlify configuration\n# Migrated from vercel.json\n\n`;

  // Build settings
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

  // Redirects
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

  // Rewrites (as redirects with status 200)
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

  // Headers
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

  // Environment variables note
  if (vercelConfig.env) {
    netlifyToml += `# Environment Variables\n`;
    netlifyToml += `# Note: Environment variables should be set in Netlify UI or netlify.toml\n`;
    netlifyToml += `# See .env.netlify for variables to migrate\n\n`;
  }

  // Functions (if serverless functions exist)
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
