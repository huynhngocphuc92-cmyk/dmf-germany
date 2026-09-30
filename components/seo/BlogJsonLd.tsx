import type { Post } from "@/app/admin/posts/types";
import { blogStructuredData, serializeJsonLd } from "@/lib/seo/blog";

export default function BlogJsonLd({ post }: { post: Post }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogStructuredData(post)) }}
    />
  );
}
