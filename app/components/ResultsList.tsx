'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, ExternalLink, User, Star } from 'lucide-react'
import Link from 'next/link'

interface Result {
    score: number
    title: string
    url: string
    publishedDate: string
    author: string
    text: string
}

interface ResultsListProps {
    results: Result[]
    isLoading: boolean
}

export default function ResultsList({ results, isLoading }: ResultsListProps) {
    if (isLoading) {
        return <SkeletonList />
    }

    return (
        <motion.div
            className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {results.length > 0 ? (
                results.map((result, index) => (
                    <ResultCard key={index} result={result} index={index} />
                ))
            ) : (
                <p className="text-muted-foreground text-center col-span-full text-lg">No results found.</p>
            )}
        </motion.div>
    )
}

function ResultCard({ result, index }: { result: Result; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1">
                <CardHeader>
                    <CardTitle className="line-clamp-2">
                        <Link href={result.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300">
                            {result.title || 'Untitled'}
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    {result.text && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {result.text}
                        </p>
                    )}
                    {result.author && (
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <User className="w-4 h-4 mr-2" />
                            {result.author}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {result.publishedDate && (
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(result.publishedDate).toLocaleDateString()}
                        </div>
                    )}
                    {result.score !== undefined && (
                        <Badge variant="secondary" className="ml-auto">
                            <Star className="w-3 h-3 mr-1" />
                            {result.score.toFixed(2)}
                        </Badge>
                    )}
                    <Link href={result.url} target="_blank" rel="noopener noreferrer" className="ml-auto">
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </CardFooter>
            </Card>
        </motion.div>
    )
}

function SkeletonList() {
    return (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-full flex flex-col">
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6 mb-2" />
                        <Skeleton className="h-4 w-4/6" />
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

