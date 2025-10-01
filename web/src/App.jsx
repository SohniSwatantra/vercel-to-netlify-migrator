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
            <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4 py-2 rounded inline-block" style={{ backgroundColor: '#ffffe6' }}>
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

        <footer className="mt-16 border-t border-gray-200 pt-8 pb-8">
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-600">
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

            <div className="flex flex-wrap items-center justify-center gap-3 text-gray-700">
              <span className="font-semibold text-gray-900">Created by S Sohni</span>
              <span>•</span>
              <span>Follow me on</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://x.com/TheGeneralistHQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70"
                  aria-label="Follow on X"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/5968/5968830.png"
                    alt="X (Twitter)"
                    className="w-5 h-5"
                  />
                </a>
                <a
                  href="https://www.reddit.com/r/vibecodingcommunity/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70"
                  aria-label="Join Reddit Community"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3670/3670226.png"
                    alt="Reddit"
                    className="w-5 h-5"
                  />
                </a>
              </div>
              <span>•</span>
              <span>
                Founder -{' '}
                <a
                  href="https://vibecodefixers.com"
                  className="text-gray-900 hover:text-gray-700 transition-colors font-medium underline px-2 py-1 rounded"
                  style={{ backgroundColor: '#eeffcc' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VibeCodeFixers.com
                </a>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
