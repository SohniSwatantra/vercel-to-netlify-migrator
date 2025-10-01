# Web UI - Vercel to Netlify Migration Tool

Beautiful web interface for migrating from Vercel to Netlify.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the application:**

   Open two terminal windows:

   **Terminal 1 - API Server:**
   ```bash
   npm run server
   ```
   Server runs on http://localhost:3001

   **Terminal 2 - Web Interface:**
   ```bash
   npm run dev
   ```
   UI runs on http://localhost:5173

3. **Open in browser:**
   Navigate to http://localhost:5173

## Features

- 📝 **Paste or Upload** vercel.json and .env files
- 🎨 **Beautiful UI** with Tailwind CSS
- 📥 **Download Files** individually or all at once
- 📋 **Copy to Clipboard** for quick access
- 🔄 **Real-time Processing** with Express API
- 📱 **Responsive Design** works on all devices

## How to Use

1. Paste or upload your `vercel.json` configuration
2. Paste or upload your `.env` file(s)
3. Select your framework (Next.js, React, Vue, etc.)
4. Click "Start Migration"
5. Review generated files in tabs
6. Download all files or copy to clipboard

## Generated Files

- `netlify.toml` - Netlify configuration
- `.env.netlify` - Environment variables
- `ENV_MIGRATION_INSTRUCTIONS.md` - Setup instructions
- `netlify-env-commands.sh` - CLI commands script
- `MIGRATION_CHECKLIST.md` - Complete migration checklist

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Express.js
- **Features:** File upload, clipboard API, download functionality

## Development

```bash
# Install dependencies
npm install

# Run dev server only
npm run dev

# Run API server only
npm run server

# Build for production
npm run build

# Preview production build
npm run preview
```

## Production Deployment

You can deploy this to Netlify itself!

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder and configure `server.js` as a Netlify Function

Or deploy to any platform that supports Node.js.
