import { NextRequest, NextResponse } from 'next/server';
import Exa from 'exa-js';
import Groq from 'groq-sdk';

const exa = new Exa(process.env.EXA_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();

        const exaResponse = await exa.searchAndContents(query, {
            numResults: 5,
            useAutoprompt: true,
            type: "neural"
        });


        const testResults = exaResponse.results.map(
            (result: any, index: number) =>
                `${index + 1}. ${result.title} - ${result.url}`
        );

        const systemPrompt = `You are a highly intelligent and concise assistant tasked with generating a clear, factual, 
            and well-structured summary based on multiple search results. Your goal is to combine information from all the 
            provided search results into a single, coherent, and general answer. The response must be:

            1. Accurate and Trustworthy: Only include information that is factually supported by the search results provided. 
               Avoid speculation or assumptions.
            2. Concise: Limit your response to 2-3 paragraphs (around 100-150 words) while maintaining clarity and completeness.
            3. Well-Structured: Organize the response in a logical order, prioritizing the most important and relevant 
               information first.
            4. Neutral and Objective: Present the information impartially without bias or opinion.
            5. Readable: Use clear, formal language that is easy to understand. Avoid overly technical jargon unless necessary.`;

        const summary = await groq.chat.completions.create({
            model: 'llama3-70b-8192',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: testResults.join('\n') }
            ],
            max_tokens: 500,
            temperature: 0.5,
        });


        const summaryData = summary.choices[0].message.content;

        return NextResponse.json({ exaResponse, summaryData });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
    }
}