import { NextRequest, NextResponse } from 'next/server';
import Exa from 'exa-js';

const exa = new Exa(process.env.EXA_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();
        const results = await exa.search(query);

        return NextResponse.json({ results });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
    }
}