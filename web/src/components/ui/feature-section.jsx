import { Check } from "lucide-react";
import { Badge } from "./badge";

export function FeatureSection() {
  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="flex gap-4 flex-col items-start">
          <div>
            <Badge>Migration Features</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-4xl tracking-tight font-bold text-gray-900">
              Everything you need for a smooth migration
            </h2>
            <p className="text-lg max-w-xl leading-relaxed text-gray-600">
              Our tool handles the complexity of migrating from Vercel to Netlify, so you can focus on what matters.
            </p>
          </div>
          <div className="flex gap-10 pt-8 flex-col w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-row gap-4 items-start">
                <Check className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-gray-900">100% Client-Side Processing</p>
                  <p className="text-gray-600 text-sm">
                    Your environment variables never leave your browser. All processing happens locally for maximum security.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-start">
                <Check className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-gray-900">Automatic Configuration Conversion</p>
                  <p className="text-gray-600 text-sm">
                    Converts vercel.json to netlify.toml with proper mappings for redirects, headers, and build settings.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-start">
                <Check className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-gray-900">Environment Variables Migration</p>
                  <p className="text-gray-600 text-sm">
                    Generates Netlify-compatible .env files with detailed instructions and CLI commands.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-start">
                <Check className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-gray-900">Framework-Specific Checklists</p>
                  <p className="text-gray-600 text-sm">
                    Tailored migration guides for Next.js, React, Vue, and other popular frameworks.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-start">
                <Check className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-gray-900">Docker Isolated Environment</p>
                  <p className="text-gray-600 text-sm">
                    Run in a secure, sandboxed container with read-only filesystem and no network access needed.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-start">
                <Check className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-gray-900">Netlify CLI Commands</p>
                  <p className="text-gray-600 text-sm">
                    Automatically generates executable scripts with all necessary Netlify CLI commands.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
