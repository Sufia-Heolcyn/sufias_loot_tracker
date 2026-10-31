import React, { useState } from 'react';
import moduleManifest from '../module.json';

export default function App() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(moduleManifest.manifest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="border-b border-slate-800 pb-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-100">{moduleManifest.title}</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              id: {moduleManifest.id} · v{moduleManifest.version} · Foundry VTT v
              {moduleManifest.compatibility.minimum}–v{moduleManifest.compatibility.verified}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {copied ? 'Copied Manifest URL' : 'Copy Manifest URL'}
          </button>
        </header>

        <section className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
          <div className="text-xs font-semibold text-slate-300">
            Foundry VTT Manifest URL (Add-on Modules &rarr; Install Module)
          </div>
          <code className="block p-3 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-amber-400 break-all">
            {moduleManifest.manifest}
          </code>
          <p className="text-xs text-slate-400">
            All Foundry VTT module files (<code className="font-mono">module.json</code>,{' '}
            <code className="font-mono">scripts/main.js</code>,{' '}
            <code className="font-mono">templates/treasure-tracker.hbs</code>,{' '}
            <code className="font-mono">styles/module.css</code>,{' '}
            <code className="font-mono">lang/en.json</code>, and{' '}
            <code className="font-mono">LICENSE</code>) are located directly at the root of this
            repository.
          </p>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-2">
          <div className="text-xs font-semibold text-slate-300">Root module.json</div>
          <pre className="p-4 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-slate-300 overflow-x-auto">
            <code>{JSON.stringify(moduleManifest, null, 2)}</code>
          </pre>
        </section>
      </div>
    </div>
  );
}
