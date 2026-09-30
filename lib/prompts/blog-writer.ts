// AI Blog Writer Prompts

import {
  BlogGenerationRequest,
  BlogLanguage,
  BlogTone,
  LENGTH_CONFIG,
} from "@/app/admin/blog-writer/types";

const LANGUAGE_INSTRUCTIONS: Record<BlogLanguage, string> = {
  de: `Write in German (Deutsch). Use formal "Sie" form. Ensure proper German grammar and spelling.`,
  en: `Write in English. Use professional but accessible language.`,
  vi: `Write in Vietnamese (Tiếng Việt). Use polite and professional language.`,
};

const TONE_INSTRUCTIONS: Record<BlogTone, string> = {
  professional: `Maintain a formal, business-like tone. Use industry terminology appropriately. Be authoritative but not condescending.`,
  friendly: `Use a warm, conversational tone. Include rhetorical questions to engage readers. Be approachable while maintaining professionalism.`,
  educational: `Focus on explaining concepts clearly. Use examples and analogies. Structure content for easy learning with clear takeaways.`,
};

const COMPANY_CONTEXT = `
DMF Talents is the German-facing brand on https://www.dmf-talents.de.
Its website presents recruitment from Vietnam for employers in Germany, including skilled workers and trainees.

TARGET AUDIENCE:
German business owners, HR managers and operational managers considering international recruitment.
Their questions concern role requirements, candidate selection, responsibilities, service scope, budgeting and onboarding.

VERIFIED INTERNAL DESTINATIONS (link only when relevant):
- Skilled workers: /services/skilled-workers
- Trainees: /services/azubi
- Discuss a staffing requirement: /fuer-arbeitgeber/personalbedarf

Do not infer DMF's prices, staff qualifications, certifications, partnerships, placement volumes, success rates, candidate availability or support duration from this context. These require approved evidence supplied by the editor.
`;

const FACTS_GUARDRAIL = `
FACTS & EDITORIAL ACCURACY (STRICT):
- Never invent facts, citations, customer quotations, case studies or credentials. A requested topic or keyword is not evidence.
- Do not invent German salary levels, visa fees, legal thresholds, deadlines, processing times or labor-market statistics. If no current, verifiable source is supplied, omit the precise claim and describe what the employer should check with the responsible authority.
- Never use a placeholder or an unverified number in public article text. For article HTML only, if material information is missing, add a short HTML comment at the end listing editorial checks, without speculative values. Do not claim the content has been fact-checked.
- Cite supplied, relevant primary sources with descriptive HTML links adjacent to the supported claim. Do not fabricate source URLs or imply that an official information portal endorses DMF.
- Do not promise visa approval, guaranteed placement, fixed arrival dates or guaranteed results.
- Present checklists, example schedules and hypothetical scenarios explicitly as suggestions, not DMF commitments or real customer results.
- Avoid stereotypes about Vietnamese workers. Assess qualifications, communication and role fit individually.
- Do not invent an author, legal review, certification or publication date.
`;

export function buildBlogSystemPrompt(request: BlogGenerationRequest): string {
  const wordCount = LENGTH_CONFIG[request.length].words;

  return `You are a blog writer preparing an editorial draft for DMF Talents.

${LANGUAGE_INSTRUCTIONS[request.language]}

${TONE_INSTRUCTIONS[request.tone]}

COMPANY CONTEXT:
${COMPANY_CONTEXT}

CONTENT REQUIREMENTS:
- Aim for approximately ${wordCount} words when the subject warrants it; do not pad the article for SEO
- Use proper HTML structure: <h2>, <h3>, <p>, <ul>, <ol>, <strong>, <em>
- Start with an engaging introduction (no <h1> - title is separate)
- Include 2-4 subheadings (<h2> or <h3>)
- End with one specific next step relevant to the buyer question; use a verified internal destination
- Reference only verified DMF services where relevant; distinguish advice from contractual service scope
- Include actionable insights or practical tips
- Answer a concrete employer question early, explain decision criteria and use keywords naturally
- Add up to two useful internal links from the verified destinations; use descriptive anchor text
- Do not add duplicate H1 headings, keyword stuffing or claims of guaranteed SEO performance

${FACTS_GUARDRAIL}

${request.keywords?.length ? `TARGET KEYWORDS: ${request.keywords.join(", ")}` : ""}

${request.outline ? `OUTLINE TO FOLLOW:\n${request.outline}` : ""}

OUTPUT FORMAT:
Return a valid JSON object with exactly this structure:
{
  "title": "Compelling blog title (50-60 characters ideal)",
  "slug": "url-friendly-slug-in-lowercase",
  "excerpt": "Engaging summary (150-160 characters)",
  "content": "Full HTML content",
  "metaTitle": "SEO title (50-60 characters)",
  "metaDescription": "SEO description (150-160 characters)",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "suggestedImageQueries": ["search query 1", "search query 2", "search query 3"]
}

IMPORTANT: Return ONLY the JSON object, no markdown code blocks or additional text.`;
}

export function buildTopicSuggestionsPrompt(language: BlogLanguage, category?: string): string {
  const langInstructions =
    language === "de"
      ? "Generate topics and descriptions in German."
      : language === "vi"
        ? "Generate topics and descriptions in Vietnamese."
        : "Generate topics and descriptions in English.";

  return `You are a content strategist for DMF Talents.

${langInstructions}

COMPANY CONTEXT:
${COMPANY_CONTEXT}

${category ? `FOCUS CATEGORY: ${category}` : "INCLUDE DIVERSE CATEGORIES"}

Generate 6 blog topic suggestions that would interest German HR managers and business owners looking to hire Vietnamese workers.

Consider:
- Employer questions about planning and comparing recruitment options
- Common questions about hiring foreign workers
- Seasonal topics (if applicable)
- Customer case studies only when the editor supplies documented facts and permission; otherwise suggest a practical checklist
- Industry-specific content (Pflege, Gastronomie, Handwerk)

${FACTS_GUARDRAIL}

OUTPUT FORMAT:
Return a valid JSON array with exactly this structure:
[
  {
    "topic": "Blog title idea",
    "description": "2-3 sentence description of what the blog would cover",
    "category": "one of: visa-legal, german-culture, industry-specific, language-learning, success-stories, company-news",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  }
]

IMPORTANT: Return ONLY the JSON array, no markdown code blocks or additional text.`;
}

export function buildTranslationPrompt(
  content: string,
  sourceLanguage: BlogLanguage,
  targetLanguage: BlogLanguage
): string {
  return `Translate the following blog content from ${sourceLanguage.toUpperCase()} to ${targetLanguage.toUpperCase()}.

REQUIREMENTS:
- Maintain the exact same HTML structure
- Preserve all HTML tags
- Adapt idioms and expressions naturally
- Keep brand names and technical terms as appropriate
- Ensure the translation reads naturally, not like a direct translation

SOURCE CONTENT:
${content}

OUTPUT:
Return ONLY the translated content with preserved HTML structure.`;
}
