// 'use client';
// import { useState } from 'react';

// interface SearchBarProps {
//     onSearch: (query: string) => void;
// }

// export default function SearchBar({ onSearch }: SearchBarProps) {
//     const [query, setQuery] = useState('');

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onSearch(query);
//     };

//     return (
//         <form onSubmit={handleSubmit} className="flex gap-2">
//             <input
//                 type="text"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search..."
//                 className="border rounded px-4 py-2 flex-1"
//             />
//             <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//                 Search
//             </button>
//         </form>
//     );
// }

'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search here..."
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-white bg-opacity-20 backdrop-blur-lg border border-gray-300 border-opacity-30 shadow-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 ease-in-out hover:brightness-110 hover:shadow-xl"
                />
            </div>
            <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
                Search
            </button>
        </form>
    );
}

