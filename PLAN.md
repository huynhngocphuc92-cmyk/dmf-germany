# AI Blog Writer - Implementation Plan

## Overview

Full-featured AI Blog Writer tích hợp vào Admin Panel, sử dụng Claude API để tạo nội dung blog chất lượng cao với SEO optimization và multi-language support.

---

## Phase 1: Core API & Types

### 1.1 Database Schema Update

**File:** `supabase/migrations/add_ai_blog_fields.sql`

```sql
ALTER TABLE posts ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT FALSE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS ai_prompt TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS keywords TEXT[];
ALTER TABLE posts ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'de';
```

### 1.2 Types Definition

**File:** `app/admin/blog-writer/types.ts`

```typescript
export interface BlogGenerationRequest {
  topic: string;
  language: "de" | "en" | "vi";
  tone: "professional" | "friendly" | "educational";
  length: "short" | "medium" | "long"; // 500, 1000, 1500 words
  keywords?: string[];
  outline?: string;
  includeImages?: boolean;
}

export interface GeneratedBlog {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  suggestedImages: ImageSuggestion[];
  estimatedReadTime: number;
}

export interface ImageSuggestion {
  query: string;
  description: string;
  unsplashUrl?: string;
}

export interface TopicSuggestion {
  topic: string;
  description: string;
  category: string;
  seoScore: number;
  keywords: string[];
}
```

### 1.3 API Route - Generate Blog

**File:** `app/api/admin/blog-writer/generate/route.ts`

- POST endpoint với authentication check
- Sử dụng Claude Sonnet cho full blog generation
- Streaming response cho UX tốt hơn
- Rate limiting (5 requests/hour per user)

### 1.4 API Route - Topic Suggestions

**File:** `app/api/admin/blog-writer/topics/route.ts`

- GET endpoint trả về 5-10 topic suggestions
- Dựa trên: trending keywords, company focus areas, seasonal content
- Sử dụng Claude Haiku cho cost efficiency

### 1.5 API Route - Image Search

**File:** `app/api/admin/blog-writer/images/route.ts`

- GET endpoint tìm kiếm Unsplash API
- Trả về 6-12 hình ảnh phù hợp với topic

---

## Phase 2: Server Actions

**File:** `app/admin/blog-writer/actions.ts`

```typescript
"use server";

export async function generateBlogPost(request: BlogGenerationRequest);
export async function getTopicSuggestions(category?: string);
export async function searchImages(query: string);
export async function saveDraft(blog: GeneratedBlog);
export async function translateBlog(postId: string, targetLang: "de" | "en" | "vi");
```

---

## Phase 3: UI Components

### 3.1 Main Page

**File:** `app/admin/blog-writer/page.tsx`

Layout với 3 panels:

- Left: Topic Suggestions
- Center: Generation Form & Preview
- Right: Image Selection

### 3.2 Topic Suggester

**File:** `app/admin/blog-writer/components/TopicSuggester.tsx`

- Cards hiển thị topic suggestions
- Filter by category
- Refresh button
- Click to select topic

### 3.3 Generation Form

**File:** `app/admin/blog-writer/components/GenerationForm.tsx`

Form fields:

- Topic input (text)
- Language selector (DE/EN/VI tabs)
- Tone selector (radio buttons)
- Length selector (slider: 500-1500 words)
- Keywords input (tags)
- Custom outline (optional textarea)
- Generate button với loading state

### 3.4 Content Preview

**File:** `app/admin/blog-writer/components/ContentPreview.tsx`

- Live preview của generated content
- SEO score indicator
- Edit inline capability
- Copy to clipboard
- "Send to Editor" button

### 3.5 Image Selector

**File:** `app/admin/blog-writer/components/ImageSelector.tsx`

- Grid of suggested images
- Search functionality
- Click to select as cover image
- Preview selected image

### 3.6 SEO Panel

**File:** `app/admin/blog-writer/components/SEOPanel.tsx`

- Meta title preview (with character count)
- Meta description preview
- Keywords display
- Google SERP preview mockup
- SEO score breakdown

---

## Phase 4: Prompt Engineering

**File:** `lib/prompts/blog-writer.ts`

### System Prompt Template

