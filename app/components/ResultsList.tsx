'use client';

import { motion } from 'framer-motion';

interface ResultsListProps {
    results: {
        score: number;
        title: string;
        url: string;
        publishedDate: string;
        author: string;
        text: string;
    }[];
}

export default function ResultsList({ results }: ResultsListProps) {
    return (
        <motion.div
            className="mt-8 grid gap-6 md:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {(results?.length ?? 0) > 0 ? (
                (results ?? []).map((result, index) => (
                    <motion.div
                        key={index}
                        className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <a
                            href={result.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <h2 className="text-xl font-bold text-white mb-2 hover:text-blue-400 transition-colors duration-300">
                                {result.title || 'Untitled'}
                            </h2>
                            <p className="text-sm text-gray-300 mb-4">
                                {result.url || 'No URL available'}
                            </p>
                            {result.author && (
                                <p className="text-sm text-gray-300 mb-2">
                                    By: {result.author}
                                </p>
                            )}
                            {result.text && (
                                <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                                    {result.text}
                                </p>
                            )}
                            {result.publishedDate && (
                                <p className="text-xs text-gray-400 mb-2">
                                    Published on: {new Date(result.publishedDate).toLocaleDateString()}
                                </p>
                            )}
                            {result.score !== undefined && (
                                <p className="text-xs text-gray-400">
                                    Score: {result.score.toFixed(3)}
                                </p>
                            )}
                        </a>
                    </motion.div>
                ))
            ) : (
                <p className="text-white text-center col-span-2">No results found.</p>
            )}
        </motion.div>
    );
}
