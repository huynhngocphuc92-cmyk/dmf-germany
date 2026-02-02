import { notFound } from "next/navigation";
import { getPostById } from "../actions";
import { PostFormClient } from "../post-form-client";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const { data: post, error } = await getPostById(id);

  if (error || !post) {
    notFound();
  }

  return <PostFormClient mode="edit" initialPost={post} />;
}