```
You are an expert blog writer for DMF Vietnam, a company that specializes in recruiting and training Vietnamese workers for German businesses.

Your writing style is {tone}, and you write in {language}.

COMPANY CONTEXT:
{knowledgeBase}

CONTENT GUIDELINES:
- Write SEO-optimized content
- Use proper HTML structure (h2, h3, p, ul, ol)
- Include actionable insights
- Reference DMF's services where relevant
- Target: HR managers and business owners in Germany

OUTPUT FORMAT:
Return a JSON object with: title, slug, excerpt, content (HTML), metaTitle, metaDescription, keywords
```

### Topic Categories & Focus Areas

```typescript
const TOPIC_CATEGORIES = {
  "visa-legal": ["Visa updates", "Legal requirements", "Work permits"],
  "german-culture": ["Work culture", "Integration tips", "Daily life"],
  "industry-specific": ["Pflege", "Gastronomie", "Handwerk", "IT"],
  "language-learning": ["German tips", "B1/B2 preparation", "Industry vocabulary"],
  "success-stories": ["Case studies", "Testimonials"],
  "company-news": ["DMF updates", "Events", "Partnerships"],
};
```

---

## Phase 5: Integration & Polish

### 5.1 Admin Sidebar Update

- Add "Blog Writer" menu item with sparkle icon

### 5.2 Quick Generate from Posts List

- Add "Generate with AI" button in posts list page

### 5.3 Analytics

**File:** `app/admin/blog-writer/components/GenerationHistory.tsx`

- Track generated blogs
- Show usage statistics
- Cost estimation

---

## File Structure Summary

```
app/admin/blog-writer/
├── page.tsx                    # Main page
├── actions.ts                  # Server actions
├── types.ts                    # TypeScript types
└── components/
    ├── TopicSuggester.tsx
    ├── GenerationForm.tsx
    ├── ContentPreview.tsx
    ├── ImageSelector.tsx
    ├── SEOPanel.tsx
    └── GenerationHistory.tsx

app/api/admin/blog-writer/
├── generate/route.ts           # Main generation endpoint
├── topics/route.ts             # Topic suggestions
└── images/route.ts             # Image search (Unsplash)

lib/prompts/
└── blog-writer.ts              # Prompt templates
```

---

## Implementation Order

1. **Types & API Routes** (Phase 1)
   - Define types
   - Create generate API route
   - Test with Postman/curl

2. **Server Actions** (Phase 2)
   - Wrap API calls in server actions
   - Add error handling

3. **UI Components** (Phase 3)
   - Build components one by one
   - Start with GenerationForm
   - Then ContentPreview
   - Then TopicSuggester
   - Finally ImageSelector & SEOPanel

4. **Prompts & Fine-tuning** (Phase 4)
   - Optimize prompts for quality
   - Test with various topics
   - Adjust based on output

5. **Integration** (Phase 5)
   - Add to admin sidebar
   - Polish UI/UX
   - Add analytics

---

## Environment Variables Needed

```env
# Already exists
ANTHROPIC_API_KEY=xxx

# New
UNSPLASH_ACCESS_KEY=xxx
```

---

## Estimated Files to Create/Modify

| Action | File                                          | Description    |
| ------ | --------------------------------------------- | -------------- |
| CREATE | `app/admin/blog-writer/page.tsx`              | Main page      |
| CREATE | `app/admin/blog-writer/actions.ts`            | Server actions |
| CREATE | `app/admin/blog-writer/types.ts`              | Types          |
| CREATE | `app/admin/blog-writer/components/*.tsx`      | 6 components   |
| CREATE | `app/api/admin/blog-writer/generate/route.ts` | Generate API   |
| CREATE | `app/api/admin/blog-writer/topics/route.ts`   | Topics API     |
| CREATE | `app/api/admin/blog-writer/images/route.ts`   | Images API     |
| CREATE | `lib/prompts/blog-writer.ts`                  | Prompts        |
| MODIFY | `components/admin/AdminSidebar.tsx`           | Add menu item  |
| MODIFY | `app/admin/posts/types.ts`                    | Add AI fields  |

**Total: ~12 files**

---

## Security Checklist

- [ ] Admin authentication required
- [ ] Rate limiting per user
- [ ] Input sanitization
- [ ] API key protection
- [ ] Content moderation flag
