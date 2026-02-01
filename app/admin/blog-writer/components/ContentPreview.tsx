"use client";

import { useState } from "react";
import { FileText, Copy, Check, Edit3, Save, ExternalLink, Clock, Hash } from "lucide-react";
import { GeneratedBlog } from "../types";
import { saveBlogAsDraft, publishBlog } from "../actions";
import { useRouter } from "next/navigation";

interface ContentPreviewProps {
  blog: GeneratedBlog | null;
  onEdit?: (blog: GeneratedBlog) => void;
}

export function ContentPreview({ blog, onEdit }: ContentPreviewProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  if (!blog) {
    return (
      <div className="bg-white rounded-xl border p-6 h-full flex items-center justify-center">
        <div className="text-center text-slate-400">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Generierter Blog wird hier angezeigt</p>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(blog.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    const result = await saveBlogAsDraft(blog);
    setSaving(false);

    if (result.success && result.id) {
      router.push(`/admin/posts/${result.id}`);
    } else {
      alert(result.error || "Fehler beim Speichern");
    }
  };

  const handlePublish = async () => {
    if (!confirm("Blog direkt veröffentlichen?")) return;

    setPublishing(true);
    const result = await publishBlog(blog);
    setPublishing(false);

    if (result.success) {
      router.push("/admin/posts");
    } else {
      alert(result.error || "Fehler beim Veröffentlichen");
    }
  };

  const startEditing = () => {
    setEditedContent(blog.content);
    setIsEditing(true);
  };

  const saveEdits = () => {
    if (onEdit) {
      onEdit({ ...blog, content: editedContent });
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl border overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
            {blog.language.toUpperCase()}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {blog.estimatedReadTime} min Lesezeit
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="HTML kopieren"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-slate-500" />
            )}
          </button>
          {isEditing ? (
            <button
              onClick={saveEdits}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Änderungen speichern"
            >
              <Save className="w-4 h-4 text-blue-600" />
            </button>
          ) : (
            <button
              onClick={startEditing}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Bearbeiten"
            >
              <Edit3 className="w-4 h-4 text-slate-500" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Title & Excerpt */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{blog.title}</h1>
          <p className="text-slate-600 italic">{blog.excerpt}</p>
        </div>

        {/* Keywords */}
        <div className="mb-6 flex flex-wrap gap-1.5">
          {blog.keywords.map((kw, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-slate-100 rounded text-slate-600"
            >
              <Hash className="w-3 h-3" />
              {kw}
            </span>
          ))}
        </div>

        {/* Content */}
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-96 p-4 border rounded-lg font-mono text-sm resize-none"
          />
        ) : (
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        )}
      </div>

      {/* SEO Preview */}
      <div className="p-4 border-t bg-slate-50">
        <p className="text-xs font-medium text-slate-500 mb-2">SEO Vorschau</p>
        <div className="p-3 bg-white rounded-lg border">
          <p className="text-blue-700 text-sm font-medium hover:underline cursor-pointer flex items-center gap-1">
            {blog.metaTitle}
            <ExternalLink className="w-3 h-3" />
          </p>
          <p className="text-xs text-green-700 mt-0.5">dmf-germany.de/blog/{blog.slug}</p>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{blog.metaDescription}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t flex gap-3">
        <button
          onClick={handleSaveDraft}
          disabled={saving}
          className="flex-1 py-2.5 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          {saving ? "Speichern..." : "Als Entwurf speichern"}
        </button>
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {publishing ? "Veröffentlichen..." : "Veröffentlichen"}
        </button>
      </div>
    </div>
  );
}
