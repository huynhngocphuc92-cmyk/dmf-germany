"use server";

import { postFormSchema } from "@/lib/validations/schemas";
import { revalidatePath } from "next/cache";
import { createAdminClient as createClient } from "@/lib/auth/admin";
import { createPublicClient } from "@/utils/supabase/public";
import type { Post, PostFormData } from "./types";

// ============================================
// FETCH POSTS
// ============================================

export async function getPosts(): Promise<{ data: Post[] | null; error: string | null }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      return { data: null, error: error.message };
    }

    return { data: data as Post[], error: null };
  } catch (err) {
    console.error("Error in getPosts:", err);
    return { data: null, error: "Failed to fetch posts" };
  }
}

export async function getPublishedPosts(): Promise<{ data: Post[] | null; error: string | null }> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching published posts:", error);
      return { data: null, error: error.message };
    }

    return { data: data as Post[], error: null };
  } catch (err) {
    console.error("Error in getPublishedPosts:", err);
    return { data: null, error: "Failed to fetch posts" };
  }
}

export async function getPostById(
  id: string
): Promise<{ data: Post | null; error: string | null }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();

    if (error) {
      console.error("Error fetching post:", error);
      return { data: null, error: error.message };
    }

    return { data: data as Post, error: null };
  } catch (err) {
    console.error("Error in getPostById:", err);
    return { data: null, error: "Failed to fetch post" };
  }
}

export async function getPostBySlug(
  slug: string
): Promise<{ data: Post | null; error: string | null }> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      console.error("Error fetching post by slug:", error);
      return { data: null, error: error.message };
    }

    return { data: data as Post, error: null };
  } catch (err) {
    console.error("Error in getPostBySlug:", err);
    return { data: null, error: "Failed to fetch post" };
  }
}

// ============================================
// CREATE POST
// ============================================

export async function createPost(
  formData: PostFormData
): Promise<{ data: Post | null; error: string | null }> {
  try {
    const supabase = await createClient();
    formData = postFormSchema.parse(formData);

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const postData = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt || null,
      content: formData.content,
      cover_image: formData.cover_image || null,
      status: formData.status,
      published_at: formData.status === "published" ? new Date().toISOString() : null,
      author_id: user?.id || null,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
    };

    const { data, error } = await supabase.from("posts").insert(postData).select().single();

    if (error) {
      console.error("Error creating post:", error);
      return { data: null, error: error.message };
    }

    revalidatePath("/admin/posts");
    revalidatePath("/blog", "layout");
    revalidatePath("/sitemap.xml");

    return { data: data as Post, error: null };
  } catch (err) {
    console.error("Error in createPost:", err);
    return { data: null, error: "Failed to create post" };
  }
}

// ============================================
// UPDATE POST
// ============================================

export async function updatePost(
  id: string,
  formData: PostFormData
): Promise<{ data: Post | null; error: string | null }> {
  try {
    const supabase = await createClient();

    formData = postFormSchema.parse(formData);
    // Get existing post to check if we need to update published_at
    const { data: existingPost } = await supabase
      .from("posts")
      .select("status, published_at, slug")
      .eq("id", id)
      .single();

    // Set published_at if publishing for first time
    let published_at = existingPost?.published_at;
    if (formData.status === "published" && existingPost?.status !== "published") {
      published_at = new Date().toISOString();
    }

    const postData = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt || null,
      content: formData.content,
      cover_image: formData.cover_image || null,
      status: formData.status,
      published_at,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("posts")
      .update(postData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating post:", error);
      return { data: null, error: error.message };
    }

    revalidatePath("/admin/posts");
    revalidatePath("/blog", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath(`/blog/${formData.slug}`);
    if (existingPost?.slug) revalidatePath(`/blog/${existingPost.slug}`);

    return { data: data as Post, error: null };
  } catch (err) {
    console.error("Error in updatePost:", err);
    return { data: null, error: "Failed to update post" };
  }
}

// ============================================
// DELETE POST
// ============================================

export async function deletePost(id: string): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient();

    // Get post to find cover image
    const { data: post } = await supabase
      .from("posts")
      .select("cover_image, slug")
      .eq("id", id)
      .single();

    // Delete cover image from storage if exists
    if (post?.cover_image) {
      const imagePath = post.cover_image.split("/").pop();
      if (imagePath) {
        await supabase.storage.from("images").remove([imagePath]);
      }
    }

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      console.error("Error deleting post:", error);
      return { error: error.message };
    }

    revalidatePath("/admin/posts");
    revalidatePath("/blog", "layout");
    revalidatePath("/sitemap.xml");
    if (post?.slug) {
      revalidatePath(`/blog/${post.slug}`);
    }

    return { error: null };
  } catch (err) {
    console.error("Error in deletePost:", err);
    return { error: "Failed to delete post" };
  }
}

// ============================================
// IMAGE UPLOAD
// ============================================

export async function uploadCoverImage(
  formData: FormData
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = await createClient();

    const file = formData.get("file") as File;
    if (!file) {
      return { url: null, error: "No file provided" };
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("images").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return { url: null, error: uploadError.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);

    return { url: urlData.publicUrl, error: null };
  } catch (err) {
    console.error("Error in uploadCoverImage:", err);
    return { url: null, error: "Failed to upload image" };
  }
}

export async function deleteCoverImage(url: string): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient();

    // Extract filename from URL
    const fileName = url.split("/").pop();
    if (!fileName) {
      return { error: "Invalid image URL" };
    }

    const { error } = await supabase.storage.from("images").remove([fileName]);

    if (error) {
      console.error("Error deleting image:", error);
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    console.error("Error in deleteCoverImage:", err);
    return { error: "Failed to delete image" };
  }
}

// ============================================
// RELATED POSTS
// ============================================

export async function getRelatedPosts(
  currentSlug: string,
  limit: number = 3
): Promise<{ data: Post[] | null; error: string | null }> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .neq("slug", currentSlug)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching related posts:", error);
      return { data: null, error: error.message };
    }

    return { data: data as Post[], error: null };
  } catch (err) {
    console.error("Error in getRelatedPosts:", err);
    return { data: null, error: "Failed to fetch related posts" };
  }
}

/** Resolve directly to the current published slug, so repeated renames never form chains. */
export async function getPublishedRedirect(slug: string): Promise<string | null> {
  const supabase = createPublicClient();
  const { data: alias, error: aliasError } = await supabase
    .from("post_slug_redirects")
    .select("post_id")
    .eq("slug", slug)
    .maybeSingle();
  if (aliasError) throw new Error("Blog URL lookup unavailable");
  if (!alias) return null;
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", alias.post_id)
    .eq("status", "published")
    .maybeSingle();
  if (postError) throw new Error("Blog URL target unavailable");
  return post?.slug && post.slug !== slug ? post.slug : null;
}
