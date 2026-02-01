import { Metadata } from "next";
import BlogWriterClient from "./blog-writer-client";

export const metadata: Metadata = {
  title: "AI Blog Writer | Admin",
  description: "Create high-quality blog posts with AI assistance",
};

export default function BlogWriterPage() {
  return <BlogWriterClient />;
}
