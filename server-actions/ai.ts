'use server';

import OpenAI from 'openai';

import { requireUsername } from '@/lib/dal';
import { generateBioSchema, improveDescriptionSchema, suggestTitlesSchema } from '@/schemas/ai';

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://devfolio.app',
    'X-Title': 'DevFolio'
  }
});

const MODEL = process.env.OPENROUTER_MODEL ?? 'deepseek/deepseek-chat-v3.1:free';

// Retry once on 429/5xx — OpenRouter's free tier shares a tight rate-limit bucket
// across all models and a single transient hit otherwise breaks the user's interaction.
const isTransient = (err: unknown) => {
  const status = (err as { status?: number })?.status;
  return status === 429 || (typeof status === 'number' && status >= 500);
};

async function complete(prompt: string, maxTokens = 400): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const res = await client.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.7
      });
      const text = res.choices[0]?.message?.content?.trim();
      if (!text) throw new Error('empty AI response');
      return text;
    } catch (err) {
      lastErr = err;
      if (attempt === 0 && isTransient(err)) {
        await new Promise(resolve => setTimeout(resolve, 800));
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

export async function generateBio(input: unknown): Promise<string> {
  await requireUsername();
  const { role, yearsExperience, topSkills } = generateBioSchema.parse(input);

  return complete(
    `You are writing a short professional bio for a developer's portfolio page.

Role: ${role}
Years of experience: ${yearsExperience}
Top skills: ${topSkills.join(', ')}

Write a 2-3 sentence bio in first person. Keep it direct and specific — no buzzwords like "passionate" or "results-driven". Focus on what they build and what they're good at. Do not include a name or contact info.`
  );
}

export async function improveDescription(input: unknown): Promise<string> {
  await requireUsername();
  const { title, techStack, description } = improveDescriptionSchema.parse(input);

  return complete(
    `You are polishing a project description for a developer's portfolio.

Project title: ${title}
Tech stack: ${techStack.join(', ')}
Current description: ${description}

Rewrite this as 2-4 sentences. Keep all the specific facts and technical details. Remove filler words. Write in a direct voice — describe what the project does and what was interesting to build. Do not add technologies that weren't mentioned.`
  );
}

export async function suggestTitles(input: unknown): Promise<string[]> {
  await requireUsername();
  const { skills } = suggestTitlesSchema.parse(input);

  const text = await complete(
    `Suggest 4-5 short professional titles (e.g. "Full-stack Developer", "Frontend Engineer", "DevOps Specialist") for a developer with the following skills:

${skills.map(s => `${s.name} (${s.category})`).join('\n')}

Return just the titles, one per line. No numbering, no explanation.`,
    200
  );

  return text
    .split('\n')
    .map(s => s.trim().replace(/^[-*•\d.)\s]+/, ''))
    .filter(Boolean)
    .slice(0, 5);
}
