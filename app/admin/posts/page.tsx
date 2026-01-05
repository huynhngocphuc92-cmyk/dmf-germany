import { getPosts } from "./actions";
import { PostsClient } from "./posts-client";

// Force dynamic rendering (uses cookies for auth)
export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  const { data: posts, error } = await getPosts();
  
  if (error) {
    console.error("Error loading posts:", error);
  }
  
  return <PostsClient initialPosts={posts || []} />;
}

