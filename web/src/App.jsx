import { useState } from 'react'
import MigrationForm from './components/MigrationForm'
import ResultsDisplay from './components/ResultsDisplay'
import { Tiles } from './components/ui/tiles'
import { TiltedScroll } from './components/ui/tilted-scroll'

function App() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Tiles Background */}
      <div className="absolute inset-0 z-0">
        <Tiles
          rows={50}
          cols={20}
          tileSize="md"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {!results && (
          <header className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              Vercel to Netlify Migration
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Migrate your project from Vercel to Netlify with ease
            </p>

            {/* Tilted Scroll Features */}
            <TiltedScroll className="my-12" />
          </header>
        )}

        <div className="max-w-6xl mx-auto">
          {!results ? (
            <MigrationForm
              setResults={setResults}
              loading={loading}
              setLoading={setLoading}
            />
          ) : (
            <ResultsDisplay
              results={results}
              onReset={() => setResults(null)}
            />
          )}
        </div>

        <footer className="text-center mt-16 text-gray-600">
          <p>
            Based on{' '}
            <a
              href="https://docs.netlify.com/resources/checklists/vercel-to-netlify-migration/"
              className="text-green-600 hover:text-green-700 transition-colors underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netlify's Official Migration Guide
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
