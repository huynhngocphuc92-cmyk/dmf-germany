// AI Blog Writer Prompts (GEO-First Editorial Architecture)

import {
  BlogGenerationRequest,
  BlogLanguage,
  BlogTone,
  LENGTH_CONFIG,
} from "@/app/admin/blog-writer/types";
import { GEO_EDITORIAL_STANDARDS, getGeoTopicsByCategory } from "@/lib/geo/topic-matrix";

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

export const COMPANY_CONTEXT = `
DMF Talents is the German-facing brand on https://www.dmf-talents.de.
Its website presents recruitment from Vietnam for employers in Germany, including skilled workers (§ 18a/b, § 16d AufenthG), trainees (§ 16a AufenthG) and seasonal staff (§ 19c AufenthG).

TARGET AUDIENCE:
German business owners, HR managers, clinic/care-home directors (Pflegedienstleitungen) and operational managers considering international recruitment.
Their questions concern role requirements, legal pathways (FEG / AufenthG), credential recognition (BQFG / IHK FOSA / HWK), candidate selection, responsibilities, service scope, budgeting and 90-day onboarding.

VERIFIED INTERNAL DESTINATIONS (link only when relevant):
- Skilled workers (§ 18a/b, § 16d AufenthG): /services/skilled-workers
- Trainees / Apprentices (§ 16a AufenthG): /services/azubi
- Seasonal staff (§ 19c AufenthG): /services/seasonal
- Discuss a staffing requirement (B2B intake): /fuer-arbeitgeber/personalbedarf
- Fast-track timeline simulator (§ 81a AufenthG): /fuer-arbeitgeber/zeitplan
- ROI & cost-of-vacancy calculator: /roi-rechner
- Pre-vetted candidate pool: /fuer-arbeitgeber/kandidaten
- Industry vertical solutions: /fuer-arbeitgeber/branchen

Do not infer DMF's prices, staff qualifications, certifications, partnerships, placement volumes, success rates, candidate availability or support duration from this context. These require approved evidence supplied by the editor.
`;

export const FACTS_GUARDRAIL = `
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

export const GEO_STRUCTURE_INSTRUCTIONS = `
GEO (GENERATIVE ENGINE OPTIMIZATION) & AI CITATION ARCHITECTURE:
1. ANSWER-FIRST TL;DR BLOCK: ${GEO_EDITORIAL_STANDARDS.tldrRequirement} Format this opening takeaway as <p><strong>Das Wichtigste in Kürze:</strong> ...</p> (or the equivalent in the requested language).
2. QUESTION-BASED SUBHEADINGS FOR AUTOMATIC FAQ SCHEMA: ${GEO_EDITORIAL_STANDARDS.questionHeadingsRequirement}
3. STRUCTURED COMPARISON TABLE: ${GEO_EDITORIAL_STANDARDS.comparisonTableRequirement}
4. STATUTORY & ENTITY ANCHORING: ${GEO_EDITORIAL_STANDARDS.entityAnchoringRequirement}
`;

export function buildBlogSystemPrompt(request: BlogGenerationRequest): string {
  const wordCount = LENGTH_CONFIG[request.length].words;

  return `You are a blog writer preparing an editorial draft for DMF Talents.

${LANGUAGE_INSTRUCTIONS[request.language]}

${TONE_INSTRUCTIONS[request.tone]}

COMPANY CONTEXT:
${COMPANY_CONTEXT}

${GEO_STRUCTURE_INSTRUCTIONS}

CONTENT REQUIREMENTS:
- Aim for approximately ${wordCount} words when the subject warrants it; do not pad the article for SEO
- Use proper HTML structure: <h2>, <h3>, <p>, <ul>, <ol>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <strong>, <em>
- Start with an engaging Answer-First summary ("Das Wichtigste in Kürze:") in the opening paragraph (no <h1> - title is separate)
- Include 3-5 subheadings (<h2> or <h3>), with at least 2-3 phrased as direct employer questions ending with "?" followed immediately by a concise 2-sentence answer paragraph (<p>)
- Include a structured HTML comparison table (<table>) when comparing legal pathways, roles, responsibilities or process steps
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

  const blueprints = getGeoTopicsByCategory(category).slice(0, 6);
  const blueprintText = blueprints
    .map(
      (b, idx) =>
        `${idx + 1}. Prompt: "${b.targetPromptDe}" -> Angle: "${b.recommendedTitleDe}" (Entities: ${b.legalEntities.join(", ")})`
    )
    .join("\n");

  return `You are a B2B GEO (Generative Engine Optimization) content strategist for DMF Talents.

${langInstructions}

COMPANY CONTEXT:
${COMPANY_CONTEXT}

${category ? `FOCUS CATEGORY: ${category}` : "INCLUDE DIVERSE CATEGORIES"}

HIGH-INTENT B2B EMPLOYER PROMPT ARCHETYPES (use as strategic inspiration for AI-search citation):
${blueprintText}

Generate 6 blog topic suggestions that directly answer high-intent questions German HR managers, clinic directors and business owners ask AI answer engines (ChatGPT, Perplexity, Google AI Overviews, Claude) when planning to recruit Vietnamese skilled workers or apprentices.

Consider:
- Employer questions about planning and comparing recruitment pathways (§ 18a/b, § 16d, § 16a, § 81a AufenthG, § 296a SGB III)
- Decision matrices comparing costs (Cost of Vacancy vs. direct recruitment), recognition routes (BQFG, IHK FOSA, HWK), and onboarding
- Seasonal topics (if applicable)
- Customer case studies only when the editor supplies documented facts and permission; otherwise suggest a practical checklist or comparison guide
- Industry-specific content (Pflege, Gastronomie, Handwerk, Industrie & Metall)

${FACTS_GUARDRAIL}

OUTPUT FORMAT:
Return a valid JSON array with exactly this structure:
[
  {
    "topic": "Blog title idea",
    "description": "2-3 sentence description of what the blog would cover, including target legal entities and comparison criteria",
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
