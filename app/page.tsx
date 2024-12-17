// 'use client';
// import { useState } from 'react';
// import SearchBar from './components/SearchBar';
// import ResultsList from './components/ResultsList';

// export default function Home() {

//   const [results, setResults] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchResults = async (query: string) => {
//     setLoading(true);
//     console.log('Searching for:', query);

//     try {
//       const response = await fetch('/api/search', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ query }),
//       });

//       //console.log('Raw response:', response);

//       const data = await response.json();
//       //console.log('Parsed data:', data);

//       setResults(data.results.results || []);
//       console.log('Final results state:', data.results.results || []);

//     } catch (error) {
//       console.error('Error details:', error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="max-w-4xl mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-4">AI-Slop Search</h1>
//       <SearchBar onSearch={fetchResults} />
//       {loading && <p className="mt-4">Loading...</p>}
//       <ResultsList results={results} />
//     </div>
//   );
// }

'use client';
import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';

export default function Home() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

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
      setResults(data.results.results || []);
      //console.log('Final results state:', data.results.results || []);
    } catch (error) {
      console.error('Error details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d1a] to-[#1c1c2e] text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="light-flare"></div>
        <div className="light-flare-2"></div>
      </div>
      <div className={`relative z-10 max-w-4xl mx-auto p-8 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="glassmorphism p-8 rounded-2xl">
          <h1 className="text-4xl font-bold mb-8 text-center">AI-Slop Search</h1>
          <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
            <SearchBar onSearch={fetchResults} />
          </div>
          {loading && <p className="mt-4 text-center">Loading...</p>}
          <ResultsList results={results} />
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .glassmorphism {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }
        .light-flare {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%);
          top: -150px;
          left: -150px;
          filter: blur(40px);
        }
        .light-flare-2 {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%);
          bottom: -200px;
          right: -200px;
          filter: blur(60px);
        }
      `}</style>
    </div>
  );
}

