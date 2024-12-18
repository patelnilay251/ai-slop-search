'use client';
import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';

export default function Home() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [summary, setSummary] = useState<string>('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchResults = async (query: string) => {
    setLoading(true);
    console.log('Searching for:', query);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      const summaryData = data.summaryData;
      setSummary(summaryData);

      setResults(data.exaResponse.results || []);
      console.log('Final results state:', data.exaResponse.results || []);
    } catch (error) {
      console.error('Error details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-auto text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="light-flare"></div>
        <div className="light-flare-2"></div>
      </div>
      <div className="flex-1">
        <div className={`relative z-10 max-w-4xl mx-auto p-8 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="glassmorphism p-8 rounded-2xl">
            <h1 className="text-4xl font-bold mb-8 text-center">AI-Slop Search</h1>
            <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
              <SearchBar onSearch={fetchResults} />
            </div>
            {loading && (
              <div className="mt-4 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-3 text-center">Loading...</p>
              </div>
            )}
            {summary && (
              <div className="mb-8 p-6 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <p className="text-gray-300">{summary}</p>
              </div>
            )}
            <ResultsList results={results} />
          </div>
        </div>
      </div>
    </div>
  );
}

