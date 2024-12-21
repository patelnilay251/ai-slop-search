import { NextRequest, NextResponse } from 'next/server';
import Exa from 'exa-js';
import Groq from 'groq-sdk';

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

        // Step 3: Result Processing
        const processedResults = exaResponse.results
            .map(result => ({
                ...result,
                score: result.score || 0,
                publishedDate: result.publishedDate || new Date().toISOString()
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        // Step 4: Generate Summary
        const systemPrompt = `You are a highly intelligent and concise assistant tasked with generating a clear, factual, 
            and well-structured summary based on multiple search results. Your goal is to combine information from all the 
            provided search results into a single, coherent, and general answer. The response must be:

            1. Accurate and Trustworthy: Only include information that is factually supported by the search results provided.
            2. Concise: Limit your response to 2-3 paragraphs (around 100-150 words) while maintaining clarity.
            3. Well-Structured: Organize the response logically, prioritizing key information.
            4. Neutral and Objective: Present the information impartially without bias.
            5. Readable: Use clear, formal language that is easy to understand.`;

        const summary = await groq.chat.completions.create({
            model: 'llama3-70b-8192',
            messages: [
                { role: 'system', content: systemPrompt },
                {
                    role: 'user',
                    content: processedResults
                        .map((result, index) => `${index + 1}. ${result.title} - ${result.url}\n${result.text}`)
                        .join('\n\n')
                }
            ],
            max_tokens: 500,
            temperature: 0.5,
        });

        const summaryData = summary.choices[0].message.content;

        // Return enhanced response
        return NextResponse.json({
            exaResponse: { results: processedResults },
            summaryData,
            refinedQuery,
            originalQuery: query
        });

    } catch (error) {
        console.error("Error in API:", error);
        return NextResponse.json({ error: 'Failed to fetch or process results' }, { status: 500 });
    }
}