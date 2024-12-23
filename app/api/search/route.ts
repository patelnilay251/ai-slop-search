import { NextRequest, NextResponse } from 'next/server';
import Exa from 'exa-js';
import Groq from 'groq-sdk';

// Types for Quantum-Fractal Clustering
interface DataPoint {
    original: any;
    features: number[];
}

interface Cluster {
    coreRepresentation: number[];
    members: DataPoint[];
}

// Quantum-Fractal Clustering Helper Functions
function complexExpMap(x: number): [number, number] {
    return [Math.cos(x), Math.sin(x)];
}

function quantumEmbed(points: DataPoint[]): { complexCoordinates: [number, number][] } {
    return {
        complexCoordinates: points.map(p => {
            const [re, im] = complexExpMap(p.features[0]);
            return [re, im] as [number, number];
        })
    };
}

function fractalTransform(
    embedding: { complexCoordinates: [number, number][] },
    iterationCount: number,
    scaleFactor: number
): { complexCoordinates: [number, number][] } {
    let coords = embedding.complexCoordinates;
    for (let i = 0; i < iterationCount; i++) {
        coords = coords.map(([x, y]) => [
            Math.sin(y * scaleFactor) + Math.cos(x * scaleFactor),
            Math.sin(x * scaleFactor) - Math.cos(y * scaleFactor)
        ]);
    }
    return { complexCoordinates: coords };
}

function clusterResults(results: any[]): any[] {
    // Convert results to DataPoints
    const dataPoints: DataPoint[] = results.map(result => ({
        original: result,
        features: [result.score || 0]
    }));

    // Perform quantum embedding
    const embedding = quantumEmbed(dataPoints);

    // Apply fractal transformation
    const transformed = fractalTransform(embedding, 3, 1.5);

    // Group similar results based on transformed coordinates
    const clusters: { [key: string]: any[] } = {};
    transformed.complexCoordinates.forEach((coords, idx) => {
        const key = `${Math.round(coords[0] * 10)},${Math.round(coords[1] * 10)}`;
        if (!clusters[key]) clusters[key] = [];
        clusters[key].push(results[idx]);
    });

    // Return clustered results
    return Object.values(clusters)
        .sort((a, b) => b.length - a.length)
        .flat();
}

const exa = new Exa(process.env.EXA_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();

        // Step 1: Query Expansion
        const expandedQueryResponse = await groq.chat.completions.create({
            model: 'llama3-70b-8192',
            messages: [
                { role: 'system', content: "Rewrite the query to make it more specific and contextual for a search engine." },
                { role: 'user', content: query },
            ],
            max_tokens: 50,
        });
        const refinedQuery = expandedQueryResponse.choices[0]?.message?.content || query;

        // Step 2: Enhanced Search
        const exaResponse = await exa.searchAndContents(refinedQuery, {
            numResults: 10,
            useAutoprompt: true,
            type: "neural"
        });

        // Step 3: Result Processing with Clustering
        const processedResults = exaResponse.results
            .map(result => ({
                ...result,
                score: result.score || 0,
                publishedDate: result.publishedDate || new Date().toISOString()
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 8); // Get more results for clustering

        // Apply quantum-fractal clustering
        const clusteredResults = clusterResults(processedResults).slice(0, 5);

        // Step 4: Generate Summary
        const systemPrompt = `Summarize these search results concisely in 2-3 paragraphs. Be factual, clear, and objective.`;

        // Helper function to truncate text
        function truncateText(text: string, maxLength: number = 250): string {
            if (!text) return '';
            return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
        }

        const summary = await groq.chat.completions.create({
            model: 'llama3-70b-8192',
            messages: [
                { role: 'system', content: systemPrompt },
                {
                    role: 'user',
                    content: clusteredResults
                        .map((result, index) =>
                            `${index + 1}. ${result.title}\n${truncateText(result.text)}`
                        )
                        .join('\n\n')
                }
            ],
            max_tokens: 500,
            temperature: 0.5,
        });

        const summaryData = summary.choices[0].message.content;

        // Return enhanced response
        return NextResponse.json({
            exaResponse: { results: clusteredResults },
            summaryData,
            refinedQuery,
            originalQuery: query
        });

    } catch (error) {
        console.error("Error in API:", error);
        return NextResponse.json({ error: 'Failed to fetch or process results' }, { status: 500 });
    }
}