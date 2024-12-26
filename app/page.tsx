'use client'
import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import ResultsList from './components/ResultsList'
import Sidebar from './components/Sidebar'
import { motion } from 'framer-motion'

export default function Home() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [summary, setSummary] = useState<string>('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchResults = async (query: string) => {
    setLoading(true)
    console.log('Searching for:', query)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()
      setSummary(data.summaryData)
      setResults(data.exaResponse.results || [])
      console.log('Final results state:', data.exaResponse.results || [])
    } catch (error) {
      console.error('Error details:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex overflow-hidden">
      {/* Sidebar */}
      <div className="fixed h-screen left-0 top-0 z-50">
        <Sidebar />
      </div>
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto text-white relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="light-flare"></div>
          <div className="light-flare-2"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto p-8">
          <div className={`glassmorphism p-8 rounded-2xl ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            <h1 className="text-4xl font-bold mb-8 text-center">AI-Slop Search</h1>
            <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
              <SearchBar onSearch={fetchResults} />
            </div>
            {loading && (
              <div className="mt-4 flex flex-col items-center justify-center space-y-2">
                <div className="flex space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="block w-2 h-2 rounded-full bg-blue-500"
                      initial={{ y: 0, opacity: 1 }}
                      animate={{ y: [-4, 4, -4], opacity: [1, 0.5, 1] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatDelay: 0.2,
                        delay: i * 0.15, // stagger each dot slightly
                      }}
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground">Thinking...</p>
              </div>
            )}
            {summary && (
              <div className="mb-8 p-6 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <p className="text-gray-300">{summary}</p>
              </div>
            )}
            <ResultsList results={results} isLoading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}