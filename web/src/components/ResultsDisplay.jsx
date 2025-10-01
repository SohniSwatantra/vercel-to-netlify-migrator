import { useState } from 'react'
import { RainbowButton } from './ui/rainbow-button'

export default function ResultsDisplay({ results, onReset }) {
  const [activeTab, setActiveTab] = useState('netlifyToml')

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    if (results.netlifyToml) {
      downloadFile(results.netlifyToml, 'netlify.toml')
    }
    if (results.envFile) {
      downloadFile(results.envFile, '.env.netlify')
    }
    if (results.envInstructions) {
      downloadFile(results.envInstructions, 'ENV_MIGRATION_INSTRUCTIONS.md')
    }
    if (results.cliCommands) {
      downloadFile(results.cliCommands, 'netlify-env-commands.sh')
    }
    if (results.checklist) {
      downloadFile(results.checklist, 'MIGRATION_CHECKLIST.md')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Migration Files Generated</h2>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          ← Start New Migration
        </button>
      </div>

      {/* Download All Button */}
      <div className="mb-6">
        <RainbowButton
          onClick={downloadAll}
          className="w-full py-3"
        >
          Download All Files
        </RainbowButton>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-4">
          {results.netlifyToml && (
            <button
              onClick={() => setActiveTab('netlifyToml')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'netlifyToml'
                  ? 'border-gray-700 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              netlify.toml
            </button>
          )}
          {results.envFile && (
            <button
              onClick={() => setActiveTab('envFile')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'envFile'
                  ? 'border-gray-700 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              .env.netlify
            </button>
          )}
          {results.envInstructions && (
            <button
              onClick={() => setActiveTab('envInstructions')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'envInstructions'
                  ? 'border-gray-700 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              ENV Instructions
            </button>
          )}
          {results.cliCommands && (
            <button
              onClick={() => setActiveTab('cliCommands')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cliCommands'
                  ? 'border-gray-700 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              CLI Commands
            </button>
          )}
          {results.checklist && (
            <button
              onClick={() => setActiveTab('checklist')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'checklist'
                  ? 'border-gray-700 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Checklist
            </button>
          )}
        </nav>
      </div>

      {/* Content Display */}
      <div className="relative">
        {activeTab === 'netlifyToml' && results.netlifyToml && (
          <FileContent
            content={results.netlifyToml}
            filename="netlify.toml"
            onCopy={() => copyToClipboard(results.netlifyToml)}
            onDownload={() => downloadFile(results.netlifyToml, 'netlify.toml')}
          />
        )}
        {activeTab === 'envFile' && results.envFile && (
          <FileContent
            content={results.envFile}
            filename=".env.netlify"
            onCopy={() => copyToClipboard(results.envFile)}
            onDownload={() => downloadFile(results.envFile, '.env.netlify')}
          />
        )}
        {activeTab === 'envInstructions' && results.envInstructions && (
          <FileContent
            content={results.envInstructions}
            filename="ENV_MIGRATION_INSTRUCTIONS.md"
            onCopy={() => copyToClipboard(results.envInstructions)}
            onDownload={() => downloadFile(results.envInstructions, 'ENV_MIGRATION_INSTRUCTIONS.md')}
          />
        )}
        {activeTab === 'cliCommands' && results.cliCommands && (
          <FileContent
            content={results.cliCommands}
            filename="netlify-env-commands.sh"
            onCopy={() => copyToClipboard(results.cliCommands)}
            onDownload={() => downloadFile(results.cliCommands, 'netlify-env-commands.sh')}
          />
        )}
        {activeTab === 'checklist' && results.checklist && (
          <FileContent
            content={results.checklist}
            filename="MIGRATION_CHECKLIST.md"
            onCopy={() => copyToClipboard(results.checklist)}
            onDownload={() => downloadFile(results.checklist, 'MIGRATION_CHECKLIST.md')}
          />
        )}
      </div>

      {/* Next Steps */}
      <div className="mt-8 p-6 border border-green-200 rounded-lg" style={{ backgroundColor: '#f9ffe6' }}>
        <h3 className="font-bold text-green-900 mb-3 text-lg">Next Steps:</h3>
        <ol className="list-decimal list-inside space-y-2 text-green-800">
          <li>Download all generated files</li>
          <li>Add <code className="bg-white px-2 py-1 rounded border border-green-200">netlify.toml</code> to your project root</li>
          <li>Set environment variables using the CLI script or Netlify UI</li>
          <li>Review the migration checklist</li>
          <li>Install Netlify CLI: <code className="bg-white px-2 py-1 rounded border border-green-200">npm install -g netlify-cli</code></li>
          <li>Test locally: <code className="bg-white px-2 py-1 rounded border border-green-200">netlify dev</code></li>
          <li>Deploy: <code className="bg-white px-2 py-1 rounded border border-green-200">netlify deploy --prod</code></li>
        </ol>
      </div>
    </div>
  )
}

function FileContent({ content, filename, onCopy, onDownload }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">{filename}</h3>
        <div className="space-x-2">
          <button
            onClick={onCopy}
            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition"
          >
            Copy
          </button>
          <button
            onClick={onDownload}
            className="px-3 py-1 text-white text-sm rounded hover:opacity-90 transition"
            style={{ backgroundColor: '#2d5986' }}
          >
            Download
          </button>
        </div>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto">
        <code>{content}</code>
      </pre>
    </div>
  )
}
