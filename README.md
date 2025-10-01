# Vercel to Netlify Migration Tool

A comprehensive tool to help you migrate your projects from Vercel to Netlify with ease. Available as both a **CLI tool** and a **Web UI**. This tool automates the conversion of configuration files, environment variables, and generates comprehensive migration checklists based on [Netlify's official migration guide](https://docs.netlify.com/resources/checklists/vercel-to-netlify-migration/).

## Features

- 🔄 **Automatic Configuration Conversion**: Converts `vercel.json` to `netlify.toml`
- 🔐 **Environment Variable Migration**: Parses `.env` files and generates Netlify-compatible configuration
- 📋 **Migration Checklist**: Creates comprehensive checklist tailored to your framework
- 🛠️ **CLI Commands Generator**: Generates executable script for Netlify CLI commands
- ⚡ **Framework Support**: Optimized for Next.js, React, Vue, and other frameworks
- 🌐 **Web UI**: User-friendly browser interface for easy migration
- 💻 **CLI**: Command-line interface for automation and scripting

## Installation

```bash
npm install -g vercel-to-netlify-migrator
```

Or run directly with npx:

```bash
npx vercel-to-netlify-migrator migrate
```

Or clone and use locally:

```bash
git clone <repository-url>
cd vercel-to-netlify-migrator
npm install
npm link
```

## Usage

You can use this tool in three ways:

### Option 1: Docker (Most Secure - Recommended) 🔒

Run in complete isolation with maximum security:

```bash
# Quick start with docker-compose
docker-compose up -d

# Access at http://localhost:3000
```

**Security benefits:**
- ✅ Complete container isolation
- ✅ No dependencies on host machine
- ✅ Read-only filesystem
- ✅ Non-root user execution
- ✅ All processing client-side in browser
- ✅ No network access needed

For detailed Docker instructions, see [DOCKER.md](./DOCKER.md)

Alternative Docker methods:
```bash
# Option A: Simple Docker run
docker build -t vercel-netlify-migrator .
docker run -d -p 3000:3000 --read-only vercel-netlify-migrator

# Option B: Ultra-secure isolated build
docker build -f Dockerfile.isolated -t vercel-netlify-migrator:isolated .
docker run -d -p 8080:8080 --network=none vercel-netlify-migrator:isolated
```

### Option 2: Web UI (Local Development)

1. **Start the application:**
   ```bash
   cd vercel-to-netlify-migrator/web
   npm install
   ```

2. **Run in two terminals:**

   Terminal 1 - Start the API server:
   ```bash
   npm run server
   ```

   Terminal 2 - Start the web interface:
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

4. **Use the interface:**
   - Paste or upload your `vercel.json` file
   - Paste or upload your `.env` files
   - Select your framework
   - Click "Start Migration"
   - Download all generated files

### Option 3: CLI (For Automation)

#### Interactive Migration (Recommended)

Navigate to your project directory and run:

```bash
v2n-migrate migrate
```

This will start an interactive wizard that guides you through the migration process.

### Individual Commands

#### Convert Configuration Files

```bash
v2n-migrate convert-config
```

Converts your `vercel.json` to `netlify.toml` with proper mappings for:
- Build commands and output directories
- Redirects and rewrites
- Headers
- Environment variables

#### Migrate Environment Variables

```bash
v2n-migrate env-migrate
```

Processes all `.env` files and generates:
- `.env.netlify`: Consolidated environment variables
- `ENV_MIGRATION_INSTRUCTIONS.md`: Detailed migration instructions
- `netlify-env-commands.sh`: Executable script to set variables via Netlify CLI

#### Generate Migration Checklist

```bash
v2n-migrate checklist --framework "Next.js"
```

Creates `MIGRATION_CHECKLIST.md` with framework-specific tasks covering:
- Pre-migration preparation
- Configuration migration
- Testing procedures
- Go-live checklist
- Post-migration optimization

### Options

All commands support the following options:

- `-p, --path <path>`: Specify project directory (default: current directory)
- `-f, --framework <framework>`: Specify framework name (default: "Next.js")

### Examples

```bash
# Migrate a Next.js project in current directory
v2n-migrate migrate

# Migrate a React project in specific directory
v2n-migrate migrate -p /path/to/project -f React

# Only convert configuration
v2n-migrate convert-config -p /path/to/project

# Generate checklist for Vue project
v2n-migrate checklist -f Vue
```

## What Gets Generated

### 1. `netlify.toml`

Your Netlify configuration file with:
- Build settings
- Redirects and rewrites from Vercel
- Headers configuration
- Functions directory

### 2. `.env.netlify`

Consolidated environment variables with:
- All variables from `.env*` files
- Separated public and private variables
- Comments explaining usage

### 3. `ENV_MIGRATION_INSTRUCTIONS.md`

Detailed instructions including:
- Summary of variables found
- Three migration options (UI, CLI, config file)
- Security best practices
- Framework-specific guidance

### 4. `netlify-env-commands.sh`

Executable script with:
- Netlify CLI commands to set all variables
- Properly escaped values
- Usage instructions

### 5. `MIGRATION_CHECKLIST.md`

Comprehensive checklist with:
- Pre-migration preparation tasks
- Configuration migration steps
- Testing procedures
- Go-live checklist
- Post-migration optimization

## Migration Steps

1. **Prepare Your Project**
   ```bash
   cd your-vercel-project
   v2n-migrate migrate
   ```

2. **Review Generated Files**
   - Check `netlify.toml` for correct build settings
   - Review `.env.netlify` for environment variables
   - Read `MIGRATION_CHECKLIST.md` for manual steps

3. **Set Environment Variables**

   Option A - Using the generated script:
   ```bash
   ./netlify-env-commands.sh
   ```

   Option B - Manually via Netlify CLI:
   ```bash
   netlify env:set KEY "value"
   ```

   Option C - Via Netlify UI:
   - Go to Site settings > Environment variables

4. **Test Locally**
   ```bash
   netlify dev
   ```

5. **Deploy to Netlify**
   ```bash
   netlify deploy --prod
   ```

## Configuration Mappings

### Vercel → Netlify

| Vercel | Netlify |
|--------|---------|
| `vercel.json` | `netlify.toml` |
| `buildCommand` | `[build] command` |
| `outputDirectory` | `[build] publish` |
| `redirects` | `[[redirects]]` |
| `rewrites` | `[[redirects]]` with status 200 |
| `headers` | `[[headers]]` |
| `api/*` | `netlify/functions/*` |
| Edge Functions | Netlify Functions |

## Framework-Specific Notes

### Next.js

- Requires Next.js 13.5+ for zero-config deployment
- Install `@netlify/plugin-nextjs` for optimal performance
- API routes work automatically
- Image optimization supported via Netlify Image CDN

### React / Vite

- Update build command to use Vite
- Set publish directory to `dist`
- Environment variables should use `VITE_` prefix for client-side access

### Vue

- Set publish directory to `dist`
- Update build command to `npm run build`

## Troubleshooting

### Build Fails

- Check `netlify.toml` build command and publish directory
- Verify Node version in Netlify settings
- Check build logs for missing dependencies

### Environment Variables Not Working

- Ensure variables are set in Netlify UI or via CLI
- Check variable names and prefixes (`NEXT_PUBLIC_`, `VITE_`, etc.)
- Verify scope settings (builds, functions, post-processing)

### Redirects Not Working

- Review `netlify.toml` redirect rules
- Check for syntax errors
- Test with `netlify dev` locally

### Functions Not Working

- Migrate Vercel API routes to `netlify/functions/`
- Update function signatures to match Netlify format
- Check function logs in Netlify dashboard

## Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Migration Guide](https://docs.netlify.com/resources/checklists/vercel-to-netlify-migration/)
- [Netlify CLI](https://cli.netlify.com/)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/)
- [Netlify Community](https://answers.netlify.com/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues or questions:
- Create an issue in the repository
- Visit [Netlify Community Forums](https://answers.netlify.com/)
- Check [Netlify Documentation](https://docs.netlify.com/)

---

**Note**: This tool automates many migration tasks, but manual review and testing are essential. Always test in a deploy preview before going live.
