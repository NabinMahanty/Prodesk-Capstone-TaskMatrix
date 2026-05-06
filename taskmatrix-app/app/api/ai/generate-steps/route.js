import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.GEMINI_API_KEY?.trim();

export async function POST(request) {
  if (!geminiApiKey) {
    return NextResponse.json(
      { error: 'Missing Gemini API key. Add GEMINI_API_KEY to your cloud environment.' },
      { status: 500 },
    );
  }

  try {
    const { title } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Task title is required.' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Based on the task title "${title}", generate a concise bulleted list of 3-5 sub-steps to complete it. Only provide the steps.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return NextResponse.json({ steps: response.text() });
  } catch {
    return NextResponse.json(
      { error: 'Unable to generate sub-steps right now.' },
      { status: 503 },
    );
  }
}