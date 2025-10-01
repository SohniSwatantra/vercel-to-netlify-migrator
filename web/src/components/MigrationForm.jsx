import { useState } from 'react'
import { processMigration } from '../utils/migrationProcessor'
import { RainbowButton } from './ui/rainbow-button'
import { PlaceholdersAndVanishInput } from './ui/placeholders-and-vanish-input'

export default function MigrationForm({ setResults, loading, setLoading }) {
  const [vercelJson, setVercelJson] = useState('')
  const [envVars, setEnvVars] = useState('')
  const [framework, setFramework] = useState('Next.js')
  const [generateChecklist, setGenerateChecklist] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Process everything CLIENT-SIDE ONLY - no server calls!
      // Your environment variables NEVER leave your browser
      const result = processMigration({
        vercelJson: vercelJson || null,
        envVars: envVars || null,
        framework,
        generateChecklistFlag: generateChecklist,
      })

      setResults(result)
    } catch (error) {
      console.error('Migration error:', error)
      alert('Error during migration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e, setter) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setter(event.target.result)
      }
      reader.readAsText(file)
    }
  }

  const quickStartPlaceholders = [
    "Paste your vercel.json content here...",
    "Quick start: Just paste and press Enter",
    "Try pasting your config for instant migration",
    "Fast migration: Paste vercel.json here",
  ]

  const handleQuickStart = (e) => {
    e.preventDefault()
    // The vercelJson state is already updated by the input's onChange
    // Trigger the main form submission
    handleSubmit(e)
  }

  return (
    <div className="space-y-8">
      {/* Quick Start Section */}
      <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">⚡ Quick Start</h2>
          <p className="text-gray-600">Paste your vercel.json content below for instant migration</p>
        </div>
        <PlaceholdersAndVanishInput
          placeholders={quickStartPlaceholders}
          onChange={(e) => setVercelJson(e.target.value)}
          onSubmit={handleQuickStart}
        />
        <p className="text-sm text-gray-500 mt-4 text-center">Or use the detailed form below for more options</p>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vercel Configuration */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Vercel Configuration (vercel.json)
          </label>
          <div className="mb-2">
            <input
              type="file"
              accept=".json"
              onChange={(e) => handleFileUpload(e, setVercelJson)}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-100 file:text-gray-700
                hover:file:bg-gray-200"
            />
          </div>
          <textarea
            value={vercelJson}
            onChange={(e) => setVercelJson(e.target.value)}
            placeholder='Paste your vercel.json content here or upload file above...'
            className="w-full h-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
          />
          <p className="text-sm text-gray-500 mt-1">Optional: Leave empty to generate basic config</p>
        </div>

        {/* Environment Variables */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Environment Variables (.env)
          </label>

          {/* Security Warning */}
          <div className="mb-3 p-4 border border-green-200 rounded-lg" style={{ backgroundColor: '#f9ffe6' }}>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">🔒</span>
              <div className="text-sm text-green-800">
                <strong>100% Secure - Client-Side Only & Dockerized</strong>
                <p className="mt-1">Your environment variables are processed entirely in your browser. They are NEVER sent to any server. All processing happens on your local machine. The application runs in an isolated Docker container for maximum security.</p>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <input
              type="file"
              accept=".env,.env.local,.env.production"
              onChange={(e) => handleFileUpload(e, setEnvVars)}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
            />
          </div>
          <textarea
            value={envVars}
            onChange={(e) => setEnvVars(e.target.value)}
            placeholder='Paste your .env content here or upload file above...
Example:
DATABASE_URL=postgres://...
NEXT_PUBLIC_API_URL=https://api.example.com
API_KEY=secret123'
            className="w-full h-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
          />
          <p className="text-sm text-gray-500 mt-1">Optional: Add your environment variables</p>
        </div>

        {/* Framework Selection */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Framework
          </label>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="Next.js">Next.js</option>
            <option value="React">React</option>
            <option value="Vue">Vue</option>
            <option value="Vite">Vite</option>
            <option value="SvelteKit">SvelteKit</option>
            <option value="Nuxt">Nuxt</option>
            <option value="Astro">Astro</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Generate Checklist */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="checklist"
            checked={generateChecklist}
            onChange={(e) => setGenerateChecklist(e.target.checked)}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="checklist" className="ml-2 text-gray-700">
            Generate migration checklist
          </label>
        </div>

        {/* Submit Button */}
        <RainbowButton
          type="submit"
          disabled={loading}
          className="w-full py-3"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Migration...
            </span>
          ) : (
            'Start Migration'
          )}
        </RainbowButton>
      </form>

      {/* Info Box */}
      <div className="mt-8 p-4 border border-gray-200 rounded-lg" style={{ backgroundColor: '#eff5f5' }}>
        <h3 className="font-semibold text-gray-900 mb-2">What this tool does:</h3>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li>Converts vercel.json to netlify.toml</li>
          <li>Migrates environment variables with instructions</li>
          <li>Generates framework-specific migration checklist</li>
          <li>Provides Netlify CLI commands</li>
          <li>Creates comprehensive migration guide</li>
        </ul>
      </div>

      {/* Security Info */}
      <div className="mt-4 p-4 border border-green-200 rounded-lg" style={{ backgroundColor: '#f9ffe6' }}>
        <h3 className="font-semibold text-green-900 mb-2">🔐 Privacy & Security:</h3>
        <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
          <li><strong>100% client-side processing</strong> - No data sent to servers</li>
          <li><strong>Dockerized environment</strong> - Runs in isolated container with read-only filesystem</li>
          <li>Your environment variables stay on your machine</li>
          <li>All files are generated in your browser</li>
          <li>Open DevTools Network tab to verify - zero API calls with env data</li>
          <li>After migration, set env vars directly in Netlify UI (most secure)</li>
        </ul>
      </div>
    </div>
    </div>
  )
}
